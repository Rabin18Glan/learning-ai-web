import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Subscription from "@/models/Subscription"
import User from "@/models/User"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    await connectDB()

    // Get user's subscription
    const subscription = await Subscription.findOne({ userId: session.user.id })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    // Cancel subscription
    subscription.status = "canceled"
    subscription.cancelReason = data.reason
    subscription.autoRenew = false
    await subscription.save()

    // Update user's subscription status
    await User.findByIdAndUpdate(session.user.id, {
      subscriptionStatus: "canceled",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
