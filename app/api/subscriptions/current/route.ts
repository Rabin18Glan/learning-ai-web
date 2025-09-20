// app/api/subscriptions/current/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Subscription from "@/models/Subscription";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    const subscription = await Subscription.findOne({ userId }).sort({ createdAt: -1 });

    if (!subscription || subscription.status !== "active") {
      return NextResponse.json({ plan: null });
    }

    return NextResponse.json({
      plan: {
        id: subscription._id.toString(),
        name: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1),
        billingCycle: subscription.billingCycle,
        price: subscription.price,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        verified: true, // Since status is active, consider it verified
      },
    });
  } catch (error) {
    console.error("Error fetching current subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}