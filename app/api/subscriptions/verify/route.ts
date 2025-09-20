
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import crypto from "crypto"
import Subscription from "@/models/Subscription" // Adjust path to your Subscription model

// eSewa configuration
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q"
const SUCCESS_URL = process.env.SUCCESS_URL || "http://localhost:3000/payment-success"
const FAILURE_URL = process.env.FAILURE_URL || "http://localhost:3000/payment-failure"

// Generate HMAC-SHA256 signature
function generateSignature(message: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(message).digest("base64")
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const data = searchParams.get("data")

  if (!data) {
    return NextResponse.redirect(`${FAILURE_URL}?error=invalid_data`)
  }

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "")
    }

    // Decode and parse response
    const decodedData = Buffer.from(data, "base64").toString("utf-8")
    const parsedData = JSON.parse(decodedData)
    const { transaction_uuid, total_amount, signature, signed_field_names, status } = parsedData

    // Validate response
    if (!transaction_uuid || !total_amount || !signature || !signed_field_names || !status) {
      return NextResponse.redirect(`${FAILURE_URL}?error=invalid_response_data`)
    }

    // Verify signature
    const message = signed_field_names
      .split(",")
      .map((field: string) => `${field}=${parsedData[field]}`)
      .join(",")
    const generatedSignature = generateSignature(message, ESEWA_SECRET_KEY)

    if (generatedSignature !== signature) {
      return NextResponse.redirect(`${FAILURE_URL}?error=invalid_signature`)
    }

    // Find subscription
    const subscription = await Subscription.findOne({
      "invoices.invoiceId": transaction_uuid,
    })

    if (!subscription) {
      return NextResponse.redirect(`${FAILURE_URL}?error=subscription_not_found`)
    }

    const invoice = subscription.invoices.find((inv:any) => inv.invoiceId === transaction_uuid)
    if (!invoice) {
      return NextResponse.redirect(`${FAILURE_URL}?error=invoice_not_found`)
    }

    // Update based on status
    switch (status) {
      case "COMPLETE":
        invoice.status = "paid"
        subscription.status = "active"
        subscription.startDate = new Date()
        subscription.endDate = subscription.billingCycle === "monthly"
          ? new Date(new Date().setMonth(new Date().getMonth() + 1))
          : new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        break
      case "PENDING":
      case "AMBIGUOUS":
        invoice.status = "unpaid"
        subscription.status = "pending"
        break
      case "FULL_REFUND":
      case "PARTIAL_REFUND":
        invoice.status = "refunded"
        subscription.status = "canceled"
        subscription.cancelReason = `Refunded: ${status}`
        break
      case "CANCELED":
      case "NOT_FOUND":
        invoice.status = "unpaid"
        subscription.status = "canceled"
        subscription.cancelReason = `Transaction ${status.toLowerCase()}`
        break
      default:
        return NextResponse.redirect(`${FAILURE_URL}?error=unknown_status`)
    }

    await subscription.save()

    return status === "COMPLETE"
      ? NextResponse.redirect(SUCCESS_URL)
      : NextResponse.redirect(`${FAILURE_URL}?error=transaction_${status.toLowerCase()}`)
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.redirect(`${FAILURE_URL}?error=verification_failed&details=${encodeURIComponent((error as Error).message)}`)
  }
}
