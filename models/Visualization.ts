import mongoose, { type Document, Schema } from "mongoose";

interface INode {
  id: string;
  label: string;
  group?: number;
  parentId?: string;
  type?: "start" | "end" | "process" | "decision";
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  importance?: number;
}

interface IEdge {
  source: string;
  target: string;
  label?: string;
  directed?: boolean;
  strength?: number;
  type?: string;
}

interface IMetadata {
  title?: string;
  description?: string;
}

export interface IVisualization extends Document {
  learningPathId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  visualizationType: "knowledge-graph" | "mindmap" | "dataflow-diagram";
  nodes: INode[];
  edges: IEdge[];
  layout: "force" | "hierarchical" | "dag";
  metadata?: IMetadata;
  settings: {
    theme: string;
    showLabels: boolean;
    nodeSize: "fixed" | "variable";
    edgeWidth: "fixed" | "variable";
    highlightConnections: boolean;
    groupClusters: boolean;
  };
  isPublic: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NodeSchema = new Schema<INode>({
  id: {
    type: String,
    required: [true, "Node ID is required"],
  },
  label: {
    type: String,
    required: [true, "Node label is required"],
  },
  group: {
    type: Number,
    required: false,
  },
  parentId: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["start", "end", "process", "decision"],
    required: false,
  },
  size: {
    type: Number,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  x: {
    type: Number,
    required: false,
  },
  y: {
    type: Number,
    required: false,
  },
  importance: {
    type: Number,
    required: false,
  },
});

const EdgeSchema = new Schema<IEdge>({
  source: {
    type: String,
    required: [true, "Edge source ID is required"],
  },
  target: {
    type: String,
    required: [true, "Edge target ID is required"],
  },
  label: {
    type: String,
    required: false,
  },
  directed: {
    type: Boolean,
    default: true,
    required: false,
  },
  strength: {
    type: Number,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const MetadataSchema = new Schema<IMetadata>({
  title: {
    type: String,
    trim: true,
    maxlength: [100, "Title cannot be more than 100 characters"],
    required: false,
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot be more than 500 characters"],
    required: false,
  },
});

const VisualizationSchema = new Schema<IVisualization>(
  {
    learningPathId: {
      type: Schema.Types.ObjectId,
      ref: "LearningPath",
      required: [true, "LearningPath ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    visualizationType: {
      type: String,
      enum: ["knowledge-graph", "mindmap", "dataflow-diagram"],
      required: [true, "Visualization type is required"],
    },
    nodes: {
      type: [NodeSchema],
      required: [true, "At least one node is required"],
      validate: {
        validator: (nodes: INode[]) => nodes.length > 0,
        message: "At least one node is required",
      },
    },
    edges: {
      type: [EdgeSchema],
      default: [], // Allow empty edges array for mindmap
    },
    layout: {
      type: String,
      enum: ["force", "hierarchical", "dag"],
      default: "force",
    },
    metadata: {
      type: MetadataSchema,
      required: false,
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
  }
);

// Custom validation for type-specific rules
VisualizationSchema.pre("validate", function (next) {
  const doc = this as IVisualization;

  // Validate mindmap: exactly one root node (no parentId)
  if (doc.visualizationType === "mindmap") {
    const rootNodes = doc.nodes.filter((n) => !n.parentId);
    if (rootNodes.length !== 1) {
      return next(new Error("Mindmap must have exactly one root node with no parentId"));
    }
    const nonRootNodes = doc.nodes.filter((n) => n.parentId);
    if (nonRootNodes.some((n) => !doc.nodes.some((parent) => parent.id === n.parentId))) {
      return next(new Error("All non-root nodes must have a valid parentId referencing an existing node"));
    }
  }

  // Validate dataflow-diagram: all nodes must have a type
  if (doc.visualizationType === "dataflow-diagram") {
    if (doc.nodes.some((n) => !n.type)) {
      return next(new Error("All nodes in dataflow-diagram must have a type (start, end, process, or decision)"));
    }
  }

  // Validate edges: source and target must reference existing nodes
  const nodeIds = new Set(doc.nodes.map((n) => n.id));
  if (doc.edges.some((e) => !nodeIds.has(e.source) || !nodeIds.has(e.target))) {
    return next(new Error("All edges must have source and target IDs that reference existing nodes"));
  }

  next();
});

// Indexes for faster queries
VisualizationSchema.index({ userId: 1 });
VisualizationSchema.index({ visualizationType: 1 });
VisualizationSchema.index({ learningPathId: 1 });
VisualizationSchema.index({ isPublic: 1 });

export default mongoose.models.Visualization || mongoose.model<IVisualization>("Visualization", VisualizationSchema);