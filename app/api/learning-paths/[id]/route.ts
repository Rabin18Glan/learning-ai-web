import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/db";
import LearningPath, { ILearningPath } from "@/models/LearningPath";
import UserProgress, { IUserProgress } from "@/models/UserProgress";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Populate resources for normalized model
    const lp: ILearningPath | null = await LearningPath.findById(id);

    if (!lp) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    const userProgress: IUserProgress | null = await UserProgress.findOne({
      learningPathId: id,
      userId: session.user.id,
    });
    if (userProgress) {
      const today = new Date().toDateString();

      const lastAccess = new Date(userProgress.lastAccessedAt);
      lastAccess.setDate(lastAccess.getDate() + 1);

      const isNextDay = lastAccess.toDateString() === today;
      const isTomorrow = lastAccess.toDateString() > today;

      console.log("is Next day");
      if (isNextDay) {
        userProgress.lastStreakCount += 1;
      } else if (!isTomorrow && !isNextDay) {
        userProgress.lastStreakCount = 0;
      }
      userProgress.lastAccessedAt = new Date();
      await userProgress.save();
    }

    return NextResponse.json(lp);
  } catch (error) {
    console.error("Error fetching learning path:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning path" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;
    const userIdPut = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updates = await req.json();

    await connectToDatabase();

    // Find the learning path
    const learningPath = await LearningPath.findById(id);

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    // Check if user is the creator or a collaborator
    const isCreatorPut = learningPath.creatorId.toString() === userIdPut;
    const isCollaboratorPut = learningPath.collaborators.includes(userIdPut);

    if (!isCreatorPut && !isCollaboratorPut) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update the learning path
    const updatedLearningPath = await LearningPath.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedLearningPath);
  } catch (error) {
    console.error("Error updating learning path:", error);
    return NextResponse.json(
      { error: "Failed to update learning path" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;
    const userIdDelete = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the learning path
    const learningPath = await LearningPath.findById(id);

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found" },
        { status: 404 }
      );
    }

    // Check if user is the creator
    if (learningPath.creatorId.toString() !== userIdDelete) {
      return NextResponse.json(
        { error: "Only the creator can delete a learning path" },
        { status: 403 }
      );
    }

    // Delete the learning path
    await LearningPath.findByIdAndDelete(id);

    // TODO: Delete associated vector store data

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting learning path:", error);
    return NextResponse.json(
      { error: "Failed to delete learning path" },
      { status: 500 }
    );
  }
}
