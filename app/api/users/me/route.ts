import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findById(session.user.id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error fetching user:", error)
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

    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update allowed fields
    if (data.name) user.name = data.name
    if (data.bio) user.bio = data.bio
    if (data.profilePicture) user.profilePicture = data.profilePicture

    await user.save()

    // Return user without password
    const updatedUser = await User.findById(session.user.id).select("-password")

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
