import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LearningPath from "@/models/LearningPath"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/db"
import { answerQuestion } from "@/lib/langgraph/agents"
import { OpenSourceLLM, OpenSourceEmbedding } from "@/lib/langchain/models"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { question, model, embeddingModel } = await req.json()

    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
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

    // Check if the learning path has a vector store
    if (!learningPath.vectorStoreId) {
      return NextResponse.json(
        { error: "This learning path doesn't have any processed documents yet" },
        { status: 400 },
      )
    }

    // Set default models if not provided
    const llmModel = model ? (model as OpenSourceLLM) : OpenSourceLLM.LLAMA3_8B
    const embedding = embeddingModel ? (embeddingModel as OpenSourceEmbedding) : OpenSourceEmbedding.BGE_SMALL

    // Generate answer using RAG
    const result = await answerQuestion(question, id, llmModel, embedding)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      answer: result.answer,
      question,
    })
  } catch (error) {
    console.error("Error generating answer:", error)
    return NextResponse.json({ error: "Failed to generate answer" }, { status: 500 })
  }
}
