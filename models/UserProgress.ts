import mongoose, { Schema, Document } from "mongoose"

export interface IUserProgress extends Document {
  learningPathId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  completedResources: mongoose.Types.ObjectId[] // Array of completed Resource IDs
  completedTasks: mongoose.Types.ObjectId[] // Array of completed Task IDs
  completedQuizs:mongoose.Types.ObjectId[]
  lastAccessedAt: Date
  createdAt: Date
  updatedAt: Date
}

const UserProgressSchema = new Schema<IUserProgress>({
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
  completedResources: [
    {
      type: Schema.Types.ObjectId,
      ref: "Resource",
    },
  ],
  completedTasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
   completedQuizs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// UserProgressSchema.index({ learningPathId: 1 })
// UserProgressSchema.index({ userId: 1 })

export default mongoose.models.UserProgress || mongoose.model<IUserProgress>("UserProgress", UserProgressSchema)