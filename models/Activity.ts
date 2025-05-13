import mongoose, { type Document, Schema } from "mongoose"

export interface IActivity extends Document {
  learningPathId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  type: string // e.g. 'resource_added', 'quiz_completed', etc.
  description?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const ActivitySchema = new Schema<IActivity>({
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
  type: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
})

// ActivitySchema.index({ learningPathId: 1 })
// ActivitySchema.index({ userId: 1 })
// ActivitySchema.index({ type: 1 })

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema)
