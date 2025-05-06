import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Chat from "@/models/Chat"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    await connectDB()

    // Get chats
    const chats = await Chat.find({ userId: session.user.id, isActive: true })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count
    const total = await Chat.countDocuments({ userId: session.user.id, isActive: true })

    return NextResponse.json({
      chats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching chats:", error)
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
    if (!data.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Create chat
    const chat = new Chat({
      ...data,
      userId: session.user.id,
      messages: data.messages || [],
      documentIds: data.documentIds || [],
    })

    await chat.save()

    return NextResponse.json(chat, { status: 201 })
  } catch (error: any) {
    console.error("Error creating chat:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
