import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Subscription from "@/models/Subscription"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Get user's subscription
    const subscription = await Subscription.findOne({ userId: session.user.id })

    if (!subscription) {
      return NextResponse.json({
        plan: "free",
        status: "inactive",
      })
    }

    return NextResponse.json(subscription)
  } catch (error: any) {
    console.error("Error fetching subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.plan || !data.billingCycle || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({ userId: session.user.id })

    if (existingSubscription) {
      return NextResponse.json({ error: "User already has a subscription" }, { status: 400 })
    }

    // Set price based on plan and billing cycle
    let price = 0
    if (data.plan === "pro") {
      price = data.billingCycle === "monthly" ? 9.99 : 99.99
    } else if (data.plan === "premium") {
      price = data.billingCycle === "monthly" ? 19.99 : 199.99
    }

    // Create subscription
    const subscription = new Subscription({
      userId: session.user.id,
      plan: data.plan,
      status: "active",
      startDate: new Date(),
      endDate:
        data.billingCycle === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      billingCycle: data.billingCycle,
      price,
      currency: "USD",
      paymentMethod: data.paymentMethod,
      billingAddress: data.billingAddress,
      autoRenew: true,
      invoices: [
        {
          invoiceId: `INV-${Date.now()}`,
          amount: price,
          currency: "USD",
          status: "paid",
          date: new Date(),
        },
      ],
    })

    await subscription.save()

    // Update user's subscription plan
    await User.findByIdAndUpdate(session.user.id, {
      subscriptionPlan: data.plan,
      subscriptionStatus: "active",
      subscriptionEndDate: subscription.endDate,
    })

    return NextResponse.json(subscription, { status: 201 })
  } catch (error: any) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
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

    // Update subscription
    if (data.plan) {
      subscription.plan = data.plan

      // Update price based on new plan
      if (data.plan === "pro") {
        subscription.price = subscription.billingCycle === "monthly" ? 9.99 : 99.99
      } else if (data.plan === "premium") {
        subscription.price = subscription.billingCycle === "monthly" ? 19.99 : 199.99
      } else {
        subscription.price = 0
      }

      // Update user's subscription plan
      await User.findByIdAndUpdate(session.user.id, {
        subscriptionPlan: data.plan,
      })
    }

    if (data.billingCycle) {
      subscription.billingCycle = data.billingCycle

      // Update price based on new billing cycle
      if (subscription.plan === "pro") {
        subscription.price = data.billingCycle === "monthly" ? 9.99 : 99.99
      } else if (subscription.plan === "premium") {
        subscription.price = data.billingCycle === "monthly" ? 19.99 : 199.99
      }

      // Update end date
      subscription.endDate =
        data.billingCycle === "monthly"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

      // Update user's subscription end date
      await User.findByIdAndUpdate(session.user.id, {
        subscriptionEndDate: subscription.endDate,
      })
    }

    if (data.paymentMethod) {
      subscription.paymentMethod = data.paymentMethod
    }

    if (data.billingAddress) {
      subscription.billingAddress = data.billingAddress
    }

    if (data.autoRenew !== undefined) {
      subscription.autoRenew = data.autoRenew
    }

    await subscription.save()

    return NextResponse.json(subscription)
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
