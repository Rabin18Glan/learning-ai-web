import mongoose, { type Document, Schema } from "mongoose"

export interface IDocument extends Document {
  title: string
  description?: string
  fileUrl: string
  fileType: string
  fileSize: number
  thumbnailUrl?: string
  userId: mongoose.Types.ObjectId
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

const DocumentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, "Please provide a document title"],
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
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
DocumentSchema.index({ userId: 1 })
DocumentSchema.index({ tags: 1 })
DocumentSchema.index({ status: 1 })
DocumentSchema.index({ isPublic: 1 })
DocumentSchema.index({ title: "text", description: "text", tags: "text" })

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema)
