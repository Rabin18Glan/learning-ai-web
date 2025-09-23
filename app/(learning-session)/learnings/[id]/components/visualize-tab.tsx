import {KnowledgeGraph }from "@/components/knowledge-graph";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { GraphDataSchema } from "@/validations/graph-schema";
import axios, { AxiosError } from "axios";
import { Network } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

interface VisualizationOptions {
  value: "knowledge-graph" | "mindmap" | "dataflow-diagram";
  label: string;
}

const visualizationOptions: VisualizationOptions[] = [
  { value: "knowledge-graph", label: "Knowledge Graph" },
  { value: "mindmap", label: "Mindmap" },
  { value: "dataflow-diagram", label: "Dataflow Diagram" },
];

interface GraphData {
  type: "knowledge-graph" | "mindmap" | "dataflow-diagram";
  nodes: Array<{
    id: string;
    label: string;
    group?: number;
    parentId?: string;
    type?: "start" | "end" | "process" | "decision";
  }>;
  edges: Array<{
    source: string;
    target: string;
    label?: string;
    directed?: boolean;
    strength?: number;
  }>;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export function VisualizeTab({ learningPathId }: { learningPathId: string }) {
  const [hasResources, setHasResources] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null);
  const [selectedViz, setSelectedViz] = useState<"knowledge-graph" | "mindmap" | "dataflow-diagram">(
    visualizationOptions[0].value
  );

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/learning-paths/${learningPathId}/resources`);
        if (!res.ok) throw new Error(`Failed to fetch resources: ${res.statusText}`);
        const data = await res.json();
        setHasResources(Array.isArray(data.resources) && data.resources.length > 0);
        setVectorStoreId(data.vectorStoreId || null);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setHasResources(false);
        setVectorStoreId(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [learningPathId]);

  // Fetch existing visualization
  useEffect(() => {
    if (hasResources ) {
      const fetchVisualization = async () => {
        setGraphLoading(true);
        try {
          const response = await axios.get(`/api/learning-paths/${learningPathId}/visualize`, {
            params: { type: selectedViz },
          });

          // Check if a visualization exists
          if (response.data.visualizations && response.data.visualizations.length > 0) {
            // Validate the first visualization against GraphDataSchema
            // const validatedData = GraphDataSchema.parse();
            setGraphData(response.data.visualizations[0]);
          } else {
            setGraphData(null); // No visualization found
          }
        } catch (error) {
          console.error("Error fetching visualization data:", error);
          if (error instanceof AxiosError) {
            console.error("Axios error details:", error.response?.data);
          } else if (error instanceof z.ZodError) {
            console.error("Validation error:", error.errors);
          }
          setGraphData(null);
        } finally {
          setGraphLoading(false);
        }
      };

      fetchVisualization();
    } else {
      setGraphData(null); // Reset graph data if resources or vectorStoreId are not available
    }
  }, [learningPathId, hasResources, vectorStoreId, selectedViz]);

  // Function to generate a new visualization
  const generateVisualization = async () => {
    if (!hasResources ) return;

    setGraphLoading(true);
    try {
      const response = await axios.post(`/api/learning-paths/${learningPathId}/visualize`, {
        type: selectedViz,
      });

      setGraphData(response.data.visualization);
    } catch (error) {
      console.error("Error generating visualization:", error);
      if (error instanceof AxiosError) {
        console.error("Axios error details:", error.response?.data);
      } else if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
      }
      setGraphData(null);
    } finally {
      setGraphLoading(false);
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Knowledge Visualization</CardTitle>
        <CardDescription>Visualize the concepts and relationships in your learning materials</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="mb-4">
          <Select
            value={selectedViz}
            onValueChange={(sel: "knowledge-graph" | "mindmap" | "dataflow-diagram") => setSelectedViz(sel)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select visualization type" />
            </SelectTrigger>
            <SelectContent>
              {visualizationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        {!hasResources ? (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Add some resources to this learning path to visualize knowledge
            </p>
            <Button>Add Resources</Button>
          </div>
        ) : graphLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !graphData ? (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No visualization available</h3>
            <p className="text-muted-foreground mb-6">
              Generate a visualization for the selected type.
            </p>
            <Button onClick={generateVisualization}>Generate Visualization</Button>
          </div>
        ) : (
          <div className=" bg-white  rounded-lg border ">
            <KnowledgeGraph data={graphData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VisualizeTab;