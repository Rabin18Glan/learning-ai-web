import { GraphDataSchema } from "@/validations/graph-schema";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});





export const structuredLLM = llm.withStructuredOutput(GraphDataSchema)