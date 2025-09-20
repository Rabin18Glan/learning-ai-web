import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import Subscription from "@/models/Subscription";
import User from "@/models/User";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "5", 10);

    await connectToDatabase();
  
    const subscriptions = await Subscription.find()
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    const totalItems = await Subscription.countDocuments();

    // Calculate statistics
    const activeCount = await Subscription.countDocuments({ status: "active" });
    const trialCount = await Subscription.countDocuments({ status: "trial" });
    const canceledCount = await Subscription.countDocuments({
      status: "canceled",
    });
    const totalCount = await Subscription.countDocuments();
    const churnRate =
      totalCount > 0 ? ((canceledCount / totalCount) * 100).toFixed(1) : "0.0";

const formattedSubscriptions = await Promise.all(
  subscriptions.map(async (sub) => {
    console.log(sub.userId);
    const userData = await User.findOne({_id: sub.userId});
    console.log(userData);
    
    return {
      _id: sub._id as string,
      userId: sub.userId,
      userName: userData?.name || "User Not Found",
      userEmail: userData?.email || "Email Not Found",
      plan: sub.plan,
      status: sub.status,
      startDate: sub.startDate.toISOString(),
      endDate: sub.endDate?.toISOString(),
      trialEndDate: sub.trialEndDate?.toISOString(),
      billingCycle: sub.billingCycle,
      price: sub.price,
      currency: sub.currency,
      paymentMethod: {
        type: sub.paymentMethod?.type,
        brand: sub.paymentMethod?.brand,
        last4: sub.paymentMethod?.last4,
      },
      autoRenew: sub.autoRenew,
    };
  })
);

    return NextResponse.json({
      subscriptions: formattedSubscriptions,
      currentPage: page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
      stats: {
        activeSubscriptions: activeCount,
        trialUsers: trialCount,
        churnRate: `${churnRate}%`,
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}