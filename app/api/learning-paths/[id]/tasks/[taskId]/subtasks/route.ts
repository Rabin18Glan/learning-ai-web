import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import Task from "@/models/Tasks";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = await params;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return NextResponse.json({ error: "Invalid parent task ID" }, { status: 400 });
    }

    const { title, description, dueDate } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await connectToDatabase();
    const parentTask = await Task.findById(taskId);
    if (!parentTask) {
      return NextResponse.json({ error: "Parent task not found" }, { status: 404 });
    }

    const subTask = await Task.create({
      learningPathId: parentTask.learningPathId,
      userId: session.user.id,
      parentTaskId: parentTask._id,
      title,
      description,
      status: "pending",
      dueDate,
    });

    return NextResponse.json({ subTask });
  } catch (error) {
    console.error("Error creating subtask:", error);
    return NextResponse.json(
      { error: "Failed to create subtask" },
      { status: 500 }
    );
  }
}
