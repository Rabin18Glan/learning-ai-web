import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { Document } from "langchain/document"

/**
 * Load and process YouTube video content
 */
export async function loadYouTubeVideo(url: string, metadata: Record<string, any> = {}): Promise<Document[]> {
  try {
    // Create YouTube loader
    const loader = new YoutubeLoader({
      url,
      language: "en",
      addVideoInfo: true,
    })

    // Load documents
    const docs = await loader.load()

    // Add metadata to each document
    return docs.map((doc) => {
      return new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          ...metadata,
          source: url,
          type: "youtube",
        },
      })
    })
  } catch (error) {
    console.error(`Error loading YouTube video from ${url}:`, error)
    throw error
  }
}
