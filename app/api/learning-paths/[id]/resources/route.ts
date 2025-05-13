import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import mongoose from "mongoose"
import connectToDatabase from "@/lib/db"
import Resource from "@/models/Resource"
import { writeFile } from "fs/promises"
import path from "path"
import { processDocuments } from "@/lib/langgraph/agents";
import { ResourceType as LoaderResourceType } from "@/lib/langchain/document-loaders";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
       const params = context.params instanceof Promise ? await context.params : context.params
    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid learning path ID" }, { status: 400 })
    }
    console.log("this is id" + id)
    await connectToDatabase()
    // Fetch all resources for this learning path
    const resources = await Resource.find({ learningPathId: id })
    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({ error: error || "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
   const params = context.params instanceof Promise ? await context.params : context.params
    const { id } =await params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid learning path ID" }, { status: 400 })
    }
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    const resourceName = (formData.get("name") as string) || file.name
    const description = (formData.get("description") as string) || ""
    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(process.cwd(), "public", "uploads")
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`)
    const fileUrl = `/uploads/${path.basename(filePath)}`
    await writeFile(filePath, buffer)
    await connectToDatabase()
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
    })

    // Trigger embedding/vector store pipeline
    try {
      let resourceType: LoaderResourceType;
      if (file.type.includes("pdf")) {
        resourceType = LoaderResourceType.PDF;
      } else if (file.type.includes("text") || file.type.includes("plain")) {
        resourceType = LoaderResourceType.TEXT;
      } else if (file.type.includes("docx")) {
        resourceType = LoaderResourceType.DOCX;
      } else {
        resourceType = LoaderResourceType.PDF; // Default fallback
      }

      const result = await processDocuments([
        {
          url: filePath, // local file path
          type: resourceType,
          metadata: {
            resourceId: resource._id.toString(),
            title: resourceName,
            description,
            fileUrl,
            fileType: file.type,
            fileSize: file.size,
          },
        },
      ], id);

      if (result.status === "completed") {
        resource.status = "ready";
        resource.processingError = undefined;
      } else {
        resource.status = "error";
        resource.processingError = result.error || "Unknown error during document processing";
      }
      await resource.save();
    } catch (embeddingError) {
      resource.status = "error";
      resource.processingError = embeddingError instanceof Error ? embeddingError.message : String(embeddingError);
      await resource.save();
    }

    return NextResponse.json({
      success: true,
      resource,
    })
  } catch (error) {
    console.error("Error in resource upload API:", error)
    return NextResponse.json({ error: "Failed to process resource upload" }, { status: 500 })
  }
}
