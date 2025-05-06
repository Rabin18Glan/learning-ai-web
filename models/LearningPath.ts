import mongoose, { type Document, Schema } from "mongoose"

// Resource types that can be added to a learning path
export enum ResourceType {
  PDF = "pdf",
  YOUTUBE = "youtube",
  DOCUMENT = "document",
  WEBPAGE = "webpage",
  IMAGE = "image",
  AUDIO = "audio",
}

// Resource schema for different types of content
interface IResource {
  type: ResourceType
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  addedAt: Date
  processingStatus: "pending" | "processing" | "completed" | "failed"
  processingError?: string
  metadata: {
    [key: string]: any
  }
}

// Section schema to organize resources
interface ISection {
  title: string
  description?: string
  order: number
  resources: IResource[]
}

// User progress tracking
interface IUserProgress {
  userId: mongoose.Types.ObjectId
  completedResources: string[] // Array of resource IDs
  lastAccessedAt: Date
  notes: {
    content: string
    resourceId: string
    createdAt: Date
  }[]
}

// Main learning path schema
export interface ILearningPath extends Document {
  title: string
  description: string
  coverImage?: string
  creatorId: mongoose.Types.ObjectId
  isPublic: boolean
  tags: string[]
  sections: ISection[]
  resources: IResource[] // Flat list of all resources for easier querying
  userProgress: IUserProgress[]
  collaborators: mongoose.Types.ObjectId[]
  vectorStoreId?: string // Reference to vector store for this learning path
  createdAt: Date
  updatedAt: Date
}

// Resource schema definition
const ResourceSchema = new Schema<IResource>({
  type: {
    type: String,
    enum: Object.values(ResourceType),
    required: [true, "Resource type is required"],
  },
  title: {
    type: String,
    required: [true, "Resource title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    required: [true, "Resource URL is required"],
  },
  thumbnailUrl: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  processingStatus: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending",
  },
  processingError: {
    type: String,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
})

// Section schema definition
const SectionSchema = new Schema<ISection>({
  title: {
    type: String,
    required: [true, "Section title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: true,
  },
  resources: [ResourceSchema],
})

// User progress schema definition
const UserProgressSchema = new Schema<IUserProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedResources: [String],
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
  notes: [
    {
      content: {
        type: String,
        required: true,
      },
      resourceId: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
})

// Main learning path schema definition
const LearningPathSchema = new Schema<ILearningPath>(
  {
    title: {
      type: String,
      required: [true, "Please provide a learning path title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    coverImage: {
      type: String,
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sections: [SectionSchema],
    resources: [ResourceSchema], // Flat list for easier querying
    userProgress: [UserProgressSchema],
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    vectorStoreId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
LearningPathSchema.index({ creatorId: 1 })
LearningPathSchema.index({ collaborators: 1 })
LearningPathSchema.index({ tags: 1 })
LearningPathSchema.index({ isPublic: 1 })
LearningPathSchema.index({ title: "text", description: "text", tags: "text" })
LearningPathSchema.index({ "resources.processingStatus": 1 })

export default mongoose.models.LearningPath || mongoose.model<ILearningPath>("LearningPath", LearningPathSchema)
