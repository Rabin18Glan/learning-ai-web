

import Subscription from "@/models/Subscription"; // Adjust path to your Subscription model
import crypto from "crypto";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

// eSewa configuration
const ESEWA_GATEWAY_URL =
  process.env.ESEWA_GATEWAY_URL ||
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const SUCCESS_URL = "http://localhost:3000/api/subscriptions/verify";
const FAILURE_URL ="http://localhost:3000/api/subscriptions/failure";

// Generate random transaction UUID (alphanumeric and hyphens only)
function generateTransactionUUID(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  let result = "";
  for (let i = 0; i < 25; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate HMAC-SHA256 signature
function generateSignature(message: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(message).digest("base64");
}

export async function POST(req: NextRequest) {
  try {
    const { plan, billingCycle, amount } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate request body
    if (!userId || !plan || !billingCycle || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Validate plan and billing cycle
    if (!["free", "pro", "premium"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!["monthly", "annual"].includes(billingCycle)) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    // Generate transaction details
    const transactionUUID = generateTransactionUUID();
    const taxAmount = 0;
    const serviceCharge = 0;
    const deliveryCharge = 0;
    const totalAmount = amount;

    // Generate signature
    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${ESEWA_MERCHANT_CODE}`;
    const signature = generateSignature(message, ESEWA_SECRET_KEY);

    // Create or update subscription
    let subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      subscription = new Subscription({
        userId,
        plan,
        status: "pending",
        billingCycle,
        price: amount,
        currency: "NPR",
        startDate: new Date(),
        autoRenew: true,
        paymentMethod: { type: "esewa" },
        invoices: [
          {
            invoiceId: transactionUUID,
            amount: totalAmount,
            currency: "NPR",
            status: "unpaid",
            date: new Date(),
          },
        ],
      });
    } else {
      subscription.plan = plan;
      subscription.billingCycle = billingCycle;
      subscription.price = amount;
      subscription.status = "pending";
      subscription.invoices.push({
        invoiceId: transactionUUID,
        amount: totalAmount,
        currency: "NPR",
        status: "unpaid",
        date: new Date(),
      });
    }
    await subscription.save();

    // eSewa form data
    const formData = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      transaction_uuid: transactionUUID,
      product_code: ESEWA_MERCHANT_CODE,
      product_service_charge: serviceCharge.toString(),
      product_delivery_charge: deliveryCharge.toString(),
      success_url: SUCCESS_URL,
      failure_url: FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    };

    return NextResponse.json({ formData, actionUrl: ESEWA_GATEWAY_URL });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
