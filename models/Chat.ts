import mongoose, { type Document, Schema } from "mongoose"

export interface IChat extends Document {
  learningPathId: mongoose.Types.ObjectId // Reference to parent LearningPath
  title: string
  userId: mongoose.Types.ObjectId
  lastMessageAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ChatSchema = new Schema<IChat>(
  {
    learningPathId: {
      type: Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a chat title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    lastMessageAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries (optional)
// ChatSchema.index({ userId: 1 })
// ChatSchema.index({ learningPathId: 1 })
// ChatSchema.index({ lastMessageAt: -1 })

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema)
