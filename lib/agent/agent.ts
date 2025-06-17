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
    const promptTemplate = await pull<ChatPromptTemplate>("rlm/rag-prompt");
    const docsContent = state.context.map((doc, index) => {
        const source = `Source ${index + 1} (${doc.metadata.resourceTitle}): ${doc.pageContent}`;
        return source;
    }).join("\n\n");

    const messages = await promptTemplate.invoke({
        question: state.question,
        context: docsContent
    });

    const response = await llm.invoke(messages);

    // Ensure response.content is a string
    const content = typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    // Add source information to the answer
    const sourceInfo = state.context.map((doc, index) =>
        `[${index + 1}] ${doc.metadata.resourceTitle}`
    ).join(', ');

    const enhancedAnswer = `${content}\n\n*Sources: ${sourceInfo}*`;

    return {
        answer: enhancedAnswer,
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

