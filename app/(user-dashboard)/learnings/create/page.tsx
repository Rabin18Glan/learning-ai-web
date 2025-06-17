"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CreateLearningPathPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post("/api/learning-paths", { title, description, tags })
      const data = res.data
      toast({ title: "Learning Path Created!", description: `"${data.title}" has been created.`, variant: "default" })
      router.push(`/learnings/${data._id}`)
    } catch (err) {
      toast({ title: "Error", description: "Could not create learning path.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
      <Card className="w-full max-w-xl shadow-xl border-0 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-700 dark:text-blue-300">Create a New Learning Path</CardTitle>
          <CardDescription className="mt-2 text-gray-600 dark:text-gray-300">
            Organize your learning journey by creating a new path. Add a title, description, and tags to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Machine Learning"
                required
                className="text-lg px-4 py-2 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this learning path covers..."
                rows={4}
                className="px-4 py-2 border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-xs font-semibold">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-400 hover:text-red-500 focus:outline-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Add a tag and press Enter"
                  className="flex-1 border-blue-200 dark:border-blue-800"
                />
                <Button type="button" variant="secondary" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-lg font-semibold shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Learning Path"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}