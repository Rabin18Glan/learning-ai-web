import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OpenSourceLLM } from "@/lib/langchain/models"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get available models from Ollama
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
    const response = await fetch(`${ollamaUrl}/api/tags`)

    if (!response.ok) {
      throw new Error(`Failed to fetch models from Ollama: ${response.statusText}`)
    }

    const data = await response.json()

    // Filter models that we support
    const supportedLLMs = Object.values(OpenSourceLLM)
    const supportedEmbeddings = ["bge-small", "bge-base", "nomic-embed"]

    const availableLLMs = data.models
      .filter((model) => supportedLLMs.some((llm) => model.name.includes(llm)))
      .map((model) => model.name)

    const availableEmbeddings = data.models
      .filter((model) => supportedEmbeddings.some((emb) => model.name.includes(emb)))
      .map((model) => model.name)

    // Check which models need to be pulled
    const missingLLMs = supportedLLMs.filter((llm) => !availableLLMs.some((model) => model.includes(llm)))

    const missingEmbeddings = supportedEmbeddings.filter(
      (emb) => !availableEmbeddings.some((model) => model.includes(emb)),
    )

    return NextResponse.json({
      availableLLMs,
      availableEmbeddings,
      missingLLMs,
      missingEmbeddings,
      ollamaUrl,
    })
  } catch (error) {
    console.error("Error checking Ollama setup:", error)
    return NextResponse.json({ error: error.message || "Failed to check Ollama setup" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { model } = await req.json()

    if (!model) {
      return NextResponse.json({ error: "Model name is required" }, { status: 400 })
    }

    // Pull the model from Ollama
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
    const response = await fetch(`${ollamaUrl}/api/pull`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: model }),
    })

    if (!response.ok) {
      throw new Error(`Failed to pull model from Ollama: ${response.statusText}`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully started pulling model: ${model}`,
    })
  } catch (error) {
    console.error("Error pulling Ollama model:", error)
    return NextResponse.json({ error: error.message || "Failed to pull Ollama model" }, { status: 500 })
  }
}
