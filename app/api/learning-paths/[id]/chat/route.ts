import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Activity, { ActivityArea, ActivityType } from "@/models/Activity";
import Chat from "@/models/Chat";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";

// GET all chats for a learning path
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } =
      context.params instanceof Promise ? await context.params : context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid learning path ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const chats = await Chat.find({
      learningPathId: id,
      userId: session.user.id,
    });

    // Log activity
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.CHAT,
      type: ActivityType.VIEWED,
      description: "User viewed chats",
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: error || "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

// POST create a new chat for a learning path
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } =
      context.params instanceof Promise ? await context.params : context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid learning path ID" },
        { status: 400 }
      );
    }
    const data = await req.json();
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      data.title = "New Chat";
    }

    await connectToDatabase();
    const chat = await Chat.create({
      ...data,
      learningPathId: id,
      userId: session.user.id,
    });

    // Log activity
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.CHAT,
      type: ActivityType.ADDED,
      description: `Chat created: ${chat.title}`,
    });

    return NextResponse.json({ chat });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.message, details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create chat" },
      { status: 500 }
    );
  }
}

// PUT update a chat by chatId (expects chatId in body)
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } =
      context.params instanceof Promise ? await context.params : context.params;
    const { chatId, ...updates } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }
    await connectToDatabase();
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, learningPathId: id, userId: session.user.id },
      updates,
      { new: true }
    );
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Log activity
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.CHAT,
      type: ActivityType.UPDATED,
      description: `Chat updated: ${chat.title}`,
    });

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Error updating chat:", error);
    return NextResponse.json(
      { error: error || "Failed to update chat" },
      { status: 500 }
    );
  }
}

// DELETE a chat by chatId (expects chatId in body)
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } =
      context.params instanceof Promise ? await context.params : context.params;
    const { chatId } = await req.json();
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }
    await connectToDatabase();
    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      learningPathId: id,
      userId: session.user.id,
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Log activity
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.CHAT,
      type: ActivityType.DELETED,
      description: `Chat deleted: ${chat.title}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: error || "Failed to delete chat" },
      { status: 500 }
    );
  }
}
