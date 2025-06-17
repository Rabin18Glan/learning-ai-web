import { IResource } from "@/models/Resource";
import { Document } from "@langchain/core/documents";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { loadDocument } from "./document_loader";

// Enhanced metadata interface for vector store documents
export interface VectorDocumentMetadata {
  userId: string;
  learningPathId: string;
  chatId?: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: string;
  chunkIndex: number;
  totalChunks: number;
  createdAt: Date;
  source: string;
  tags?: string[];
  isPublic?: boolean;
}

// Search filters interface
export interface VectorSearchFilters {
  userId?: string;
  learningPathId?: string;
  chatId?: string;
  resourceId?: string;
  resourceType?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Enhanced document interface that extends LangChain Document
export interface EnhancedDocument extends Document {
  metadata: VectorDocumentMetadata;
}

// Configuration
const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME || "edu")
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME || "vector_store");

export const mistralEmbeddingModel = new MistralAIEmbeddings({
  model: "mistral-embed"
});
   export  const vectorStore = new MongoDBAtlasVectorSearch(mistralEmbeddingModel, {
      collection: collection,
      indexName: "qna",
      embeddingKey:"embedding"
   });

// Enhanced function to add documents with metadata
export async function addDocumentsToStore(
  resource: IResource,
  userId: string,
  chatId?: string
): Promise<string[]> {
  try {
    // Load and split the document
    const loadedDocuments = await loadDocument(resource);
    // Enhance documents with metadata
    const enhancedDocs: EnhancedDocument[] = loadedDocuments.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        userId,
        learningPathId: resource.learningPathId.toString(),
        chatId,
        resourceId: resource.id.toString(),
        resourceTitle: resource.title,
        resourceType: resource.fileType,
        chunkIndex: index,
        totalChunks: loadedDocuments.length,
        createdAt: new Date(),
        source: resource.fileUrl,
        tags: resource.tags,
        isPublic: resource.isPublic,
        // Preserve any existing metadata from the document
        ...doc.metadata,
      }
    }));

    const result = await vectorStore.addDocuments(enhancedDocs);

    console.log(`${enhancedDocs.length} document chunks loaded for resource: ${resource.title}`);
    return result;
  } catch (error) {
    console.error("Error adding documents to vector store:", error);
    throw new Error(`Failed to add documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced similarity search with filtering
export async function searchDocuments(
  query: string,
  filters: VectorSearchFilters = {},
  k: number = 4
): Promise<EnhancedDocument[]> {
  try {
    // Build MongoDB filter based on provided filters
    const mongoFilter= {
      preFilter:{
        learningPathId:{
          $eq:filters.learningPathId
        },
        userId:{
          $eq:filters.userId
        }

      }
    };

    console.log("Your query")
    // Perform similarity search with filters
    const results = await vectorStore.similaritySearch(query, k,
     {
      ...mongoFilter
     }
      );
    
    return results as EnhancedDocument[];
  } catch (error) {
    console.error("Error searching documents:", error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Search documents for a specific learning path
export async function searchLearningPathDocuments(
  query: string,
  learningPathId: string,
  userId: string,
  k: number = 4
): Promise<EnhancedDocument[]> {
  return await searchDocuments(query, {
    learningPathId,
    userId
  }, k);
}
