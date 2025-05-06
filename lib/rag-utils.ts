import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Types for document processing
export type Document = {
  id: string
  name: string
  content: string
  type: string
  chunks?: DocumentChunk[]
}

export type DocumentChunk = {
  id: string
  documentId: string
  content: string
  metadata: {
    pageNumber?: number
    section?: string
  }
}

/**
 * Processes a document and splits it into chunks for RAG
 */
export async function processDocument(document: Document): Promise<Document> {
  // In a real implementation, this would use a more sophisticated chunking strategy
  const chunks = splitIntoChunks(document.content)

  return {
    ...document,
    chunks: chunks.map((content, index) => ({
      id: `${document.id}-chunk-${index}`,
      documentId: document.id,
      content,
      metadata: {
        pageNumber: Math.floor(index / 3) + 1, // Simulate page numbers
        section: `Section ${Math.floor(index / 5) + 1}`,
      },
    })),
  }
}

/**
 * Simple text chunking function
 */
function splitIntoChunks(text: string, chunkSize = 1000): string[] {
  const chunks = []
  let i = 0
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize))
    i += chunkSize
  }
  return chunks
}

/**
 * Retrieves relevant document chunks based on a query
 */
export async function retrieveRelevantChunks(query: string, documents: Document[]): Promise<DocumentChunk[]> {
  // In a real implementation, this would use embeddings and vector search
  // For now, we'll use a simple keyword matching approach
  const allChunks = documents.flatMap((doc) => doc.chunks || [])

  // Simple relevance scoring based on term frequency
  const scoredChunks = allChunks.map((chunk) => {
    const queryTerms = query.toLowerCase().split(/\s+/)
    const content = chunk.content.toLowerCase()

    // Count occurrences of query terms in the chunk
    const score = queryTerms.reduce((sum, term) => {
      const regex = new RegExp(term, "g")
      const matches = content.match(regex)
      return sum + (matches ? matches.length : 0)
    }, 0)

    return { chunk, score }
  })

  // Sort by score and take top results
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.chunk)
}

/**
 * Generates a response using RAG with the AI SDK
 */
export async function generateRAGResponse(query: string, relevantChunks: DocumentChunk[]): Promise<string> {
  // Combine relevant chunks into context
  const context = relevantChunks.map((chunk) => chunk.content).join("\n\n")

  // Generate response using AI SDK
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `
      You are EduSense AI, an intelligent AI tutor. Answer the following question based on the provided context.
      
      Context:
      ${context}
      
      Question: ${query}
      
      Provide a clear, educational response that helps the user understand the topic deeply.
    `,
  })

  return text
}
