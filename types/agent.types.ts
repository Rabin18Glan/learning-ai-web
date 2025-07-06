export interface AgentResponse {
  answer: string;
  sourceDocuments: EnhancedDocument[];
  metadata: {
    sourceCount: number;
    hasConversationHistory: boolean;
    timestamp: string;
    learningPathId: string;
    [key: string]: any;
  };
}


export interface VectorDocumentMetadata {
  userId: string;
  learningPathId: string;
  chatId?: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: string;
  chunkIndex: number;
  totalChunks: number;
  createdAt: Date;
  source: string;
  tags?: string[];
  isPublic?: boolean;
}

// Search filters interface
export interface VectorSearchFilters {
  userId?: string;
  learningPathId?: string;
  chatId?: string;
  resourceId?: string;
  resourceType?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Enhanced document interface that extends LangChain Document
export interface EnhancedDocument extends Document {
  metadata: VectorDocumentMetadata;
}