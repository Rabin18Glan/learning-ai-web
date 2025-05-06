"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { Calendar } from "@/components/ui/calendar"
import { BarChart2, LineChartIcon, PieChartIcon, Download, CalendarIcon } from "lucide-react"

export default function AnalyticsPage() {
  const currentDate = new Date()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Learning Time</p>
              <p className="text-3xl font-bold">24.5 hrs</p>
              <p className="text-xs text-green-600 dark:text-green-400">↑ 12% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Topics Completed</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-green-600 dark:text-green-400">↑ 4 more than last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Quiz Score</p>
              <p className="text-3xl font-bold">85%</p>
              <p className="text-xs text-green-600 dark:text-green-400">↑ 5% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Documents Analyzed</p>
              <p className="text-3xl font-bold">18</p>
              <p className="text-xs text-green-600 dark:text-green-400">↑ 3 more than last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Activity</CardTitle>
              <CardDescription>Your learning hours over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <LineChart
                  data={[
                    { name: "Week 1", value: 4.5 },
                    { name: "Week 2", value: 6.2 },
                    { name: "Week 3", value: 8.1 },
                    { name: "Week 4", value: 5.7 },
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
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
                <CardDescription>Time spent on different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart
                    data={[
                      { name: "Physics", value: 42 },
                      { name: "Mathematics", value: 28 },
                      { name: "Computer Science", value: 15 },
                      { name: "Chemistry", value: 10 },
                      { name: "Other", value: 5 },
                    ]}
                    index="name"
                    categories={["value"]}
                    colors={["blue", "violet", "emerald", "amber", "slate"]}
                    valueFormatter={(value) => `${value}%`}
                    showAnimation={true}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Your scores across different subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    data={[
                      { subject: "Physics", score: 85 },
                      { subject: "Mathematics", score: 78 },
                      { subject: "Computer Science", score: 92 },
                      { subject: "Chemistry", score: 70 },
                    ]}
                    index="subject"
                    categories={["score"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}%`}
                    showLegend={false}
                    showGridLines={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress by Path</CardTitle>
              <CardDescription>Completion percentage for each learning path</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <BarChart
                  data={[
                    { path: "Physics Fundamentals", progress: 65 },
                    { path: "Advanced Mathematics", progress: 30 },
                    { path: "Computer Science Basics", progress: 10 },
                    { path: "Chemistry Concepts", progress: 45 },
                    { path: "Biology Essentials", progress: 20 },
                  ]}
                  index="path"
                  categories={["progress"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={false}
                  layout="vertical"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Engagement</CardTitle>
              <CardDescription>Time spent on different topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <PieChart
                  data={[
                    { name: "Quantum Physics", value: 18 },
                    { name: "Calculus", value: 15 },
                    { name: "Algorithms", value: 12 },
                    { name: "Organic Chemistry", value: 10 },
                    { name: "Cell Biology", value: 8 },
                    { name: "World History", value: 7 },
                    { name: "Other Topics", value: 30 },
                  ]}
                  index="name"
                  categories={["value"]}
                  colors={["blue", "indigo", "violet", "purple", "fuchsia", "pink", "slate"]}
                  valueFormatter={(value) => `${value}%`}
                  showAnimation={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Learning Calendar</CardTitle>
              <CardDescription>Your study activity calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <Calendar mode="single" selected={currentDate} className="rounded-md border" />
                <p className="text-sm text-muted-foreground">Select a date to view detailed learning activity</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
