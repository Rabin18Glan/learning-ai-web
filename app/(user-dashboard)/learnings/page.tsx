"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BookOpen, Tag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LearningPathCard } from "@/components/learning-path-card"

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
  progress?: number
}

export default function LearningsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [isLoading, setIsLoading] = useState(true)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])

  useEffect(() => {
    const fetchLearningPaths = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/learning-paths`)

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

    fetchLearningPaths()
  }, [])

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

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "progress") {
      return (b.progress || 0) - (a.progress || 0)
    }
    return 0
  })


  console.log(learningPaths)
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground mt-1">Create and explore personalized learning journeys</p>
        </div>
        <Button onClick={handleCreatePath} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Learning Path
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search learning paths..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Updated</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : sortedPaths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPaths.map((path) => (

            <Card key={path._id} className="overflow-hidden hover:shadow-md transition-shadow">
             
              <CardHeader className="pb-2">
                <CardTitle className="">{path.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {path.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {path.tags.length > 3 && <Badge variant="outline">+{path.tags.length - 3} more</Badge>}
                </div>
                {path.progress !== undefined && (
                  <p className="text-sm text-muted-foreground mt-3">Progress: {path.progress}%</p>
                )}
              </CardContent>
              <CardFooter>
                
                <Button variant="outline" className="w-full" onClick={() => handleOpenPath(path._id)}>
                  Open Learning Path
                </Button>
                 <Button variant="outline" className="w-full bg-red-500" onClick={() => handleOpenPath(path._id)}>
                  Delete
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
    </div>
  )
}
