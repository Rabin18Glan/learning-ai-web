import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Subscription from "@/models/Subscription";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10", 10);

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    // Fetch subscriptions with populated user details
    const subscriptions = await Subscription.find()
      .populate("userId", "name email")
      .lean();

    // Flatten invoices and add user details
    let invoices = subscriptions.flatMap((sub) =>
      sub.invoices.map((inv: any) => ({
        id: inv.invoiceId,
        userId: sub.userId?._id?.toString() || "Unknown",
        userName: sub.userId?.name || "Unknown User",
        userEmail: sub.userId?.email || "N/A",
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        method: sub.paymentMethod?.type || "N/A",
        last4: sub.paymentMethod?.last4,
        date: inv.date,
        invoiceUrl: inv.pdfUrl || "#",
      }))
    );

    // Calculate statistics
    const totalRevenue = invoices.reduce((sum, inv) => (inv.status === "paid" ? sum + inv.amount : sum), 0);
    const successfulPayments = invoices.filter((inv) => inv.status === "paid").length;
    const refunds = invoices.filter((inv) => inv.status === "refunded").length;

    // Paginate invoices
    const totalItems = invoices.length;
    const paginatedInvoices = invoices.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    // Format invoices for response
    const formattedInvoices = paginatedInvoices.map((inv) => ({
      id: inv.id,
      userId: inv.userId,
      userName: inv.userName,
      userEmail: inv.userEmail,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
      method: inv.method,
      last4: inv.last4,
      date: inv.date.toISOString(),
      invoiceUrl: inv.invoiceUrl,
    }));

    return NextResponse.json({
      invoices: formattedInvoices,
      currentPage: page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
      stats: {
        totalRevenue,
        successfulPayments,
        refunds,
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId } = await req.json();

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "");
    }

    // Find subscription containing the invoice
    const subscription = await Subscription.findOne({ "invoices.invoiceId": invoiceId });
    if (!subscription) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const invoice = subscription.invoices.find((inv: any) => inv.invoiceId === invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "refunded") {
      return NextResponse.json({ error: "Invoice already refunded" }, { status: 400 });
    }

    invoice.status = "refunded";
    await subscription.save();

    return NextResponse.json({ message: "Invoice refunded successfully" });
  } catch (error) {
    console.error("Error refunding invoice:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
