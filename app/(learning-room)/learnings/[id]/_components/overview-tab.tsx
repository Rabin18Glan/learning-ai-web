import React, { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { User, FileText, MessageSquare, Network, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LearningPathMetaProps {
  learningPathId: string
}

export function OverviewTab({ learningPathId }: LearningPathMetaProps) {
  const [meta, setMeta] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/learning-paths/${learningPathId}`)
        if (!res.ok) throw new Error("Failed to fetch learning path meta")
        const data = await res.json()
        setMeta(data)
      } catch (e) {
        setMeta(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeta()
  }, [learningPathId])

  if (isLoading || !meta) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-32 w-full mb-4" />
      </div>
    )
  }

  // UI from the original main page overview tab
  return (
    <div className="space-y-6">
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
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (meta.progress || 0) / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{meta.progress || 0}%</span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {meta.progress === 100
                  ? "Completed! 🎉"
                  : meta.progress === 0
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
                <span className="font-medium">{meta.resourcesCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="font-medium">{meta.completedCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <span className="font-medium">{meta.inProgressCount ?? 0}</span>
              </div>
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
          {meta.resourcesCount === 0 ? (
            <div className="text-center py-6">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-base font-medium mb-2">No resources yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add some resources to generate a summary of your learning path
              </p>
              <Button size="sm">
                Add Resources
              </Button>
            </div>
          ) : !meta.vectorStoreId ? (
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
    </div>
  )
}
