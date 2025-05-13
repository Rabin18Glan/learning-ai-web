import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "langchain/document";

/**
 * Load and process PDF content
 */
export async function loadPDF(filePath: string, metadata: Record<string, any> = {}): Promise<Document[]> {
  try {
    // Create PDF loader
    const loader = new PDFLoader(filePath, {
      splitPages: true,
    });

    // Load documents
    const docs = await loader.load();

    // Add metadata to each document
    return docs.map((doc) => {
      return new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          ...metadata,
          source: filePath,
          type: "pdf",
        },
      });
    });
  } catch (error) {
    console.error(`Error loading PDF from ${filePath}:`, error);
    throw error;
  }
}
