import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LearningPath from "@/models/LearningPath"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/db"
import { processDocuments } from "@/lib/langgraph/agents"
import { ResourceType } from "@/lib/langchain/document-loaders"
import { OpenSourceLLM, OpenSourceEmbedding } from "@/lib/langchain/models"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { resources, model, embeddingModel } = await req.json()

    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      return NextResponse.json({ error: "Resources are required" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the learning path
    const learningPath = await LearningPath.findById(id)

    if (!learningPath) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
    }

    // Validate resources
    const validatedResources = resources.map((resource) => {
      // Validate resource type
      if (!Object.values(ResourceType).includes(resource.type)) {
        throw new Error(`Invalid resource type: ${resource.type}`)
      }

      return {
        url: resource.url,
        type: resource.type as ResourceType,
        metadata: {
          title: resource.title || "Untitled Resource",
          description: resource.description || "",
          learningPathId: id,
          userId: session.user.id,
        },
      }
    })

    // Set default models if not provided
    const llmModel = model ? (model as OpenSourceLLM) : OpenSourceLLM.LLAMA3_8B
    const embedding = embeddingModel ? (embeddingModel as OpenSourceEmbedding) : OpenSourceEmbedding.BGE_SMALL

    // Process documents
    const result = await processDocuments(validatedResources, id, llmModel, embedding)

    if (result.status === "failed") {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Update learning path with vector store ID and resources
    const updatedResources = [
      ...(learningPath.resources || []),
      ...validatedResources.map((r) => ({
        url: r.url,
        type: r.type,
        title: r.metadata.title,
        description: r.metadata.description,
        addedAt: new Date(),
      })),
    ]

    await LearningPath.findByIdAndUpdate(id, {
      vectorStoreId: result.vectorStoreId,
      resources: updatedResources,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Resources processed successfully",
      resourceCount: validatedResources.length,
    })
  } catch (error) {
    console.error("Error processing resources:", error)
    return NextResponse.json({ error: error.message || "Failed to process resources" }, { status: 500 })
  }
}
