import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { Document } from "langchain/document";
import { createTextSplitter } from "../models";
import { OpenSourceLLM } from "../models";
import fs from "fs/promises";

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

// Fallback loader for plain text files
export async function loadTextFile(filePath: string, metadata: Record<string, any> = {}): Promise<Document[]> {
  const content = await fs.readFile(filePath, "utf8");
  return [
    new Document({
      pageContent: content,
      metadata: {
        ...metadata,
        source: filePath,
        type: "text",
      },
    }),
  ];
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
  let loader;
  let docs: Document[] = [];

  try {
    switch (type) {
      case ResourceType.PDF:
        loader = new PDFLoader(source, {
          splitPages: true,
        });
        break;
      case ResourceType.YOUTUBE:
        loader = YoutubeLoader.createFromUrl(source, {
          language: "en",
          addVideoInfo: true,
        });
        break;
      case ResourceType.WEBPAGE:
        loader = new CheerioWebBaseLoader(source, {
          selector: "body",
        });
        break;
      case ResourceType.TEXT:
        // Use fallback loader for plain text
        docs = await loadTextFile(source, metadata);
        break;
      case ResourceType.DOCX:
        loader = new DocxLoader(source);
        break;
      case ResourceType.CSV:
        loader = new CSVLoader(source);
        break;
      case ResourceType.RECURSIVE_URL:
        loader = new RecursiveUrlLoader(source, {
          extractor: (text: string) => {
            const cheerio = require("cheerio");
            const $ = cheerio.load(text);
            // Remove script and style tags
            $("script, style").remove();
            // Extract the text
            return $("body").text();
          },
          maxDepth: 2,
        });
        break;
      default:
        throw new Error(`Unsupported resource type: ${type}`);
    }

    if (!docs.length && loader) {
      docs = await loader.load();
    }

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
      });
    });

    // Split the documents
    const textSplitter = createTextSplitter(model);
    docs = await textSplitter.splitDocuments(docs);

    return docs;
  } catch (error) {
    console.error(`Error loading documents from ${source}:`, error);
    throw error;
  }
}
