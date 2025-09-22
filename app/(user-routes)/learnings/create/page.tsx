"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tag, Loader2, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CreateLearningPathPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTag = useCallback(() => {
    const newTag = tagInput.trim()
    if (newTag && !tags.includes(newTag)) {
      setTags((prev) => [...prev, newTag])
      setTagInput("")
    }
  }, [tagInput, tags])

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await axios.post("/api/learning-paths", { title, description, tags })
      const data = res.data
      toast({
        title: "Learning Path Created!",
        description: `"${data.title}" has been created.`,
      })
      router.push(`/learnings/${data._id}`)
    } catch {
      toast({
        title: "Error",
        description: "Could not create learning path.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-950 dark:to-black py-12 px-4 font-['Inter']">
      <Card className="w-full max-w-2xl bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-6 transition-all duration-300">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
            Create a New Learning Path
          </CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-400">
            Organize your journey by adding a title, description, and tags.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Introduction to Machine Learning"
                required
                className="text-base px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this learning path covers..."
                rows={4}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm animate-fadeIn"
                  >
                    <Tag className="h-4 w-4 mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (["Enter", "Tab", ","].includes(e.key)) {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Learning Path"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
