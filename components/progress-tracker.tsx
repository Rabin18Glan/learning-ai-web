"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Check, Clock, Target, BarChart, Trophy } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Goal {
  id: string
  title: string
  targetDate: Date
  completed: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
  resourceId?: string
}

interface ProgressTrackerProps {
  learningPathId: string
}

export function ProgressTracker({ learningPathId }: ProgressTrackerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [goals, setGoals] = useState<Goal[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDate, setNewGoalDate] = useState<Date | undefined>(undefined)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showAddTask, setShowAddTask] = useState(false)

  // Mock data loading
  useEffect(() => {
    // In a real app, you would fetch progress data from an API
    const mockGoals: Goal[] = [
      {
        id: "1",
        title: "Complete Neural Networks section",
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        completed: false,
      },
      {
        id: "2",
        title: "Finish all practice exercises",
        targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        completed: false,
      },
      {
        id: "3",
        title: "Review basic concepts",
        targetDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        completed: true,
      },
    ]

    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Read Introduction to Neural Networks",
        completed: true,
        resourceId: "resource-1",
      },
      {
        id: "2",
        title: "Complete activation functions quiz",
        completed: true,
        resourceId: "resource-2",
      },
      {
        id: "3",
        title: "Watch backpropagation video",
        completed: false,
        resourceId: "resource-3",
      },
      {
        id: "4",
        title: "Implement simple neural network",
        completed: false,
      },
      {
        id: "5",
        title: "Review chapter 3 notes",
        completed: false,
      },
    ]

    setTimeout(() => {
      setGoals(mockGoals)
      setTasks(mockTasks)

      // Calculate overall progress
      const completedTasks = mockTasks.filter((task) => task.completed).length
      setOverallProgress(Math.round((completedTasks / mockTasks.length) * 100))

      setIsLoading(false)
    }, 1000)
  }, [learningPathId])

  const handleAddGoal = () => {
    if (newGoalTitle && newGoalDate) {
      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        targetDate: newGoalDate,
        completed: false,
      }

      setGoals([...goals, newGoal])
      setNewGoalTitle("")
      setNewGoalDate(undefined)
      setShowAddGoal(false)
    }
  }

  const handleAddTask = () => {
    if (newTaskTitle) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
      }

      setTasks([...tasks, newTask])
      setNewTaskTitle("")
      setShowAddTask(false)

      // Update overall progress
      const completedTasks = tasks.filter((task) => task.completed).length
      setOverallProgress(Math.round((completedTasks / (tasks.length + 1)) * 100))
    }
  }

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })

    setTasks(updatedTasks)

    // Update overall progress
    const completedTasks = updatedTasks.filter((task) => task.completed).length
    setOverallProgress(Math.round((completedTasks / updatedTasks.length) * 100))
  }

  const handleToggleGoal = (goalId: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          return { ...goal, completed: !goal.completed }
        }
        return goal
      }),
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <BarChart className="h-5 w-5 mr-2 text-blue-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tasks.filter((task) => task.completed).length}/{tasks.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.filter((task) => task.completed).length === tasks.length
                ? "All tasks completed!"
                : `${tasks.length - tasks.filter((task) => task.completed).length} tasks remaining`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Target className="h-5 w-5 mr-2 text-indigo-500" />
              Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {goals.filter((goal) => goal.completed).length}/{goals.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {goals.filter((goal) => !goal.completed).length > 0
                ? `Next goal due: ${format(
                    goals
                      .filter((goal) => !goal.completed)
                      .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())[0].targetDate,
                    "MMM d, yyyy",
                  )}`
                : "All goals achieved!"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Learning Tasks</h3>
            <Button size="sm" onClick={() => setShowAddTask(!showAddTask)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {showAddTask && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Enter new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Button onClick={handleAddTask}>Add</Button>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>
                Cancel
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => handleToggleTask(task.id)}
                />
                <Label
                  htmlFor={`task-${task.id}`}
                  className={`flex-1 cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </Label>
                {task.resourceId && (
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                    View Resource
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Learning Goals</h3>
            <Button size="sm" onClick={() => setShowAddGoal(!showAddGoal)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>

          {showAddGoal && (
            <div className="space-y-4 p-4 border rounded-md mb-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="Enter goal title..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal-date">Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" id="goal-date">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGoalDate ? format(newGoalDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={newGoalDate} onSelect={setNewGoalDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>Add Goal</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={`p-4 border rounded-md ${
                  goal.completed
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : new Date() > goal.targetDate && !goal.completed
                      ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                      : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={`goal-${goal.id}`}
                      checked={goal.completed}
                      onCheckedChange={() => handleToggleGoal(goal.id)}
                      className="mt-1"
                    />
                    <div>
                      <Label
                        htmlFor={`goal-${goal.id}`}
                        className={`text-base font-medium ${goal.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {goal.title}
                      </Label>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          Due: {format(goal.targetDate, "MMM d, yyyy")}
                          {new Date() > goal.targetDate && !goal.completed && (
                            <span className="text-red-500 dark:text-red-400 ml-2">Overdue</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {goal.completed && (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                      <Trophy className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
