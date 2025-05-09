import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import { similaritySearch } from "./vector-store";
import { createChatModel, OpenSourceLLM, OpenSourceEmbedding } from "./models";


function formatDocumentsAsString(docs: any[]): string {
  return docs.map((doc) => doc.pageContent).join("\n\n");
}
// Default system prompt template
const DEFAULT_SYSTEM_TEMPLATE = `You are an educational AI assistant for the EduSense platform. 
Your goal is to provide helpful, accurate, and educational responses based on the learning materials provided.

When answering:
- Be concise but thorough
- Cite specific information from the learning materials when possible
- If you're unsure or the information isn't in the context, acknowledge that
- Format your responses with markdown for readability
- Use examples to illustrate complex concepts
- Avoid making up information not present in the context

Context information is below:
-----------------
{context}
-----------------

Answer the user's question based on the above context.`;

/**
 * Create a RAG chain for answering questions based on learning path documents
 */
export async function createRAGChain(
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
) {
  // Create the language model
  const model = createChatModel(llmModel);

  // Create the prompt template
  const prompt = PromptTemplate.fromTemplate(DEFAULT_SYSTEM_TEMPLATE);

  // Create the output parser
  const outputParser = new StringOutputParser();

  // Create the retriever function
  const retriever = async (query: string) => {
    const docs = await similaritySearch(query, learningPathId, 5, embeddingModel);
    return docs;
  };

  // Create the RAG chain
  const chain = RunnableSequence.from([
    {
      context: async (input: { question: string }) => {
        const docs = await retriever(input.question);
        return formatDocumentsAsString(docs);
      },
      question: (input: { question: string }) => input.question,
    },
    prompt,
    model,
    outputParser,
  ]);

  return chain;
}

/**
 * Generate a response to a question using RAG
 */
export async function generateRAGResponse(
  question: string,
  learningPathId: string,
  llmModel: OpenSourceLLM = OpenSourceLLM.LLAMA3_8B,
  embeddingModel: OpenSourceEmbedding = OpenSourceEmbedding.BGE_SMALL,
) {
  const chain = await createRAGChain(learningPathId, llmModel, embeddingModel);
  const response = await chain.invoke({ question });
  return response;
}