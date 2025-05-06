import { ChatOllama } from "langchain/chat_models/ollama"
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf"
import { OllamaEmbeddings } from "langchain/embeddings/ollama"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

// Available open-source LLM models
export enum OpenSourceLLM {
  LLAMA3_8B = "llama3:8b",
  LLAMA3_70B = "llama3:70b",
  MISTRAL_7B = "mistral:7b",
  MIXTRAL_8X7B = "mixtral:8x7b",
  PHI3_MINI = "phi3:mini",
  GEMMA_7B = "gemma:7b",
}

// Available open-source embedding models
export enum OpenSourceEmbedding {
  BGE_SMALL = "bge-small",
  BGE_BASE = "bge-base",
  NOMIC_EMBED = "nomic-embed",
  SENTENCE_TRANSFORMERS = "sentence-transformers",
  INSTRUCTOR = "instructor",
}

// Context window sizes for different models
export const MODEL_CONTEXT_WINDOW = {
  [OpenSourceLLM.LLAMA3_8B]: 8192,
  [OpenSourceLLM.LLAMA3_70B]: 8192,
  [OpenSourceLLM.MISTRAL_7B]: 8192,
  [OpenSourceLLM.MIXTRAL_8X7B]: 32768,
  [OpenSourceLLM.PHI3_MINI]: 4096,
  [OpenSourceLLM.GEMMA_7B]: 8192,
}

// Default chunk sizes for different models
export const DEFAULT_CHUNK_SIZE = {
  [OpenSourceLLM.LLAMA3_8B]: 1000,
  [OpenSourceLLM.LLAMA3_70B]: 2000,
  [OpenSourceLLM.MISTRAL_7B]: 1000,
  [OpenSourceLLM.MIXTRAL_8X7B]: 4000,
  [OpenSourceLLM.PHI3_MINI]: 800,
  [OpenSourceLLM.GEMMA_7B]: 1000,
}

// Default chunk overlap for different models
export const DEFAULT_CHUNK_OVERLAP = {
  [OpenSourceLLM.LLAMA3_8B]: 200,
  [OpenSourceLLM.LLAMA3_70B]: 400,
  [OpenSourceLLM.MISTRAL_7B]: 200,
  [OpenSourceLLM.MIXTRAL_8X7B]: 800,
  [OpenSourceLLM.PHI3_MINI]: 160,
  [OpenSourceLLM.GEMMA_7B]: 200,
}

/**
 * Create a chat model using Ollama
 */
export function createChatModel(model: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B) {
  return new ChatOllama({
    model,
    baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    temperature: 0.2,
  })
}

/**
 * Create embeddings using open-source models
 */
export function createEmbeddings(model: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL) {
  switch (model) {
    case OpenSourceEmbedding.BGE_SMALL:
      return new OllamaEmbeddings({
        model: "bge-small",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      })
    case OpenSourceEmbedding.BGE_BASE:
      return new OllamaEmbeddings({
        model: "bge-base",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      })
    case OpenSourceEmbedding.NOMIC_EMBED:
      return new HuggingFaceInferenceEmbeddings({
        model: "nomic-ai/nomic-embed-text-v1",
        apiKey: process.env.HUGGINGFACE_API_KEY,
      })
    case OpenSourceEmbedding.SENTENCE_TRANSFORMERS:
      return new HuggingFaceInferenceEmbeddings({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        apiKey: process.env.HUGGINGFACE_API_KEY,
      })
    case OpenSourceEmbedding.INSTRUCTOR:
      return new HuggingFaceInferenceEmbeddings({
        model: "hkunlp/instructor-large",
        apiKey: process.env.HUGGINGFACE_API_KEY,
      })
    default:
      return new OllamaEmbeddings({
        model: "bge-small",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
      })
  }
}

/**
 * Create a text splitter optimized for the given model
 */
export function createTextSplitter(model: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B) {
  return new RecursiveCharacterTextSplitter({
    chunkSize: DEFAULT_CHUNK_SIZE[model],
    chunkOverlap: DEFAULT_CHUNK_OVERLAP[model],
  })
}
