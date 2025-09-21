
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

import Subscription from "@/models/Subscription";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    const subscription = await Subscription.findOne({ userId });

    if (!subscription) {
      return NextResponse.json({ invoices: [] });
    }

    const invoices = subscription.invoices.map((inv:any) => ({
      id: inv.invoiceId,
      date: new Date(inv.date).toLocaleDateString(),
      amount: `NPR ${inv.amount}`,
      status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
    }));

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}