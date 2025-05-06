import mongoose, { type Document, Schema } from "mongoose"

interface INode {
  id: string
  label: string
  type: string
  size?: number
  color?: string
  x?: number
  y?: number
  importance?: number
}

interface IEdge {
  source: string
  target: string
  label?: string
  weight?: number
  type?: string
}

export interface IVisualization extends Document {
  title: string
  description?: string
  userId: mongoose.Types.ObjectId
  documentIds: mongoose.Types.ObjectId[]
  visualizationType: "mindMap" | "knowledgeGraph" | "conceptMap" | "timeline"
  nodes: INode[]
  edges: IEdge[]
  layout: "force" | "radial" | "hierarchical" | "circular"
  settings: {
    theme: string
    showLabels: boolean
    nodeSize: "fixed" | "variable"
    edgeWidth: "fixed" | "variable"
    highlightConnections: boolean
    groupClusters: boolean
  }
  isPublic: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

const NodeSchema = new Schema<INode>({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  size: Number,
  color: String,
  x: Number,
  y: Number,
  importance: Number,
})

const EdgeSchema = new Schema<IEdge>({
  source: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  label: String,
  weight: Number,
  type: String,
})

const VisualizationSchema = new Schema<IVisualization>(
  {
    title: {
      type: String,
      required: [true, "Please provide a visualization title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
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
        required: [true, "At least one document ID is required"],
      },
    ],
    visualizationType: {
      type: String,
      enum: ["mindMap", "knowledgeGraph", "conceptMap", "timeline"],
      required: [true, "Visualization type is required"],
    },
    nodes: {
      type: [NodeSchema],
      required: [true, "Nodes are required"],
    },
    edges: {
      type: [EdgeSchema],
      required: [true, "Edges are required"],
    },
    layout: {
      type: String,
      enum: ["force", "radial", "hierarchical", "circular"],
      default: "force",
    },
    settings: {
      theme: {
        type: String,
        default: "light",
      },
      showLabels: {
        type: Boolean,
        default: true,
      },
      nodeSize: {
        type: String,
        enum: ["fixed", "variable"],
        default: "variable",
      },
      edgeWidth: {
        type: String,
        enum: ["fixed", "variable"],
        default: "variable",
      },
      highlightConnections: {
        type: Boolean,
        default: true,
      },
      groupClusters: {
        type: Boolean,
        default: false,
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for faster queries
VisualizationSchema.index({ userId: 1 })
VisualizationSchema.index({ documentIds: 1 })
VisualizationSchema.index({ visualizationType: 1 })
VisualizationSchema.index({ isPublic: 1 })

export default mongoose.models.Visualization || mongoose.model<IVisualization>("Visualization", VisualizationSchema)
