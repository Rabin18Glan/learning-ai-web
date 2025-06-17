import mongoose, { type Document ,Schema } from "mongoose"
export enum ResourceType {
  DOCX="docx",
  PDF = "application/pdf",
  TEXT="txt",
  YOUTUBE = "youtube",
  Resource = "Resource",
  WEBPAGE = "webpage",
  IMAGE = "image",
  AUDIO = "audio",
    CSV = "csv",
      RECURSIVE_URL = "recursice_url",
}

export interface IResource extends Document{
  learningPathId: mongoose.Types.ObjectId // Reference to parent LearningPath
  title: string
  description?: string
  fileUrl: string
  fileType: string
  fileSize: number
  thumbnailUrl?: string
  tags: string[]
  status: "processing" | "ready" | "error"
  processingError?: string
  metadata: {
    pageCount?: number
    wordCount?: number
    createdDate?: Date
    author?: string
    lastModified?: Date
  }
  isPublic: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export const ResourceSchema = new Schema<IResource>(
  {
    learningPathId: {
      type: Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a Resource title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
    },
    fileSize: {
      type: Number,
      required: [true, "File size is required"],
    },
    thumbnailUrl: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ["processing", "ready", "error"],
      default: "processing",
    },
    processingError: {
      type: String,
    },
    metadata: {
      pageCount: Number,
      wordCount: Number,
      createdDate: Date,
      author: String,
      lastModified: Date,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
// ResourceSchema.index({ learningPathId: 1 })
// ResourceSchema.index({ tags: 1 })
// ResourceSchema.index({ status: 1 })
// ResourceSchema.index({ isPublic: 1 })
// ResourceSchema.index({ title: "text", description: "text", tags: "text" })


export default (mongoose.models.Resource) || mongoose.model<IResource>("Resource", ResourceSchema)