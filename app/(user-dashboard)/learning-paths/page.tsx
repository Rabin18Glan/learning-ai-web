"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, BookOpen, Users, Tag } from "lucide-react"
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

export default function LearningPathsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("my-paths")
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
        setLearningPaths(data.learningPaths)
      } catch (error) {
        console.error("Error fetching learning paths:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLearningPaths()
  }, [activeTab])

  const handleCreatePath = () => {
    router.push("/learning-paths/create")
  }

  const handleOpenPath = (id: string) => {
    router.push(`/learning-paths/${id}`)
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
          <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
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
            placeholder="Search learning paths..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="my-paths" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-paths" className="gap-2">
            <BookOpen className="h-4 w-4" />
            My Learning Paths
          </TabsTrigger>
          <TabsTrigger value="public" className="gap-2">
            <Users className="h-4 w-4" />
            Public Paths
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-paths" className="space-y-4">
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
                        src={path.coverImage || "/placeholder.svg"}
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

        <TabsContent value="public" className="space-y-4">
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
                        src={path.coverImage || "/placeholder.svg"}
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
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                        {path.creatorId.image ? (
                          <img
                            src={path.creatorId.image || "/placeholder.svg"}
                            alt={path.creatorId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xs">
                            {path.creatorId.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{path.creatorId.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
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
                      Explore Learning Path
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No public learning paths found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "No public learning paths match your search criteria"
                  : "There are no public learning paths available yet"}
              </p>
              <Button onClick={handleCreatePath}>Create and Share Your Own</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
