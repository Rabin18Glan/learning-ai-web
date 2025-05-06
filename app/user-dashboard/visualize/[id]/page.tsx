"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MindMap } from "@/components/mind-map"
import { KnowledgeGraph } from "@/components/knowledge-graph"
import { FileText, Download, Share, Maximize2, Network } from "lucide-react"

type VisualizationNode = {
  id: string
  label: string
  group?: number
}

type VisualizationEdge = {
  source: string
  target: string
  label?: string
}

type VisualizationData = {
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
}

export default function VisualizePage() {
  const params = useParams()
  const documentId = params.id as string
  const [visualizationType, setVisualizationType] = useState<"mindmap" | "knowledgegraph">("mindmap")
  const [data, setData] = useState<VisualizationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [documentName, setDocumentName] = useState("Physics Notes.pdf")

  useEffect(() => {
    const fetchVisualizationData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/visualization", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentId,
            visualizationType,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch visualization data")
        }

        const data = await response.json()
        setData(data)
      } catch (error) {
        console.error("Error fetching visualization:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisualizationData()
  }, [documentId, visualizationType])

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Visualize Document</h1>
          <div className="flex items-center gap-2 mt-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground">{documentName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm">
            <Maximize2 className="h-4 w-4 mr-2" />
            Full Screen
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-none shadow-md">
        <CardHeader>
          <CardTitle>Document Visualization</CardTitle>
          <CardDescription>Visualize the concepts and relationships in your document</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <Tabs defaultValue={visualizationType} onValueChange={(value) => setVisualizationType(value as any)}>
              <TabsList>
                <TabsTrigger value="mindmap" className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                    <path d="M12 12h.01" />
                    <path d="M14 12a2 2 0 1 0-4 0" />
                    <path d="M14 9a2 2 0 1 0-4 0" />
                    <path d="M17 8a2 2 0 1 0-4 0" />
                    <path d="M17 15a2 2 0 1 0-4 0" />
                    <path d="M7 8a2 2 0 1 0 4 0" />
                    <path d="M7 15a2 2 0 1 0 4 0" />
                  </svg>
                  Mind Map
                </TabsTrigger>
                <TabsTrigger value="knowledgegraph" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Knowledge Graph
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Select defaultValue="physics">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="quantum">Quantum Physics</SelectItem>
                <SelectItem value="mechanics">Mechanics</SelectItem>
                <SelectItem value="all">All Topics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg border p-1 h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="mindmap" className="h-full mt-0">
                  {data && <MindMap data={data} />}
                </TabsContent>
                <TabsContent value="knowledgegraph" className="h-full mt-0">
                  {data && <KnowledgeGraph data={data} />}
                </TabsContent>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Key Concepts</CardTitle>
            <CardDescription>Main topics identified in the document</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">Quantum Physics</span>
                <span className="text-xs text-muted-foreground ml-auto">5 connections</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="font-medium">Wave-Particle Duality</span>
                <span className="text-xs text-muted-foreground ml-auto">3 connections</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Quantum Entanglement</span>
                <span className="text-xs text-muted-foreground ml-auto">2 connections</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="font-medium">Schrödinger's Equation</span>
                <span className="text-xs text-muted-foreground ml-auto">1 connection</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="font-medium">Quantum Computing</span>
                <span className="text-xs text-muted-foreground ml-auto">1 connection</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relationships</CardTitle>
            <CardDescription>Connections between concepts</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium">Quantum Physics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-medium">Wave-Particle Duality</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium">Quantum Physics</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-medium">Quantum Entanglement</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium">Wave-Particle Duality</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-medium">Schrödinger's Equation</span>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
                <span className="font-medium">Quantum Entanglement</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span className="font-medium">Quantum Computing</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
