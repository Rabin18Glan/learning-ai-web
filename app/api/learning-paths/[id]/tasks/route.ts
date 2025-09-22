
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";

import Tasks from "@/models/Tasks";
import mongoose from "mongoose";
import { getServerSession } from "next-auth"; // if using next-auth
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  try {
    const progress = await Tasks.find({ learningPathId: id });
    return NextResponse.json({ tasks: progress });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch progress." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id: learningPathId } = params;

  try {
    const body = await req.json();
    const { title, description, priority, dueDate, parentTaskId, resourceId } =
      body;

    // ✅ get current userId (assuming next-auth)
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    const task = await Tasks.create({
      learningPathId,
      userId,
      title,
      description,
      priority,
      dueDate,
      parentTaskId,
      resourceId,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
