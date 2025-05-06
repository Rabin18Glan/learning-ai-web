import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Chat from "@/models/Chat"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const chat = await Chat.findById(params.id)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if user owns the chat
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(chat)
  } catch (error: any) {
    console.error("Error fetching chat:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    await connectDB()

    const chat = await Chat.findById(params.id)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if user owns the chat
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update chat
    Object.assign(chat, data)
    await chat.save()

    return NextResponse.json(chat)
  } catch (error: any) {
    console.error("Error updating chat:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const chat = await Chat.findById(params.id)

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if user owns the chat
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Soft delete by marking as inactive
    chat.isActive = false
    await chat.save()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting chat:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
