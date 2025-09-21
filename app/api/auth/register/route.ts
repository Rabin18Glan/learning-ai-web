import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, provider } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Please provide name and email" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }
      );
    }

    // Start a transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new user
      const user = new User({
        name,
        email,
        password, // May be undefined for OAuth users
        subscriptionPlan: "free",
        subscriptionStatus: "active",
        isActive: true,
        provider: provider || "credentials",
        lastLogin: new Date(),
        createdAt: new Date(),
      });

      await user.save({ session });

      // Create default free subscription
      const subscription = new Subscription({
        userId: user._id.toString(),
        plan: "free",
        status: "active",
        startDate: new Date(),
        billingCycle: "none", // No billing for free plan
        price: 0,
        currency: "USD",
        paymentMethod: { type: "none" },
        autoRenew: false,
        invoices: [],
      });

      await subscription.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      return NextResponse.json(
        {
          success: true,
          message: "User registered successfully",
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
      // Rollback transaction on error
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