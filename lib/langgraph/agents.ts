import { StateGraph, END } from "@langchain/langgraph";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { loadDocuments, type ResourceType } from "../langchain/document-loaders";
import { createOrUpdateVectorStore } from "../langchain/vector-store";
import { generateRAGResponse } from "../langchain/rag";
import { createChatModel, OpenSourceLLM, OpenSourceEmbedding } from "../langchain/models";
import { createRAGChain } from "../langchain/rag";

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
 * Process documents for a learning path
 */
export async function processDocuments(
  resources: Array<{
    url: string;
    type: ResourceType;
    metadata: Record<string, any>;
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
  };

  // Create state graph
  const graph = new StateGraph<DocumentProcessingState>({
    channels: {
      // status starts as "pending", and each node can overwrite it
      status: {
        value: (current, next) => next || current, // Add a value reducer
        default: () => "pending" as "pending", // Explicitly cast to the allowed type
      },
      // you could explicitly list your other state keys here as `null`:
      resources: null,
      learningPathId: null,
      processedCount: null,
      totalCount: null,
      error: null,
      vectorStoreId: null,
    },
  });

  // Define nodes
  // Start processing node
  const startProcessing = async (state: DocumentProcessingState): Promise<DocumentProcessingState> => {
    return {
      ...state,
      status: "processing", // Ensure the status matches the allowed type
    };
  };

  // Process documents node
  const processDocumentsNode = async (state: DocumentProcessingState): Promise<DocumentProcessingState> => {
    try {
      const allDocuments = [];

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
          );
          allDocuments.push(...docs);
          state.processedCount++;
        } catch (err) {
          console.error(`Error processing resource ${resource.url}:`, err);
        }
      }

      if (allDocuments.length > 0) {
        const vectorStoreId = await createOrUpdateVectorStore(allDocuments, state.learningPathId, embeddingModel);

        return {
          ...state,
          status: "completed",
          vectorStoreId,
        };
      } else {
        return {
          ...state,
          status: "failed",
          error: "No documents were successfully processed",
        };
      }
    } catch (err) {
      console.error("Error in document processing:", err);
      return {
        ...state,
        status: "failed",
        error: (err as Error).message || "Unknown error during document processing",
      };
    }
  };

  // Add nodes to graph
  graph.addNode("__start__", startProcessing); // Use valid node name
  graph.addNode("processDocuments", processDocumentsNode);

  // Add edges
  graph.addEdge("__start__", "__end__"); // Use valid edge names
  graph.addConditionalEdges("__start__", (state) => state.status, {
    completed: END,
    failed: END,
  });

  // Set entry point
  graph.setEntryPoint("__start__"); // Use valid entry point name

  // Compile the graph
  const runnable = graph.compile();

  // Execute the graph
  const result = await runnable.invoke(state as any); // Cast state to any to bypass type mismatch
  return result;
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
    const answer = await generateRAGResponse(question, learningPathId, llmModel, embeddingModel);

    return {
      answer,
      error: null,
    };
  } catch (err) {
    console.error("Error answering question:", err);
    return {
      answer: null,
      error: (err as Error).message || "Failed to generate an answer", // Explicitly cast error
    };
  }
}

/**
 * Analyze documents to extract key concepts and relationships
 */
export async function analyzeDocuments(learningPathId: string, llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B) {
  try {
    const model = createChatModel(llmModel);

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
    );
 
    // Create a chain for concept extraction
    const conceptExtractionChain = RunnableSequence.from([conceptExtractionPrompt, model, new StringOutputParser()]);

    // Get context from the vector store
    const ragChain = await createRAGChain(learningPathId, llmModel);
    const result = await ragChain.invoke({
      question: "What are the main concepts in these learning materials?",
    });
    
    // Extract context from the result
    let context = "";
    if (typeof result === "string") {
      context = result;
    } else if (result && typeof result === "object" && "context" in result) {
      context = (result as any).context; // Explicitly cast to any to access context
    } else {
      throw new Error("Unexpected result format from RAG chain");
    }

    // Extract concepts
    const conceptsJson = await conceptExtractionChain.invoke({ context });

    let concepts = [];
    try {
      concepts = JSON.parse(conceptsJson);
    } catch (error) {
      console.error("Error parsing concepts JSON:", error);
      concepts = [];
    }

    return {
      concepts,
      error: null,
    };
  } catch (error) {
    console.error("Error analyzing documents:", error);
    return {
      concepts: [],
      error: error || "Failed to analyze documents",
    };
  }
}