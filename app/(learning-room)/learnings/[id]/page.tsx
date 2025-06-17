"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, FileText, MessageSquare, FileEdit, Network, BarChart, Settings, ArrowLeft, Tag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/app/(learning-room)/learnings/[id]/_components/overview-tab"
import { ResourcesTab } from "@/app/(learning-room)/learnings/[id]/_components/resources-tab"
import { ChatTab } from "@/app/(learning-room)/learnings/[id]/_components/chat-tab"
import { VisualizeTab } from "@/app/(learning-room)/learnings/[id]/_components/visualize-tab"
import { NotesTab } from "@/app/(learning-room)/learnings/[id]/_components/notes-tab"
import { TrackingTab } from "@/app/(learning-room)/learnings/[id]/_components/tracking-tab"
import type { ResourceType } from "@/models/Resource"

// Duplicate the Resource type from ResourceList for compatibility
// Keep in sync with components/resource-list.tsx
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
  sections?: any[]
  resources: Resource[]
  createdAt?: string
  updatedAt?: string
  vectorStoreId?: string
  progress?: number
}

export default function LearningPathPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

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
      <Tabs defaultValue="overview"  value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="overview" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="visualize" className="gap-2">
            <Network className="h-4 w-4" />
            <span className="hidden md:inline">Visualize</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <FileEdit className="h-4 w-4" />
            <span className="hidden md:inline">Notes</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden md:inline">Tracking</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab learningPathId={id} />
        </TabsContent>
        <TabsContent value="resources" className="space-y-6">
          <ResourcesTab learningPathId={id} />
        </TabsContent>
        <TabsContent value="chat" className="space-y-6">
          <ChatTab learningPathId={id} />
        </TabsContent>
        <TabsContent value="visualize" className="space-y-6">
          <VisualizeTab learningPathId={id} />
        </TabsContent>
        <TabsContent value="notes" className="space-y-6">
          <NotesTab learningPathId={id} />
        </TabsContent>
        <TabsContent value="tracking" className="space-y-6">
          <TrackingTab learningPathId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
