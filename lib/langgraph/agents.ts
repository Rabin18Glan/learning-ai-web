import { loadDocuments, ResourceType } from "../langchain/document-loaders/index";
import { createOrUpdateVectorStore } from "../langchain/vector-store";
import { createChatModel, OpenSourceLLM, OpenSourceEmbedding } from "../langchain/models";
import { generateRAGResponse } from "../langchain/rag";

// State interface for document processing
interface DocumentProcessingState {
  status: "pending" | "processing" | "completed" | "failed";
  resources: Array<{
    url: string;
    type: ResourceType;
    metadata: Record<string, any>;
  }>;
  learningPathId: string;
  processedCount: number;
  totalCount: number;
  error?: string;
  vectorStoreId?: string;
}

/**
 * Process documents for a learning path: loads, splits, embeds, and updates the vector store.
 * Returns a state object with progress and error info.
 * @param resources Array of resource descriptors (url, type, metadata)
 * @param learningPathId The learning path ID
 * @param llmModel The LLM model to use for splitting (default: LLAMA3_8B)
 * @param embeddingModel The embedding model to use (default: BGE_SMALL)
 */
export async function processDocuments(
  resources: Array<{
    url: string;
    type: ResourceType;
    metadata: Record<string, any>;
  }>,
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.NOMIC_EMBED_TEXT,
  // Optional: progressCallback?: (state: DocumentProcessingState) => void
) {
  const state: DocumentProcessingState = {
    status: "pending",
    resources,
    learningPathId,
    processedCount: 0,
    totalCount: resources.length,
  };
  try {
    state.status = "processing";
    let allDocs: import("langchain/document").Document<Record<string, any>>[] = [];
    for (const resource of resources) {
      try {
        const docs: import("langchain/document").Document<Record<string, any>>[] = await loadDocuments(resource.url, resource.type, resource.metadata, llmModel);
        allDocs = [...allDocs, ...docs];
        state.processedCount++;
        // Optionally: progressCallback?.(state);
      } catch (docErr) {
        state.status = "failed";
        state.error = `Failed to load resource ${resource.url}: ${(docErr as Error).message}`;
        // Optionally: progressCallback?.(state);
        return state;
      }
    }
    await createOrUpdateVectorStore(allDocs, learningPathId, embeddingModel);
    state.status = "completed";
    state.vectorStoreId = learningPathId;
    // Optionally: progressCallback?.(state);
    return state;
  } catch (err) {
    state.status = "failed";
    state.error = (err as Error).message || "Unknown error during document processing";
    // Optionally: progressCallback?.(state);
    return state;
  }
}

/**
 * Answer a question using Retrieval-Augmented Generation (RAG) for a learning path.
 * @param question The user question
 * @param learningPathId The learning path ID
 * @param llmModel The LLM model to use (default: LLAMA3_8B)
 * @param embeddingModel The embedding model to use (default: BGE_SMALL)
 */
export async function answerQuestion(
  question: string,
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.NOMIC_EMBED_TEXT,
) {
  try {
    const answer = await generateRAGResponse(question, learningPathId, llmModel, embeddingModel);
    return {
      answer,
      error: null,
    };
  } catch (err) {
    console.error("Error answering question:", err);
    return {
      answer: null,
      error: (err as Error).message || "Failed to generate an answer",
    };
  }
}

/**
 * Analyze documents to extract key concepts and relationships (stub for future extension).
 * @param learningPathId The learning path ID
 * @param llmModel The LLM model to use (default: LLAMA3_8B)
 */
export async function analyzeDocuments(
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B
) {
  try {
    const model = createChatModel(llmModel);
    // TODO: Implement advanced concept extraction if needed
    return { success: true, message: "Concept extraction not yet implemented." };
  } catch (error) {
    return { success: false, error: (error as Error).message || "Failed to analyze documents" };
  }
}