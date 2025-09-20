import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addDocumentsToStore } from "@/lib/agent/vector-store";
import connectToDatabase from "@/lib/db";
import Resource from "@/models/Resource";
import Activity, { ActivityArea, ActivityType } from "@/models/Activity";
import { writeFile } from "fs/promises";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";
import Task from "@/models/Tasks";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid learning path ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const resources = await Resource.find({ learningPathId: id });

    // Log activity
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.RESOURCES,
      type: ActivityType.VIEWED,
      description: `Viewed ${resources.length} resource(s)`,
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: error || "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params =
      context.params instanceof Promise ? await context.params : context.params;
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid learning path ID" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const resourceName = (formData.get("name") as string) || file.name;
    const description = (formData.get("description") as string) || "";

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    const fileUrl = `/uploads/${path.basename(filePath)}`;
    await writeFile(filePath, buffer);

    await connectToDatabase();

    // Create Resource record
    const resource = await Resource.create({
      learningPathId: id,
      title: resourceName,
      description,
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
      tags: [],
      status: "processing",
      isPublic: false,
      viewCount: 0,
      metadata: {},
    });

    // Log activity (resource added)
    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.RESOURCES,
      type: ActivityType.ADDED,
      description: `Uploaded resource: ${resourceName}`,
    });

    // Trigger embedding/vector store pipeline
    try {
      const result = await addDocumentsToStore(resource, session.user.id);

      if (result) {
        resource.status = "ready";
        resource.processingError = undefined;
      } else {
        resource.status = "error";
        resource.processingError = "Unknown error during document processing";
      }
      await resource.save();

      await Task.create({
        learningPathId: resource.learningPathId,
        userId: session.user.id,
        resourceId: resource._id,
        parentTaskId: null,
        title: `Read: ${resource.title}`,
        description: resource.description || "",
        status: "pending",
        priority: "medium",
      });
    } catch (embeddingError) {
      resource.status = "error";
      resource.processingError =
        embeddingError instanceof Error
          ? embeddingError.message
          : String(embeddingError);
      await resource.save();
    }

    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Error in resource upload API:", error);
    return NextResponse.json(
      { error: "Failed to process resource upload" },
      { status: 500 }
    );
  }
}
