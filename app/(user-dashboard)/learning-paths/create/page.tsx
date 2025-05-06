"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TagInput } from "@/components/tag-input"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, BookOpen, Save } from "lucide-react"

export default function CreateLearningPathPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    isPublic: false,
    coverImage: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/learning-paths", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create learning path")
      }

      const data = await response.json()
      toast({
        title: "Learning path created",
        description: "Your learning path has been created successfully.",
      })
      router.push(`/learning-paths/${data._id}`)
    } catch (error) {
      console.error("Error creating learning path:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create learning path",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Learning Path</h1>
          <p className="text-muted-foreground mt-1">
            Create a new learning path to organize your educational resources
          </p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              New Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a title for your learning path"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this learning path is about"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagInput
                id="tags"
                placeholder="Add tags and press Enter"
                tags={formData.tags}
                setTags={handleTagsChange}
              />
              <p className="text-xs text-muted-foreground">Tags help others discover your learning path</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
              <Input
                id="coverImage"
                name="coverImage"
                placeholder="Enter a URL for the cover image"
                value={formData.coverImage}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="isPublic">Make this learning path public</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Learning Path"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
