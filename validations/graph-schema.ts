import { z } from "zod";

const VisualizationType = z.enum(["knowledge-graph", "mindmap", "dataflow-diagram"]);

const NodeSchema = z.object({
  id: z.string().describe("Unique identifier for the node"),
  label: z.string().describe("Display label for the node"),
  group: z.number().optional().describe("Optional group/category for styling or clustering"),
  parentId: z.string().optional().describe("Parent node ID for hierarchical structures like mindmaps; required for non-root nodes in mindmap visualizations"),
  type: z.enum(["start", "end", "process", "decision"]).optional().describe("Node type for dataflow diagrams; recommended for dataflow-diagram visualizations"),
});

const EdgeSchema = z.object({
  source: z.string().describe("Source node ID"),
  target: z.string().describe("Target node ID"),
  label: z.string().optional().describe("Optional label for the edge"),
  directed: z.boolean().optional().default(true).describe("Whether the edge is directed; defaults to true for dataflow-diagram and knowledge-graph"),
  strength: z.number().optional().describe("Optional strength or weight for the connection"),
});

const GraphDataSchema = z.object({
  type: VisualizationType.describe("The type of visualization for which the data is generated"),
  nodes: z.array(NodeSchema).describe("Array of nodes in the graph").min(1, "At least one node is required"),
  edges: z.array(EdgeSchema).describe("Array of edges connecting the nodes"),
  metadata: z.object({
    title: z.string().optional().describe("Optional title for the visualization"),
    description: z.string().optional().describe("Optional description of the graph"),
  }).optional(),
}).superRefine((data, ctx) => {
  // Additional validation for mindmap: ensure exactly one root node (no parentId) and others have parentId
  if (data.type === "mindmap") {
    const rootNodes = data.nodes.filter((n) => !n.parentId);
    if (rootNodes.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mindmap must have exactly one root node with no parentId",
        path: ["nodes"],
      });
    }
    const nonRootNodes = data.nodes.filter((n) => n.parentId);
    if (nonRootNodes.length > 0 && nonRootNodes.some((n) => !data.nodes.some((parent) => parent.id === n.parentId))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All non-root nodes must have a valid parentId referencing an existing node",
        path: ["nodes"],
      });
    }
  }

  // Additional validation for dataflow-diagram: ensure type is provided for nodes
  if (data.type === "dataflow-diagram") {
    if (data.nodes.some((n) => !n.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All nodes in dataflow-diagram must have a type (start, end, process, or decision)",
        path: ["nodes"],
      });
    }
  }

  // Ensure edges reference valid node IDs
  const nodeIds = new Set(data.nodes.map((n) => n.id));
  data.edges.forEach((edge, index) => {
    if (!nodeIds.has(edge.source)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge source ID "${edge.source}" does not match any node ID`,
        path: [`edges.${index}.source`],
      });
    }
    if (!nodeIds.has(edge.target)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Edge target ID "${edge.target}" does not match any node ID`,
        path: [`edges.${index}.target`],
      });
    }
  });
}).describe("Structured data for generating visualizations like knowledge graphs, mindmaps, or dataflow diagrams.");

export { GraphDataSchema };