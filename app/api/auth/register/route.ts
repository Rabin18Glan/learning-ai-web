import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import mongoose from "mongoose";
import { generateToken, sendVerificationEmail } from "@/utils/email-service";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, provider } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and password" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const verificationToken = generateToken(email, "verify");
      const user = new User({
        name,
        email,
        password,
        subscriptionPlan: "free",
        subscriptionStatus: "active",
        isActive: true,
        isVerified: false,
        verificationToken,
        provider: provider || "credentials",
        lastLogin: new Date(),
        createdAt: new Date(),
      });

      await user.save({ session });

      const subscription = new Subscription({
        userId: user._id.toString(),
        plan: "free",
        status: "active",
        startDate: new Date(),
        billingCycle: "none",
        price: 0,
        currency: "USD",
        paymentMethod: { type: "none" },
        autoRenew: false,
        invoices: [],
      });

      await subscription.save({ session });
      await sendVerificationEmail(email, verificationToken);

      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully. Please check your email to verify your account.",
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStatus: user.subscriptionStatus,
            isActive: user.isActive,
            provider: user.provider,
          },
          subscription: {
            id: subscription._id.toString(),
            plan: subscription.plan,
            status: subscription.status,
            startDate: subscription.startDate.toISOString(),
            billingCycle: subscription.billingCycle,
            price: subscription.price,
            currency: subscription.currency,
            autoRenew: subscription.autoRenew,
          },
        },
        { status: 201 }
      );
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred during registration" },
      { status: 500 }
    );
  }
}