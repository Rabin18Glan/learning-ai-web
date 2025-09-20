import mongoose, { type Document, Schema } from "mongoose";

export enum ActivityType {
  ADDED = "ADDED",
  DELETED = "DELETED",
  UPDATED = "UPDATED",
  VIEWED = "VIEWED",
}

export enum ActivityArea {
  RESOURCES = "RESOURCES",
  CHAT = "CHAT",
  NOTE = "NOTE",
  VISUALIZE = "VISUALIZE",
  TASK = "TASK",
}

export interface IActivity extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: ActivityType;
  description: string;
  area: ActivityArea;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
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
    type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required:true
    },
    area: {
      type: String,
      enum: Object.values(ActivityArea),
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
ActivitySchema.index({ learningPathId: 1 });
ActivitySchema.index({ userId: 1 });
ActivitySchema.index({ type: 1 });
ActivitySchema.index({ area: 1 });

export default mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
