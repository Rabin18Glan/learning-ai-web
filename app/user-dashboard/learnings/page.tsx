"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, BookOpen, Tag, FileText, MessageSquare, Network } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
  createdAt: string
  updatedAt: string
}

export default function LearningsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("paths")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])

  useEffect(() => {
    const fetchLearningPaths = async () => {
      setIsLoading(true)
      try {
        const isPublic = activeTab === "public"
        const response = await fetch(`/api/learning-paths?public=${isPublic}`)

        if (!response.ok) {
          throw new Error("Failed to fetch learning paths")
        }

        const data = await response.json()
        setLearningPaths(data.learningPaths || [])
      } catch (error) {
        console.error("Error fetching learning paths:", error)
        setLearningPaths([])
      } finally {
        setIsLoading(false)
      }
    }

    if (activeTab === "paths" || activeTab === "public") {
      fetchLearningPaths()
    }
  }, [activeTab])

  const handleCreatePath = () => {
    router.push("/learnings/create")
  }

  const handleOpenPath = (id: string) => {
    router.push(`/learnings/${id}`)
  }

  const filteredPaths = searchQuery
    ? learningPaths.filter(
        (path) =>
          path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          path.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : learningPaths

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learnings</h1>
          <p className="text-muted-foreground mt-1">Create and explore learning paths with AI-powered assistance</p>
        </div>
        <Button onClick={handleCreatePath} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Learning Path
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search learning paths, documents, and more..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="paths" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="paths" className="gap-2">
            <BookOpen className="h-4 w-4" />
            My Paths
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="visualize" className="gap-2">
            <Network className="h-4 w-4" />
            Visualize
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <Card key={path._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40">
                    {path.coverImage ? (
                      <img
                        src={path.coverImage || "/placeholder.svg?height=200&width=400"}
                        alt={path.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">{path.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {path.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleOpenPath(path._id)}>
                      Open Learning Path
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No learning paths found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "No learning paths match your search criteria"
                  : "You haven't created any learning paths yet"}
              </p>
              <Button onClick={handleCreatePath}>Create Your First Learning Path</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents</span>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No documents found</h3>
                <p className="text-muted-foreground mb-6">Upload documents to your learning paths to start learning</p>
                <Button>Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Chat Sessions</span>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No chat sessions found</h3>
                <p className="text-muted-foreground mb-6">Start a new chat with your learning materials</p>
                <Button>Start New Chat</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualize" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Knowledge Visualization</span>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Visualization
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Network className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No visualizations found</h3>
                <p className="text-muted-foreground mb-6">Create visualizations from your learning materials</p>
                <Button>Create Visualization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
