
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Check, Target, BarChart, Trophy } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  status: "pending" | "in-progress" | "completed";
  resourceId?: string;
  parentTaskId?: string | null;
}

interface ProgressTrackerProps {
  learningPathId: string;
}

export function ProgressTracker({ learningPathId }: ProgressTrackerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({});
  const [subtaskOpen, setSubtaskOpen] = useState<Record<string, boolean>>({});

  const overallProgress =
    tasks.length > 0
      ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
      : 0;

  // Fetch tasks
  useEffect(() => {
    async function fetchTasks() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/learning-paths/${learningPathId}/tasks`);
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTasks();
  }, [learningPathId]);

  // Toggle task completion
  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await fetch(`/api/learning-paths/${learningPathId}/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  // Add new main task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle }),
      });
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTaskTitle("");
      setShowAddTask(false);
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  // Add new subtask
  const handleAddSubtask = async (parentId: string) => {
    const title = subtaskInputs[parentId]?.trim();
    if (!title) return;
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/tasks/${parentId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      setTasks((prev) => [...prev, data.subtask]);
      setSubtaskInputs((prev) => ({ ...prev, [parentId]: "" }));
      setSubtaskOpen((prev) => ({ ...prev, [parentId]: false }));
    } catch (err) {
      console.error("Error adding subtask", err);
    }
  };

  // Build tree: main tasks + subtasks
  const mainTasks = tasks.filter((t) => !t.parentTaskId);
  const subtasks = (parentId: string) => tasks.filter((t) => t.parentTaskId === parentId);

  if (isLoading) {
    return (
      <div className="space-y-8 p-4">
        {/* Loading Skeleton for Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="shadow-md border border-border">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
        </div>
        {/* Loading Skeleton for Tasks */}
        <div className="space-y-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-2 p-3 border rounded-md">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 max-w-4xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-foreground">
              <BarChart className="h-6 w-6 mr-2 text-blue-500" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm mb-3 text-muted-foreground">
              <span>Completion</span>
              <span className="font-medium">{overallProgress}%</span>
            </div>
            <Progress
              value={overallProgress}
              className="h-3 rounded-full"

            />
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-foreground">
              <Check className="h-6 w-6 mr-2 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {tasks.filter((t) => t.status === "completed").length}/{tasks.length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-border bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold text-foreground">
              <Target className="h-6 w-6 mr-2 text-indigo-500" />
              Milestone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overallProgress === 100 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center text-green-600 font-semibold"
              >
                <Trophy className="h-5 w-5 mr-2" />
                Goal Achieved
              </motion.div>
            ) : (
              <p className="text-sm text-muted-foreground">Keep going, you’re making progress!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tasks & Subtasks */}
      <Tabs defaultValue="tasks" className="bg-transparent">
        <TabsList className="bg-muted/50 rounded-lg">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-foreground">Your Tasks</h3>
            <Button
              size="sm"
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </div>

          {/* Add Main Task */}
          <AnimatePresence>
            {showAddTask && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex gap-3 mb-4"
              >
                <Input
                  placeholder="Enter task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="border-border focus:ring-2 focus:ring-primary"
                />
                <Button
                  onClick={handleAddTask}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                  className="border-border hover:bg-muted/50"
                >
                  Cancel
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Tasks */}
          <div className="space-y-4">
            {mainTasks.length === 0 && !showAddTask ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <p>No tasks yet. Start by adding a task above!</p>
              </motion.div>
            ) : (
              mainTasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-gradient-to-r from-background to-muted/10 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={() => handleToggleTask(task)}
                      className="h-5 w-5 border-border data-[state=checked]:bg-primary"
                    />
                    <Label
                      className={`flex-1 cursor-pointer text-base ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setSubtaskOpen((prev) => ({ ...prev, [task._id]: !prev[task._id] }))
                      }
                      className="hover:bg-muted/50 transition-colors duration-200"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Subtask
                    </Button>
                  </div>

                  {/* Subtasks */}
                  <div className="ml-8 space-y-2 mt-2">
                    {subtasks(task._id).map((st) => (
                      <motion.div
                        key={st._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 p-3 border rounded-md bg-background shadow-sm"
                      >
                        <Checkbox
                          checked={st.status === "completed"}
                          onCheckedChange={() => handleToggleTask(st)}
                          className="h-5 w-5 border-border data-[state=checked]:bg-primary"
                        />
                        <Label
                          className={`flex-1 cursor-pointer text-sm ${
                            st.status === "completed"
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {st.title}
                        </Label>
                      </motion.div>
                    ))}

                    {/* Add Subtask */}
                    <AnimatePresence>
                      {subtaskOpen[task._id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-3 mt-2"
                        >
                          <Input
                            placeholder="Enter subtask title..."
                            value={subtaskInputs[task._id] || ""}
                            onChange={(e) =>
                              setSubtaskInputs((prev) => ({
                                ...prev,
                                [task._id]: e.target.value,
                              }))
                            }
                            className="border-border focus:ring-2 focus:ring-primary"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddSubtask(task._id)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Add
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
