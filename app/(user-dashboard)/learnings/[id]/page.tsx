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
import  ChatInterface  from "@/components/chat-interface"
import { KnowledgeGraph } from "@/components/knowledge-graph"
import { NotesEditor } from "@/components/notes-editor"
import { ProgressTracker } from "@/components/progress-tracker"
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  Tag,
  Network,
  FileEdit,
  BarChart,
} from "lucide-react"
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
  progress?: number
}

export default function LearningPathPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
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

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <CardDescription>Your learning journey progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-500 dark:text-blue-400"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (learningPath.progress || 0) / 100)}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{learningPath.progress || 0}%</span>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-muted-foreground">
                    {learningPath.progress === 100
                      ? "Completed! 🎉"
                      : learningPath.progress === 0
                        ? "Just getting started"
                        : "Keep going!"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Learning materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Resources</span>
                    <span className="font-medium">{learningPath.resources.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">
                      {learningPath.resources.filter((r) => r.processingStatus === "completed").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">
                      {learningPath.resources.filter((r) => r.processingStatus === "processing").length}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => setActiveTab("resources")}>
                    View All Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Added new resource</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900">
                      <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Chat session</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                      <Network className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created visualization</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Learning Path Summary</CardTitle>
              <CardDescription>AI-generated summary of your learning materials</CardDescription>
            </CardHeader>
            <CardContent>
              {learningPath.resources.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-medium mb-2">No resources yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add some resources to generate a summary of your learning path
                  </p>
                  <Button size="sm" onClick={handleAddResources}>
                    Add Resources
                  </Button>
                </div>
              ) : !learningPath.vectorStoreId ? (
                <div className="text-center py-6">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-base font-medium mb-2">Resources are being processed</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please wait while we process your resources. This may take a few minutes.
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>
                    This learning path covers key concepts in machine learning, including supervised and unsupervised
                    learning techniques. The materials explore fundamental algorithms, data preprocessing methods, and
                    model evaluation strategies.
                  </p>
                  <p>Main topics include:</p>
                  <ul>
                    <li>Classification and regression techniques</li>
                    <li>Neural networks and deep learning</li>
                    <li>Feature engineering and selection</li>
                    <li>Model evaluation and validation</li>
                    <li>Practical applications in various domains</li>
                  </ul>
                  <p>
                    The resources provide both theoretical foundations and practical implementations, making this path
                    suitable for beginners and intermediate learners looking to build practical machine learning skills.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

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
                  {/* <KnowledgeGraph learningPathId={id} /> */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Take and organize notes for this learning path</CardDescription>
            </CardHeader>
            <CardContent>
              <NotesEditor learningPathId={id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>Track your learning progress and set goals</CardDescription>
            </CardHeader>
            <CardContent>
              <ProgressTracker learningPathId={id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
