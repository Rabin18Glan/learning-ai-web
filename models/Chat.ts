import mongoose, { type Document, Schema } from "mongoose"

interface IMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

export interface IChat extends Document {
  title: string
  userId: mongoose.Types.ObjectId
  documentIds: mongoose.Types.ObjectId[]
  messages: IMessage[]
  lastMessageAt: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const ChatSchema = new Schema<IChat>(
  {
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
    documentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    messages: [MessageSchema],
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
ChatSchema.index({ userId: 1 })
ChatSchema.index({ documentIds: 1 })
ChatSchema.index({ lastMessageAt: -1 })

// Update lastMessageAt when a new message is added
ChatSchema.pre("save", function (next) {
  if (this.isModified("messages")) {
    this.lastMessageAt = new Date()
  }
  next()
})

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema)
