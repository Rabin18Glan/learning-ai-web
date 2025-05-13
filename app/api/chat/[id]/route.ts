import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Message from "@/models/Message"
import Chat from "@/models/Chat"

// GET all messages for a chat
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id: chatId } = params
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 })
    }
    await connectToDatabase()
    // Optionally, check chat ownership
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

// POST create a new message for a chat, stream agent response in chunks and send state updates
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Unauthorized" })}\n\n`));
          controller.close();
          return;
        }
        const { id: chatId } = params
        if (!mongoose.Types.ObjectId.isValid(chatId)) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Invalid chat ID" })}\n\n`));
          controller.close();
          return;
        }
        await connectToDatabase()
        const chat = await Chat.findById(chatId)
        if (!chat) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Chat not found" })}\n\n`));
          controller.close();
          return;
        }
        if (chat.userId.toString() !== session.user.id) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Unauthorized" })}\n\n`));
          controller.close();
          return;
        }
        const { content } = await req.json()
        if (!content) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Missing message content" })}\n\n`));
          controller.close();
          return;
        }
        // Save user message
        const userMessage = await Message.create({
          chatId,
          role: "user",
          content,
          userId: session.user.id,
          timestamp: new Date(),
        })
        controller.enqueue(encoder.encode(`event: state\ndata: ${JSON.stringify({ state: "user_message_saved", message: userMessage })}\n\n`));
        // Simulate agent thinking state
        controller.enqueue(encoder.encode(`event: state\ndata: ${JSON.stringify({ state: "agent_thinking" })}\n\n`));
        // Stream agent response in chunks (simulate chunking)
        // Replace this with your actual streaming agent logic if available
        let agentContent = ""
        const agentResult = await import("@/lib/langgraph/agents").then(m => m.answerQuestion(content, chat.learningPathId.toString()))
        const answer = (await agentResult).answer || "Sorry, I couldn't generate a response.";
        // Simulate chunking by splitting answer into sentences
        const chunks = answer.split(/(?<=[.!?])\s+/)
        for (const chunk of chunks) {
          agentContent += chunk + " "
          controller.enqueue(encoder.encode(`event: agent_chunk\ndata: ${JSON.stringify({ chunk })}\n\n`));
          // Simulate delay for UX (remove in prod)
          await new Promise(res => setTimeout(res, 100));
        }
        // Save agent message
        const agentMessage = await Message.create({
          chatId,
          role: "assistant",
          content: agentContent.trim(),
          timestamp: new Date(),
        })
        chat.lastMessageAt = new Date()
        await chat.save()
        controller.enqueue(encoder.encode(`event: state\ndata: ${JSON.stringify({ state: "agent_done", message: agentMessage })}\n\n`));
        controller.close();
      } catch (error) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) || "Failed to process message" })}\n\n`));
        controller.close();
      }
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
