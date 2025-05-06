import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import type { Document } from "langchain/document"

// Default chunk size and overlap
const DEFAULT_CHUNK_SIZE = 1000
const DEFAULT_CHUNK_OVERLAP = 200

/**
 * Split documents into chunks for embedding and retrieval
 */
export async function splitDocuments(
  documents: Document[],
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP,
): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  })

  return await textSplitter.splitDocuments(documents)
}

/**
 * Split a single text string into chunks
 */
export async function splitText(
  text: string,
  metadata: Record<string, any> = {},
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP,
): Promise<Document[]> {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  })

  const documents = await textSplitter.createDocuments([text], [metadata])
  return documents
}
