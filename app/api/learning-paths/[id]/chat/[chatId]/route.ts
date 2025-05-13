import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Message from "@/models/Message"
import Chat from "@/models/Chat"
import { answerQuestion } from "@/lib/langgraph/agents"

// GET all messages for a chat
export async function GET(req: NextRequest, context: { params: { id: string; chatId: string } }) {
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const params = context.params instanceof Promise ? await context.params : context.params
  const { id, chatId } = params
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }
    await connectToDatabase()
    const chat = await Chat.findById(chatId)
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 })
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: error || "Failed to fetch messages" }, { status: 500 })
  }
}

// POST: User sends a message, agent responds, both are saved
export async function POST(req: NextRequest, context: { params: { chatId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
        const params = context.params instanceof Promise ? await context.params : context.params
    const { chatId: chatId } =await params
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }
    await connectToDatabase()
    const chat = await Chat.findById(chatId)
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }
    if (chat.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    const { content } = await req.json()
    if (!content) {
      return NextResponse.json({ error: "Missing message content" }, { status: 400 })
    }
    // Save user message
    const userMessage = await Message.create({
      chatId,
      role: "user",
      content,
      userId: session.user.id,
      timestamp: new Date(),
    })
    // Call agent for response
    const agentResult = await answerQuestion(content, chat.learningPathId.toString())
    const agentContent = agentResult.answer || "Sorry, I couldn't generate a response.";
    // Save agent message
    const agentMessage = await Message.create({
      chatId,
      role: "assistant",
      content: agentContent,
      timestamp: new Date(),
    })
    // Update chat lastMessageAt
    chat.lastMessageAt = new Date()
    await chat.save()
    return NextResponse.json({ message: agentMessage })
  } catch (error) {
    console.error("Error in chat agent POST:", error)
    return NextResponse.json({ error: error || "Failed to process message" }, { status: 500 })
  }
}
