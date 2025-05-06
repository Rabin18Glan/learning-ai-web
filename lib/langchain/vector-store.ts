import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas"
import type { Document } from "langchain/document"
import { createEmbeddings } from "./models"
import { OpenSourceEmbedding } from "./models"
import { connectToDatabase } from "../db"
import mongoose from "mongoose"

// Collection name for vector storage
const COLLECTION_NAME = "document_vectors"

/**
 * Create or update a vector store for a learning path
 */
export async function createOrUpdateVectorStore(
  documents: Document[],
  learningPathId: string,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
): Promise<string> {
  try {
    await connectToDatabase()
    const db = mongoose.connection.db
    const collection = db.collection(COLLECTION_NAME)

    // Create embeddings model
    const embeddings = createEmbeddings(embeddingModel)

    // Check if documents already exist for this learning path
    const existingDocs = await collection.countDocuments({ "metadata.learningPathId": learningPathId })

    if (existingDocs > 0) {
      // Delete existing documents for this learning path
      await collection.deleteMany({ "metadata.learningPathId": learningPathId })
    }

    // Create vector store
    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    })

    return learningPathId
  } catch (error) {
    console.error("Error creating vector store:", error)
    throw error
  }
}

/**
 * Perform similarity search on the vector store
 */
export async function similaritySearch(
  query: string,
  learningPathId: string,
  k = 5,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
): Promise<Document[]> {
  try {
    await connectToDatabase()
    const db = mongoose.connection.db
    const collection = db.collection(COLLECTION_NAME)

    // Create embeddings model
    const embeddings = createEmbeddings(embeddingModel)

    // Create vector store
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,
      indexName: "vector_index",
      textKey: "text",
      embeddingKey: "embedding",
    })

    // Perform similarity search with filter for learning path
    const results = await vectorStore.similaritySearch(query, k, {
      "metadata.learningPathId": learningPathId,
    })

    return results
  } catch (error) {
    console.error("Error performing similarity search:", error)
    throw error
  }
}
