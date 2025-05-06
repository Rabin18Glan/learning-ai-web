import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import User from "@/models/User"
import bcrypt from "bcryptjs"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).select("+password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await user.verifyPassword(currentPassword)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Update password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
