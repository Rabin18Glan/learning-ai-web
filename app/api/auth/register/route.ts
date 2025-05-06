import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Please provide all required fields" }, { status: 400 })
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 409 })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      subscriptionPlan: "free",
      subscriptionStatus: "inactive",
    })

    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred during registration" },
      { status: 500 },
    )
  }
}
