import React, { useEffect, useState } from "react" 
import { KnowledgeGraph } from "@/components/knowledge-graph" 
import { Skeleton } from "@/components/ui/skeleton" 
import { Button } from "@/components/ui/button" 
import { Network } from "lucide-react" 
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"  

// Dummy data for the knowledge graph
const dummyGraphData = {
  nodes: [
    { id: "n1", label: "React", group: 1 },
    { id: "n2", label: "Components", group: 1 },
    { id: "n3", label: "Hooks", group: 1 },
    { id: "n4", label: "State", group: 2 },
    { id: "n5", label: "Props", group: 2 },
    { id: "n6", label: "Context", group: 2 },
    { id: "n7", label: "Redux", group: 3 },
    { id: "n8", label: "TypeScript", group: 4 },
    { id: "n9", label: "JSX", group: 1 },
    { id: "n10", label: "Next.js", group: 5 }
  ],
  edges: [
    { source: "n1", target: "n2", label: "contains" },
    { source: "n1", target: "n3", label: "uses" },
    { source: "n1", target: "n9", label: "uses" },
    { source: "n2", target: "n4", label: "manages" },
    { source: "n2", target: "n5", label: "accepts" },
    { source: "n3", target: "n4", label: "manages" },
    { source: "n3", target: "n6", label: "provides" },
    { source: "n7", target: "n4", label: "manages" },
    { source: "n8", target: "n1", label: "enhances" },
    { source: "n10", target: "n1", label: "builds on" },
    { source: "n6", target: "n5", label: "avoids prop drilling" }
  ]
};

export function VisualizeTab({ learningPathId }: { learningPathId: string }) {
  const [hasResources, setHasResources] = useState<boolean | null>(true) // Set to true for demo
  const [isLoading, setIsLoading] = useState(false) // Set to false for demo
  const [graphData, setGraphData] = useState<any | null>(dummyGraphData) // Set dummy data
  const [graphLoading, setGraphLoading] = useState(false)
  const [vectorStoreId, setVectorStoreId] = useState<string | null>("dummy-vector-id") // Set dummy ID
  
  // Comment out or remove the API fetching logic for demo
  /*
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/learning-paths/${learningPathId}/resources`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setHasResources(Array.isArray(data.resources) && data.resources.length > 0)
        setVectorStoreId(data.vectorStoreId || null)
      } catch {
        setHasResources(false)
        setVectorStoreId(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [learningPathId])
  
  useEffect(() => {
    if (hasResources && vectorStoreId) {
      setGraphLoading(true)
      fetch(`/api/learning-paths/${learningPathId}/visualize`)
        .then(res => res.json())
        .then(data => setGraphData(data))
        .catch(() => setGraphData(null))
        .finally(() => setGraphLoading(false))
    }
  }, [learningPathId, hasResources, vectorStoreId])
  */
  
  // For demo purposes, add a function to simulate different states
  const simulateState = (state: string) => {
    switch(state) {
      case "loading":
        setIsLoading(true);
        break;
      case "no-resources":
        setIsLoading(false);
        setHasResources(false);
        break;
      case "processing":
        setIsLoading(false);
        setHasResources(true);
        setVectorStoreId(null);
        break;
      case "loading-graph":
        setIsLoading(false);
        setHasResources(true);
        setVectorStoreId("dummy-id");
        setGraphLoading(true);
        break;
      case "error":
        setIsLoading(false);
        setHasResources(true);
        setVectorStoreId("dummy-id");
        setGraphData(null);
        setGraphLoading(false);
        break;
      case "loaded":
        setIsLoading(false);
        setHasResources(true);
        setVectorStoreId("dummy-id");
        setGraphData(dummyGraphData);
        setGraphLoading(false);
        break;
    }
  };

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Visualization</CardTitle>
        <CardDescription>Visualize the concepts and relationships in your learning materials</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Demo controls - remove in production */}
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h4 className="text-sm font-medium mb-2">Demo Controls</h4>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => simulateState("loading")}>
              Loading
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateState("no-resources")}>
              No Resources
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateState("processing")}>
              Processing
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateState("loading-graph")}>
              Loading Graph
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateState("error")}>
              Error
            </Button>
            <Button size="sm" variant="outline" onClick={() => simulateState("loaded")}>
              Loaded
            </Button>
          </div>
        </div>

        {!hasResources ? (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Add some resources to this learning path to visualize knowledge
            </p>
            <Button onClick={() => simulateState("loaded")}>Add Resources</Button>
          </div>
        ) : !vectorStoreId ? (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Resources are being processed</h3>
            <p className="text-muted-foreground mb-6">
              Please wait while we process your resources. This may take a few minutes.
            </p>
          </div>
        ) : graphLoading || !graphData ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="h-[600px] bg-white dark:bg-gray-900 rounded-lg border p-1">
            <KnowledgeGraph data={graphData} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}