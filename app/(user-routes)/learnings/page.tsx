
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, BookOpen, Tag } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Debounce utility for search input
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLearningPaths = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/learning-paths`)
        if (!response.ok) {
          throw new Error("Failed to fetch learning paths")
        }
        const data = await response.json()
        setLearningPaths(data.learningPaths || [])
      } catch (error) {
        console.error("Error fetching learning paths:", error)
        setError("Failed to load learning paths. Please try again later.")
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

  const handleDeletePath = (id: string) => {
    if (confirm("Are you sure you want to delete this learning path?")) {
      console.log(`Delete learning path with ID: ${id}`)
      // Implement actual delete logic here when ready
    }
  }

  // Debounced search handler
  const debouncedSetSearchQuery = useCallback(
    debounce((value: string) => setSearchQuery(value), 300),
    []
  )

  // Memoized filtered and sorted paths
  const filteredPaths = useMemo(() => {
    return searchQuery
      ? learningPaths.filter(
          (path) =>
            path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            path.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : learningPaths
  }, [searchQuery, learningPaths])

  const sortedPaths = useMemo(() => {
    return [...filteredPaths].sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "progress") {
        return (b.progress || 0) - (a.progress || 0)
      }
      return 0
    })
  }, [filteredPaths, sortBy])

  return (
    <div className="container py-12 font-['Inter']">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
      `}</style>

      {error && (
        <Alert variant="destructive" className="mb-6 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
  <div className="fixed inset-0 bg-[url('https://img.freepik.com/free-vector/flat-background-world-teacher-s-day-celebration_23-2150722546.jpg?semt=ais_incoming&w=740&q=80')] bg-cover bg-center -z-10" />
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Learning Paths</h1>
            <p className="text-text-gray-300 mt-2 text-lg">Create and explore personalized learning journeys</p>
          </div>
          <Button
            onClick={handleCreatePath}
            className="text-gray-800 bg-white/10 backdrop-blur-md border border-gray-200/30 hover:bg-white/20 hover:shadow-md transition-all duration-300 gap-2 font-medium "
          >
            <Plus className="h-4 w-4" />
            Create Learning Path
          </Button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray-300 h-5 w-5" />
            <Input
              placeholder="Search learning paths..."
              className="pl-10 bg-white/10 backdrop-blur-md border-none text-foreground placeholder-text-gray-300 focus:ring-2 focus:ring-white/50 rounded-lg"
              value={searchQuery}
              onChange={(e) => debouncedSetSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-white/10 backdrop-blur-md border-none text-foreground focus:ring-2 focus:ring-white/50 rounded-lg">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white/10 backdrop-blur-lg border border-white/20 text-foreground rounded-lg">
              <SelectItem value="recent">Recently Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="bg-white/5 backdrop-blur-lg border border-white/15 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              <Skeleton className="h-40 w-full animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
                <Skeleton className="h-4 w-full animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-6 w-16 animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
                  <Skeleton className="h-6 w-16 animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedPaths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPaths.map((path) => (
            <Card
              key={path._id}
              className="bg-white/5 backdrop-blur-lg border border-white/15 shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300"
            >
              {path.coverImage && (
                <img
                  src={path.coverImage}
                  alt={path.title}
                  className="h-40 w-full object-cover rounded-t-lg"
                />
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold text-foreground">{path.title}</CardTitle>
                <p className="text-sm text-text-gray-300 line-clamp-2">{path.description}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex flex-wrap gap-2 mt-2">
                  {path.tags.slice(0, 3).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-text-gray-300 flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                  {path.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="bg-white/10 backdrop-blur-md border border-white/20 text-text-gray-300"
                    >
                      +{path.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                {path.progress !== undefined && (
                  <p className="text-sm text-text-gray-300 mt-3">Progress: {path.progress}%</p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:shadow-md transition-all duration-300 w-full text-foreground"
                  onClick={() => handleOpenPath(path._id)}
                >
                  Open Learning Path
                </Button>
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border border-red-600 text-red-600 hover:bg-red-100 hover:text-red-600 transition-all duration-300 w-full"
                  onClick={() => handleDeletePath(path._id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-medium text-foreground mb-2">No learning paths found</h3>
          <p className="text-text-gray-300 mb-6">
            {searchQuery
              ? "No learning paths match your search criteria"
              : "You haven't created any learning paths yet"}
          </p>
          <Button
            onClick={handleCreatePath}
            className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 hover:shadow-md transition-all duration-300 text-foreground"
          >
            Create Your First Learning Path
          </Button>
        </div>
      )}
    </div>
  )
}