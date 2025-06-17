import mongoose, { type Document, Schema } from "mongoose"

export interface ITask extends Document {
  learningPathId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>({
  learningPathId: {
    type: Schema.Types.ObjectId,
    ref: "LearningPath",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  dueDate: {
    type: Date,
  },
}, {
  timestamps: true,
})

// TaskSchema.index({ learningPathId: 1 })
// TaskSchema.index({ userId: 1 })
// TaskSchema.index({ status: 1 })

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
