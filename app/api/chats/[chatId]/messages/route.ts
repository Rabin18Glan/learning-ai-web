import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Chat from "@/models/Chat"

export async function POST(req: NextRequest, { params }: { params: { chatId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.role || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    const chat = await Chat.findById(params.chatId)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if user owns the chat
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Add message
    const message = {
      role: data.role,
      content: data.content,
      timestamp: new Date(),
    }

    chat.messages.push(message)
    chat.lastMessageAt = new Date()
    await chat.save()

    return NextResponse.json(message, { status: 201 })
  } catch (error: any) {
    console.error("Error adding message:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
