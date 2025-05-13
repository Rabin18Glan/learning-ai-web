import mongoose, { type Document, Schema } from "mongoose"

export interface INote extends Document {
  learningPathId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  content: string
  resourceId?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const NoteSchema = new Schema<INote>({
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
  content: {
    type: String,
    required: true,
    trim: true,
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: "Resource",
  },
}, {
  timestamps: true,
})

// NoteSchema.index({ learningPathId: 1 })
// NoteSchema.index({ userId: 1 })

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema)
