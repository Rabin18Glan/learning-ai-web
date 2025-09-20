

import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import Subscription from "@/models/Subscription" // Adjust path to your Subscription model

const FAILURE_URL = process.env.FAILURE_URL || "http://localhost:3000/payment-failure"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const transaction_uuid = searchParams.get("transaction_uuid")

  if (!transaction_uuid) {
    return NextResponse.redirect(`${FAILURE_URL}?error=invalid_transaction_uuid`)
  }

  try {
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "")
    }

    const subscription = await Subscription.findOne({
      "invoices.invoiceId": transaction_uuid,
    })

    if (subscription) {
      const invoice = subscription.invoices.find((inv:any) => inv.invoiceId === transaction_uuid)
      if (invoice) {
        invoice.status = "unpaid"
        subscription.status = "past_due"
        await subscription.save()
      }
    }

    return NextResponse.redirect(`${FAILURE_URL}?error=payment_failed`)
  } catch (error) {
    console.error("Error handling payment failure:", error)
    return NextResponse.redirect(`${FAILURE_URL}?error=server_error&details=${encodeURIComponent((error as Error).message)}`)
  }
}
