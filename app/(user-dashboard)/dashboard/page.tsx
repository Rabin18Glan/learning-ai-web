"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Brain, Award, ArrowRight, BarChart2, FileText, MessageSquare } from "lucide-react"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/learnings/create">
            <Button>Create Learning Path</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Learning Time</p>
                <p className="text-2xl font-bold">24.5 hrs</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Learning Paths</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chat Sessions</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3">
                <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
        </TabsList>

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

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center border-t p-6">
              <p className="text-muted-foreground">Activity chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress across all learning paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Physics Fundamentals</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        8/12 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">65%</span>
                    </div>
                  </div>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Advanced Mathematics</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400"
                      >
                        4/15 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                  </div>
                </div>
                <Progress value={30} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Computer Science Basics</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                      >
                        1/10 Topics
                      </Badge>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                  </div>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
