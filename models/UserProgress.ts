import mongoose, { Document, Schema } from "mongoose";

export interface IUserProgress extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lastStreakCount: number;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
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

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    
    lastStreakCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

UserProgressSchema.index({ learningPathId: 1 });
UserProgressSchema.index({ userId: 1 });

export default mongoose.models.UserProgress ||
  mongoose.model<IUserProgress>("UserProgress", UserProgressSchema);
