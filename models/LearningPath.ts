import mongoose, { type Document, Schema } from "mongoose"

export interface ILearningPath extends Document {
  title: string
  description: string
  creatorId: mongoose.Types.ObjectId
  isPublic: boolean
  tags: string[]
  collaborators: mongoose.Types.ObjectId[]
  vectorStoreId?: string
  createdAt: Date
  updatedAt: Date
}

const LearningPathSchema = new Schema<ILearningPath>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  vectorStoreId: {
    type: String,
  },
}, {
  timestamps: true,
})

// LearningPathSchema.index({ creatorId: 1 })
// LearningPathSchema.index({ collaborators: 1 })
// LearningPathSchema.index({ tags: 1 })
// LearningPathSchema.index({ isPublic: 1 })
// LearningPathSchema.index({ title: "text", description: "text", tags: "text" })

export default mongoose.models.LearningPath || mongoose.model<ILearningPath>("LearningPath", LearningPathSchema)
