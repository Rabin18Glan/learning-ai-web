import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Annotation, CompiledStateGraph, StateGraph } from "@langchain/langgraph";
import "cheerio";
import { pull } from "langchain/hub";
import { llm } from "./model";
import {
    EnhancedDocument,
    searchLearningPathDocuments
} from "./vector-store";

// Define the state types
const InputStateAnnotation = Annotation.Root({
    question: Annotation<string>,
    userId: Annotation<string>,
    learningPathId: Annotation<string>,
    chatId: Annotation<string | undefined>,
});

const StateAnnotation = Annotation.Root({
    question: Annotation<string>,
    userId: Annotation<string>,
    learningPathId: Annotation<string>,
    chatId: Annotation<string | undefined>,
    context: Annotation<EnhancedDocument[]>,
    answer: Annotation<string>,
    sourceDocuments: Annotation<EnhancedDocument[]>,
});

// Type definitions
type InputState = typeof InputStateAnnotation.State;
type FullState = typeof StateAnnotation.State;
type CompiledGraph = CompiledStateGraph<FullState, Partial<FullState>, "__start__" | "retrieve" | "generate">;

const retrieve = async (state: InputState): Promise<{
    context: EnhancedDocument[];
    sourceDocuments: EnhancedDocument[]
}> => {
    const retrievedDocs = await searchLearningPathDocuments(
        state.question,
        state.learningPathId,
        state.userId,
        4
    );

    console.log(retrievedDocs);
    return {
        context: retrievedDocs,
        sourceDocuments: retrievedDocs
    };
};

const generate = async (state: FullState): Promise<{
    answer: string;
    sourceDocuments: EnhancedDocument[]
}> => {
    // Create a custom prompt that specifically asks for markdown format
    const markdownPrompt = ChatPromptTemplate.fromTemplate(`
You are a helpful assistant that provides detailed answers based on the given context. 
Format your response using proper markdown syntax including:
- Headers (# ## ###) for main sections
- **bold** for emphasis
- *italic* for highlights
- \`code\` for technical terms
- Lists with - or 1. 
- Code blocks with \`\`\` when showing code examples
- > blockquotes for important notes

Context:
{context}

Question: {question}

Please provide a comprehensive answer in markdown format:
`);

    const docsContent = state.context.map((doc, index) => {
        return `**Source ${index + 1}** (${doc.metadata.resourceTitle}):\n${doc.pageContent}`;
    }).join("\n\n---\n\n");

    const messages = await markdownPrompt.invoke({
        question: state.question,
        context: docsContent
    });

    const response = await llm.invoke(messages);

    // Ensure response.content is a string
    const content = typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    // Create markdown-formatted source references
    const sourceReferences = state.context.map((doc, index) =>
        `[${index + 1}]: ${doc.metadata.resourceTitle}`
    ).join('\n');

    // Combine answer with markdown-formatted sources
    const markdownAnswer = `${content}\n\n---\n\n### Sources\n\n${sourceReferences}`;

    return {
        answer: markdownAnswer,
        sourceDocuments: state.sourceDocuments
    };
};

const graph: CompiledGraph = new StateGraph(StateAnnotation)
    .addNode("retrieve", retrieve)
    .addNode("generate", generate)
    .addEdge("__start__", "retrieve")
    .addEdge("retrieve", "generate")
    .addEdge("generate", "__end__")
    .compile();

export async function invokeAgent(
    learningPathId: string,
    userId: string,
    question: string
): Promise<{
    answer: string;
    sourceDocuments: EnhancedDocument[];
}> {
    const result = await graph.invoke({
        question,
        userId,
        learningPathId,
    });

    return {
        answer: result.answer,
        sourceDocuments: result.sourceDocuments || []
    };
}