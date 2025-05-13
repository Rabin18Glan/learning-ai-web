import mongoose, { type Document, Schema } from "mongoose"

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId // Reference to parent Chat
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  userId?: mongoose.Types.ObjectId // Optional: for user messages
}

const MessageSchema = new Schema<IMessage>({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
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
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
})

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema)
