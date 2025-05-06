import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { YoutubeLoader } from "langchain/document_loaders/web/youtube"
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio"
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url"
import { TextLoader } from "langchain/document_loaders/fs/text"
import { DocxLoader } from "langchain/document_loaders/fs/docx"
import { CSVLoader } from "langchain/document_loaders/fs/csv"
import { Document } from "langchain/document"
import { createTextSplitter } from "../models"
import { OpenSourceLLM } from "../models"

// Resource types supported by the system
export enum ResourceType {
  PDF = "pdf",
  YOUTUBE = "youtube",
  WEBPAGE = "webpage",
  TEXT = "text",
  DOCX = "docx",
  CSV = "csv",
  RECURSIVE_URL = "recursive_url",
}

/**
 * Load documents from various sources
 */
export async function loadDocuments(
  source: string,
  type: ResourceType,
  metadata: Record<string, any> = {},
  model: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
): Promise<Document[]> {
  let loader
  let docs: Document[] = []

  try {
    switch (type) {
      case ResourceType.PDF:
        loader = new PDFLoader(source, {
          splitPages: true,
        })
        break
      case ResourceType.YOUTUBE:
        loader = new YoutubeLoader({
          url: source,
          language: "en",
          addVideoInfo: true,
        })
        break
      case ResourceType.WEBPAGE:
        loader = new CheerioWebBaseLoader(source, {
          selector: "body",
        })
        break
      case ResourceType.TEXT:
        loader = new TextLoader(source)
        break
      case ResourceType.DOCX:
        loader = new DocxLoader(source)
        break
      case ResourceType.CSV:
        loader = new CSVLoader(source)
        break
      case ResourceType.RECURSIVE_URL:
        loader = new RecursiveUrlLoader(source, {
          extractor: (url, html) => {
            const cheerio = require("cheerio")
            const $ = cheerio.load(html)
            // Remove script and style tags
            $("script, style").remove()
            // Extract the text
            return $("body").text()
          },
          maxDepth: 2,
        })
        break
      default:
        throw new Error(`Unsupported resource type: ${type}`)
    }

    docs = await loader.load()

    // Add metadata to each document
    docs = docs.map((doc) => {
      return new Document({
        pageContent: doc.pageContent,
        metadata: {
          ...doc.metadata,
          ...metadata,
          source,
          type,
        },
      })
    })

    // Split the documents
    const textSplitter = createTextSplitter(model)
    docs = await textSplitter.splitDocuments(docs)

    return docs
  } catch (error) {
    console.error(`Error loading documents from ${source}:`, error)
    throw error
  }
}
