import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, FileText, MessageSquare, Network } from "lucide-react"
import { useMeta } from "../hooks/useMeta"

interface LearningPathMetaProps {
  learningPathId: string
}

export function OverviewTab({ learningPathId }: LearningPathMetaProps) {
const {isLoading,meta} = useMeta(learningPathId);
 console.log("hello"+meta)
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Your learning journey progress</CardDescription>
          </CardHeader>
          <CardContent className="h-[200px] w-full">
    
                     <LineChart
                                   data={[
                                     { name: "W1", value: 4 },
                                     { name: "W2", value: 5 },
                                     { name: "W3", value: 8.1 },
                                     { name: "W4", value: 5.7 },
                                       { name: "W5", value: 4 },
                                     { name: "W6", value: 5 },
                                     { name: "W7", value: 8.1 },
                                     { name: "W8", value: 5.7 },
                                       { name: "W9", value: 4 },
                                     { name: "W10", value: 5 },
                                     { name: "W11", value: 8.1 },
                                     { name: "W12", value: 5.7 },
                                       { name: "W13", value: 4 },
                                     { name: "W14", value: 5 },
                                     { name: "W15", value: 8.1 },
                                     { name: "W16", value: 5.7 },
                                       { name: "W17", value: 4 }
                                   ]}
                                   index="name"
                                   categories={["value"]}
                                   colors={["blue"]}
                                   valueFormatter={(value) => `${value} hrs`}
                                   showLegend={false}
                                   showGridLines={true}
                                   startEndOnly={false}
                                   showXAxis={true}
                                   showYAxis={true}
                                 />
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
                <span className="font-medium">{meta.numberOfResources}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <span className="font-medium">{meta.numberOfTaskCompleted }</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <span className="font-medium">{meta.numberOfTaskRemained}</span>
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
          <CardDescription>Summary of your learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          {!meta.summary? (
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
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
            {meta.summary}
            </div>
            
          )}
        </CardContent>
      </Card>
    </div>
  )
}
