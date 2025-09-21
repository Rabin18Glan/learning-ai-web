import { IResource, ResourceType } from "@/models/Resource";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "langchain/document";

/**
 * Load and split a resource into LangChain documents
 */
export async function loadDocument(resource: IResource) {
  let loader;
  let docs: Document[] = [];

  // GridFS-backed URL (served via /api/files/[id])
  const sourceUrl = resource.fileUrl.startsWith("http")
    ? resource.fileUrl
    : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${resource.fileUrl}`;

  console.log("Loading resource:", resource.fileType, sourceUrl);

  switch (resource.fileType) {
    case ResourceType.PDF: {
      const response = await fetch(sourceUrl);
      const blob = await response.blob();
      loader = new PDFLoader(blob, { splitPages: true });
      break;
    }

    case ResourceType.DOCX: {
      const response = await fetch(sourceUrl);
      const blob = await response.blob();
      loader = new DocxLoader(blob);
      break;
    }

    case ResourceType.CSV: {
      const response = await fetch(sourceUrl);
      const blob = await response.blob();
      loader = new CSVLoader(blob);
      break;
    }

    case ResourceType.YOUTUBE: {
      loader = YoutubeLoader.createFromUrl(sourceUrl, {
        language: "en",
        addVideoInfo: true,
      });
      break;
    }

    case ResourceType.WEBPAGE: {
      loader = new CheerioWebBaseLoader(sourceUrl, { selector: "body" });
      break;
    }

    case ResourceType.RECURSIVE_URL: {
      loader = new RecursiveUrlLoader(sourceUrl, {
        extractor: (html: string) => {
          const cheerio = require("cheerio");
          const $ = cheerio.load(html);
          $("script, style").remove();
          return $("body").text();
        },
        maxDepth: 2,
      });
      break;
    }

    default:
      throw new Error(`Unsupported resource type: ${resource.fileType}`);
  }

  if (loader) {
    docs = await loader.load();
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  return splitter.splitDocuments(docs);
}
