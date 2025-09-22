import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { addDocumentsToStore } from "@/lib/agent/vector-store";
import { getBucket } from "@/lib/bucket";
import connectToDatabase from "@/lib/db";
import Activity, { ActivityArea, ActivityType } from "@/models/Activity";
import Resource from "@/models/Resource";
import Task from "@/models/Tasks";
import { GridFSBucket } from "mongodb";
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

// ✅ Reuse your existing Mongo connection

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
    const { id } = params;
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
     await connectToDatabase()
    const bucket = await getBucket("uploads");
  const uploadStream = bucket.openUploadStream(`${Date.now()}-${file.name}`, {
  contentType: file.type,
});

const buffer = Buffer.from(await file.arrayBuffer());
uploadStream.end(buffer);

// Wait for completion
await new Promise<void>((resolve, reject) => {
  uploadStream.on("finish", () => resolve());
  uploadStream.on("error", reject);
});


const fileId = uploadStream.id;
const fileUrl = `/api/files/${fileId.toString()}`;

    // ✅ Save Resource metadata in Mongo
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

    await Activity.create({
      learningPathId: id,
      userId: session.user.id,
      area: ActivityArea.RESOURCES,
      type: ActivityType.ADDED,
      description: `Uploaded resource: ${resourceName}`,
    });

    try {
      const result = await addDocumentsToStore(resource, session.user.id);
      resource.status = result ? "ready" : "error";
      resource.processingError = result
        ? undefined
        : "Unknown error during processing";
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

    return NextResponse.json({ success: true, resource });
  } catch (error) {
    console.error("Error in resource upload API:", error);
    return NextResponse.json(
      { error: "Failed to process resource upload" },
      { status: 500 }
    );
  }
}
