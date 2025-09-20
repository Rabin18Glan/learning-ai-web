import mongoose, { type Document, Schema } from "mongoose";

export interface ITask extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resourceId?: mongoose.Types.ObjectId | null; // link back to resource if it's a "main task"
  parentTaskId?: mongoose.Types.ObjectId | null; // recursion support
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
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
    resourceId: {
      type: Schema.Types.ObjectId,
      ref: "Resource",
      default: null,
    },
    parentTaskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
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
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field: lets you populate children dynamically
TaskSchema.virtual("subTasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "parentTaskId",
  justOne: false,
});

// Helpful indexes
TaskSchema.index({ learningPathId: 1 });
TaskSchema.index({ userId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ parentTaskId: 1 });

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
