
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TabsContent } from "@/components/ui/tabs"
import { ArrowRight, Award, BarChart2, BookOpen, Brain, MessageSquare } from "lucide-react"
import Link from "next/link"

function OverviewTab() {
  return (
     <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Learning Paths</CardTitle>
                <CardDescription>Your recently accessed learning paths</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Physics Fundamentals</p>
                      <p className="text-sm text-muted-foreground">Last accessed 2 hours ago</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      65% Complete
                    </Badge>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Advanced Mathematics</p>
                      <p className="text-sm text-muted-foreground">Last accessed yesterday</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    >
                      30% Complete
                    </Badge>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Computer Science Basics</p>
                      <p className="text-sm text-muted-foreground">Last accessed 3 days ago</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      10% Complete
                    </Badge>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/learnings">
                  <Button variant="ghost" className="gap-1">
                    View All Learning Paths
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Chat Sessions</CardTitle>
                <CardDescription>Your recent conversations with AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">Quantum Physics Discussion</p>
                      <p className="text-sm text-muted-foreground">2 hours ago • Physics Fundamentals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                      <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium">Calculus Problem Solving</p>
                      <p className="text-sm text-muted-foreground">Yesterday • Advanced Mathematics</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-2">
                      <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Algorithm Complexity</p>
                      <p className="text-sm text-muted-foreground">3 days ago • Computer Science Basics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/learnings">
                  <Button variant="ghost" className="gap-1">
                    View All Chat Sessions
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>Badges and rewards you've earned through learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center p-4 border rounded-lg bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-4 mb-3">
                    <Award className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-medium text-center">Quick Learner</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Completed 5 topics in one day</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 mb-3">
                    <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-center">Quiz Master</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Scored 90% or higher on 3 quizzes</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg bg-gradient-to-b from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-4 mb-3">
                    <BookOpen className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-medium text-center">Dedicated Scholar</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Studied for 10 consecutive days</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-lg bg-gradient-to-b from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-4 mb-3">
                    <BarChart2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-medium text-center">Analytics Pro</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">
                    Reviewed learning analytics for 5 weeks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default OverviewTab