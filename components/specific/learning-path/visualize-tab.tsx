import React, { useEffect, useState } from "react"
import { KnowledgeGraph } from "@/components/knowledge-graph"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Network } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function VisualizeTab({ learningPathId }: { learningPathId: string }) {
  const [hasResources, setHasResources] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [graphData, setGraphData] = useState<any | null>(null)
  const [graphLoading, setGraphLoading] = useState(false)
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/learning-paths/${learningPathId}`)
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

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Visualization</CardTitle>
        <CardDescription>Visualize the concepts and relationships in your learning materials</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasResources ? (
          <div className="text-center py-12">
            <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Add some resources to this learning path to visualize knowledge
            </p>
            <Button>Add Resources</Button>
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
