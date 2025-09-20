import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import Subscription from "@/models/Subscription";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    const subscription = await Subscription.findById(params.id);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.status === "canceled") {
      return NextResponse.json({ error: "Subscription already canceled" }, { status: 400 });
    }

    subscription.status = "canceled";
    subscription.cancelReason = "Canceled by admin";
    subscription.autoRenew = false;
    await subscription.save();

    return NextResponse.json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}