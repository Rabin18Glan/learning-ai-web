"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LearningPathCard } from "@/components/learning-path-card"
import { QuizCard } from "@/components/quiz-card"
import { BookOpen, Brain, GraduationCap, Clock, Award, Plus } from "lucide-react"

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("paths")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Learning</h2>
        <div className="flex items-center gap-2">
          <Button>Create Learning Path</Button>
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
                <p className="text-sm font-medium text-muted-foreground">Completed Topics</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quiz Score</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                <Brain className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3">
                <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="paths" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <LearningPathCard
              title="Physics Fundamentals"
              description="Master the core concepts of physics from mechanics to quantum physics"
              progress={65}
              totalTopics={12}
              completedTopics={8}
              image="/placeholder.svg?height=200&width=400"
              tags={["Physics", "Science"]}
            />
            <LearningPathCard
              title="Advanced Mathematics"
              description="Explore calculus, linear algebra, and differential equations"
              progress={30}
              totalTopics={15}
              completedTopics={4}
              image="/placeholder.svg?height=200&width=400"
              tags={["Mathematics", "Calculus"]}
            />
            <LearningPathCard
              title="Computer Science Basics"
              description="Learn programming, algorithms, and data structures"
              progress={10}
              totalTopics={10}
              completedTopics={1}
              image="/placeholder.svg?height=200&width=400"
              tags={["Computer Science", "Programming"]}
            />
            <Card className="flex flex-col items-center justify-center p-6 h-full border-dashed border-2 border-muted-foreground/20">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Learning Path</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Customize your learning journey with a new path
              </p>
              <Button>Get Started</Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your learning activity over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-t p-6">
              <p className="text-muted-foreground">Activity chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <QuizCard
              title="Physics Fundamentals Quiz"
              description="Test your knowledge of basic physics concepts"
              questions={10}
              timeLimit="15 minutes"
              difficulty="Intermediate"
              completed={true}
              score={85}
            />
            <QuizCard
              title="Calculus Concepts"
              description="Test your understanding of derivatives and integrals"
              questions={15}
              timeLimit="20 minutes"
              difficulty="Advanced"
              completed={false}
            />
            <QuizCard
              title="Programming Basics"
              description="Test your knowledge of programming fundamentals"
              questions={12}
              timeLimit="15 minutes"
              difficulty="Beginner"
              completed={false}
            />
            <Card className="flex flex-col items-center justify-center p-6 h-full border-dashed border-2 border-muted-foreground/20">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Quiz</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Generate a quiz from your learning materials
              </p>
              <Button>Create Quiz</Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
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
                    <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-medium text-center">Physics Pro</h3>
                  <p className="text-xs text-center text-muted-foreground mt-1">Completed the Physics learning path</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
