import { IResource, ResourceType } from "@/models/Resource";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import "cheerio";
import { Document } from "langchain/document";
import path from "path";


export async function loadDocument( resouce:IResource) {
      let loader;
      let docs: Document[] = [];
    
// Sanitize input just in case
const cleanedUrl = resouce.fileUrl.replace(/^\/+/, "");
// Absolute path to public folder
const source = path.join(process.cwd(), "public", cleanedUrl);
        console.log(resouce.fileType)
        switch (resouce.fileType) {
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
            throw new Error(`Unsupported resource type: ${resouce.fileType}`);
        }
    
        if (!docs.length && loader) {
          docs = await loader.load();
        }

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000, chunkOverlap: 200
    });
    const allSplits = await splitter.splitDocuments(docs);


    // Index chunks
 return allSplits;


}