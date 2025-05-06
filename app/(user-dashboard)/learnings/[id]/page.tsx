"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ResourceUploader } from "@/components/resource-uploader"
import { ResourceList } from "@/components/resource-list"
import { ChatInterface } from "@/components/chat-interface"
import { KnowledgeGraph } from "@/components/knowledge-graph"
import { ArrowLeft, BookOpen, MessageSquare, FileText, Settings, Plus, Tag, Network } from "lucide-react"
import type { ResourceType } from "@/models/LearningPath"

interface Resource {
  _id: string
  type: ResourceType
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  addedAt: string
  processingStatus: "pending" | "processing" | "completed" | "failed"
  processingError?: string
  metadata: Record<string, any>
}

interface LearningPath {
  _id: string
  title: string
  description: string
  coverImage?: string
  tags: string[]
  creatorId: {
    _id: string
    name: string
    email: string
    image?: string
  }
  isPublic: boolean
  sections: any[]
  resources: Resource[]
  createdAt: string
  updatedAt: string
  vectorStoreId?: string
}

export default function LearningPathPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("resources")
  const [isLoading, setIsLoading] = useState(true)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  const id = params.id as string

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/learning-paths/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch learning path")
        }

        const data = await response.json()
        setLearningPath(data)
      } catch (error) {
        console.error("Error fetching learning path:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchLearningPath()
    }
  }, [id])

  const handleAddResources = () => {
    setShowUploader(true)
  }

  const handleResourcesAdded = async () => {
    setShowUploader(false)
    // Refresh learning path data
    const response = await fetch(`/api/learning-paths/${id}`)
    if (response.ok) {
      const data = await response.json()
      setLearningPath(data)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Skeleton className="h-12 w-full mb-6" />

        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Learning Path Not Found</h1>
        <p className="mb-6">The learning path you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => router.push("/learnings")}>Back to Learnings</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/learnings")} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{learningPath.title}</h1>
          <p className="text-muted-foreground mt-1">{learningPath.description}</p>
        </div>
        <Button variant="outline" size="icon" className="ml-2">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {learningPath.tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {tag}
          </Badge>
        ))}
        {learningPath.isPublic && (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Public
          </Badge>
        )}
      </div>

      <Tabs defaultValue="resources" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="resources" className="gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat with AI
          </TabsTrigger>
          <TabsTrigger value="visualize" className="gap-2">
            <Network className="h-4 w-4" />
            Visualize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>Add and manage resources for this learning path</CardDescription>
              </div>
              <Button onClick={handleAddResources} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Resources
              </Button>
            </CardHeader>
            <CardContent>
              {showUploader ? (
                <ResourceUploader
                  learningPathId={id}
                  onCancel={() => setShowUploader(false)}
                  onSuccess={handleResourcesAdded}
                />
              ) : (
                <ResourceList resources={learningPath.resources} learningPathId={id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chat with AI Tutor</CardTitle>
              <CardDescription>Ask questions about the content in this learning path</CardDescription>
            </CardHeader>
            <CardContent>
              {learningPath.resources.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add some resources to this learning path to start chatting with the AI tutor
                  </p>
                  <Button onClick={handleAddResources}>Add Resources</Button>
                </div>
              ) : !learningPath.vectorStoreId ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Resources are being processed</h3>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we process your resources. This may take a few minutes.
                  </p>
                </div>
              ) : (
                <ChatInterface learningPathId={id} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Visualization</CardTitle>
              <CardDescription>Visualize the concepts and relationships in your learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              {learningPath.resources.length === 0 ? (
                <div className="text-center py-12">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No resources yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Add some resources to this learning path to visualize knowledge
                  </p>
                  <Button onClick={handleAddResources}>Add Resources</Button>
                </div>
              ) : !learningPath.vectorStoreId ? (
                <div className="text-center py-12">
                  <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Resources are being processed</h3>
                  <p className="text-muted-foreground mb-6">
                    Please wait while we process your resources. This may take a few minutes.
                  </p>
                </div>
              ) : (
                <div className="h-[600px] bg-white dark:bg-gray-900 rounded-lg border p-1">
                  <KnowledgeGraph learningPathId={id} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
