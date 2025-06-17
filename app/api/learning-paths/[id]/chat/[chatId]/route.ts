import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Message from "@/models/Message"
import Chat from "@/models/Chat"
import { EnhancedDocument } from "@/lib/agent/vector-store"
import { invokeAgent } from "@/lib/agent/agent"

// Types for better type safety
interface RouteParams {
  id: string; // learningPathId
  chatId: string;
}

interface RouteContext {
  params: RouteParams | Promise<RouteParams>;
}

interface PostRequestBody {
  content: string;
}

interface AgentResponse {
  answer: string;
  sourceDocuments: EnhancedDocument[];
}

interface MessageDocument {
  _id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  userId?: string;
  timestamp: Date;
  metadata?: {
    sourceDocuments?: EnhancedDocument[];
    resourcesUsed?: string[];
  };
}

interface ChatDocument {
  _id: string;
  userId: mongoose.Types.ObjectId;
  learningPathId: mongoose.Types.ObjectId;
  lastMessageAt: Date;
  save(): Promise<ChatDocument>;
}

// Helper functions
async function getValidatedParams(context: RouteContext): Promise<RouteParams> {
  const params = context.params instanceof Promise ? await context.params : context.params;
  return params;
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

function isChatOwner(chat: ChatDocument, userId: string): boolean {
  return chat.userId.toString() === userId;
}

// GET all messages for a chat
export async function GET(
  req: NextRequest, 
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate parameters
    const { id: learningPathId, chatId } = await getValidatedParams(context);
    
    if (!isValidObjectId(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    if (!isValidObjectId(learningPathId)) {
      return NextResponse.json({ error: "Invalid learning path ID" }, { status: 400 });
    }

    // Database operations
    await connectToDatabase();
    
    const chat = await Chat.findById(chatId) as ChatDocument | null;
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Authorization checks
    if (!isChatOwner(chat, session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify chat belongs to the learning path
    if (chat.learningPathId.toString() !== learningPathId) {
      return NextResponse.json({ error: "Chat does not belong to this learning path" }, { status: 403 });
    }

    // Fetch messages
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 }) as MessageDocument[];
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch messages";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: User sends a message, agent responds, both are saved
export async function POST(
  req: NextRequest, 
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract and validate parameters
    const { chatId, id: learningPathId } = await getValidatedParams(context);
    
    if (!isValidObjectId(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    if (!isValidObjectId(learningPathId)) {
      return NextResponse.json({ error: "Invalid learning path ID" }, { status: 400 });
    }

    // Database connection
    await connectToDatabase();
    
    // Validate chat exists and user owns it
    const chat = await Chat.findById(chatId) as ChatDocument | null;
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (!isChatOwner(chat, session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify chat belongs to the learning path
    if (chat.learningPathId.toString() !== learningPathId) {
      return NextResponse.json({ error: "Chat does not belong to this learning path" }, { status: 403 });
    }

    // Parse and validate request body
    let requestBody: PostRequestBody;
    try {
      requestBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { content } = requestBody;
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Missing or invalid message content" }, { status: 400 });
    }

    // Save user message
    const userMessage = await Message.create({
      chatId,
      role: "user" as const,
      content: content.trim(),
      userId: session.user.id,
      timestamp: new Date(),
    }) as MessageDocument;

    // Invoke enhanced agent with context-aware retrieval
    let agentResponse: AgentResponse;
    try {
      agentResponse = await invokeAgent(
        learningPathId,
        session.user.id,
        content.trim()
      );
    } catch (agentError) {
      console.error("Agent invocation error:", agentError);
      return NextResponse.json({ 
        error: "Failed to generate agent response" 
      }, { status: 500 });
    }

    // Validate agent response
    if (!agentResponse || !agentResponse.answer) {
      return NextResponse.json({ 
        error: "Agent failed to generate a response" 
      }, { status: 500 });
    }

    // Prepare metadata for the agent message
    const messageMetadata = {
      sourceDocuments: agentResponse.sourceDocuments,
      resourcesUsed: agentResponse.sourceDocuments.map(doc => ({
        resourceId: doc.metadata.resourceId,
        resourceTitle: doc.metadata.resourceTitle,
        resourceType: doc.metadata.resourceType,
        chunkIndex: doc.metadata.chunkIndex
      }))
    };

    // Save agent message with enhanced metadata
    const agentMessage = await Message.create({
      chatId,
      role: "assistant" as const,
      content: agentResponse.answer,
      timestamp: new Date(),
      metadata: messageMetadata
    }) as MessageDocument;

    // Update chat timestamp
    chat.lastMessageAt = new Date();
    await chat.save();

    // Return response with source information
    return NextResponse.json({ 
      message: agentMessage,
      userMessage,
      sourceDocuments: agentResponse.sourceDocuments.map(doc => ({
        resourceId: doc.metadata.resourceId,
        resourceTitle: doc.metadata.resourceTitle,
        resourceType: doc.metadata.resourceType,
        chunkIndex: doc.metadata.chunkIndex,
        totalChunks: doc.metadata.totalChunks,
        tags: doc.metadata.tags,
        preview: doc.pageContent.substring(0, 200) + "..." // First 200 chars as preview
      }))
    });

  } catch (error) {
    console.error("Error in chat agent POST:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process message";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
