import { OpenAIEmbeddings } from "@langchain/openai"
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { CohereEmbeddings } from "@langchain/cohere"

// Embedding model options
export enum EmbeddingModel {
  OPENAI = "openai",
  HUGGINGFACE = "huggingface",
  COHERE = "cohere",
}

/**
 * Factory function to create embeddings based on the selected model
 */
export function createEmbeddings(model: EmbeddingModel = EmbeddingModel.OPENAI) {
  switch (model) {
    case EmbeddingModel.OPENAI:
      return new OpenAIEmbeddings({
        modelName: "text-embedding-3-small",
        dimensions: 1536,
      })
    case EmbeddingModel.HUGGINGFACE:
      return new HuggingFaceInferenceEmbeddings({
        model: "sentence-transformers/all-MiniLM-L6-v2",
      })
    case EmbeddingModel.COHERE:
      return new CohereEmbeddings({
        model: "embed-english-v3.0",
      })
    default:
      return new OpenAIEmbeddings()
  }
}
