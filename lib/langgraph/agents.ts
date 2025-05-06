import { StateGraph, END } from "langchain/langgraph"
import { RunnableSequence } from "langchain/schema/runnable"
import { StringOutputParser } from "langchain/schema/output_parser"
import { PromptTemplate } from "langchain/prompts"
import { loadDocuments, type ResourceType } from "../langchain/document-loaders"
import { createOrUpdateVectorStore } from "../langchain/vector-store"
import { generateRAGResponse } from "../langchain/rag"
import { createChatModel, OpenSourceLLM, OpenSourceEmbedding } from "../langchain/models"
import { createRAGChain } from "../langchain/rag"

// State interface for document processing
interface DocumentProcessingState {
  status: "pending" | "processing" | "completed" | "failed"
  resources: Array<{
    url: string
    type: ResourceType
    metadata: Record<string, any>
  }>
  learningPathId: string
  processedCount: number
  totalCount: number
  error?: string
  vectorStoreId?: string
}

/**
 * Process documents for a learning path
 */
export async function processDocuments(
  resources: Array<{
    url: string
    type: ResourceType
    metadata: Record<string, any>
  }>,
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
) {
  // Initialize state
  const state: DocumentProcessingState = {
    status: "pending",
    resources,
    learningPathId,
    processedCount: 0,
    totalCount: resources.length,
  }

  // Create state graph
  const graph = new StateGraph<DocumentProcessingState>({
    channels: {
      status: {
        value: (state) => state.status,
        default: "pending",
      },
    },
  })

  // Define nodes
  // Start processing node
  const startProcessing = async (state: DocumentProcessingState) => {
    return {
      ...state,
      status: "processing",
    }
  }

  // Process documents node
  const processDocumentsNode = async (state: DocumentProcessingState) => {
    try {
      const allDocuments = []

      // Process each resource
      for (const resource of state.resources) {
        try {
          const docs = await loadDocuments(
            resource.url,
            resource.type,
            {
              ...resource.metadata,
              learningPathId: state.learningPathId,
            },
            llmModel,
          )
          allDocuments.push(...docs)
          state.processedCount++
        } catch (error) {
          console.error(`Error processing resource ${resource.url}:`, error)
          // Continue with other resources
        }
      }

      // Create vector store
      if (allDocuments.length > 0) {
        const vectorStoreId = await createOrUpdateVectorStore(allDocuments, state.learningPathId, embeddingModel)

        return {
          ...state,
          status: "completed",
          vectorStoreId,
        }
      } else {
        return {
          ...state,
          status: "failed",
          error: "No documents were successfully processed",
        }
      }
    } catch (error) {
      console.error("Error in document processing:", error)
      return {
        ...state,
        status: "failed",
        error: error.message || "Unknown error during document processing",
      }
    }
  }

  // Add nodes to graph
  graph.addNode("startProcessing", startProcessing)
  graph.addNode("processDocuments", processDocumentsNode)

  // Add edges
  graph.addEdge("startProcessing", "processDocuments")
  graph.addConditionalEdges("processDocuments", (state) => state.status, {
    completed: END,
    failed: END,
  })

  // Set entry point
  graph.setEntryPoint("startProcessing")

  // Compile the graph
  const runnable = graph.compile()

  // Execute the graph
  const result = await runnable.invoke(state)
  return result
}

/**
 * Answer a question using RAG
 */
export async function answerQuestion(
  question: string,
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
) {
  try {
    // Generate response using RAG
    const answer = await generateRAGResponse(question, learningPathId, llmModel, embeddingModel)

    return {
      answer,
      error: null,
    }
  } catch (error) {
    console.error("Error answering question:", error)
    return {
      answer: null,
      error: error.message || "Failed to generate an answer",
    }
  }
}

/**
 * Analyze documents to extract key concepts and relationships
 */
export async function analyzeDocuments(learningPathId: string, llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B) {
  try {
    const model = createChatModel(llmModel)

    // Create a prompt for concept extraction
    const conceptExtractionPrompt = PromptTemplate.fromTemplate(
      `Analyze the following learning materials and extract the key concepts.
      
      For each concept, provide:
      1. The concept name
      2. A brief description
      3. Its importance in the overall topic
      
      Format your response as a JSON array of objects with the following structure:
      [
        {
          "concept": "concept name",
          "description": "brief description",
          "importance": "high/medium/low"
        }
      ]
      
      Learning materials:
      {context}`,
    )

    // Create a chain for concept extraction
    const conceptExtractionChain = RunnableSequence.from([conceptExtractionPrompt, model, new StringOutputParser()])

    // Get context from the vector store
    const { context } = await createRAGChain(learningPathId, llmModel).invoke({
      question: "What are the main concepts in these learning materials?",
    })

    // Extract concepts
    const conceptsJson = await conceptExtractionChain.invoke({ context })

    let concepts = []
    try {
      concepts = JSON.parse(conceptsJson)
    } catch (error) {
      console.error("Error parsing concepts JSON:", error)
      concepts = []
    }

    return {
      concepts,
      error: null,
    }
  } catch (error) {
    console.error("Error analyzing documents:", error)
    return {
      concepts: [],
      error: error.message || "Failed to analyze documents",
    }
  }
}
