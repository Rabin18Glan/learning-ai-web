import React, { useEffect, useState } from "react"
import { ResourceList } from "@/components/resource-list"
import { ResourceUploader } from "@/components/resource-uploader"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export interface Resource {
  _id: string
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: number
  status: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  learningPathId: string
  tags: string[]
  viewCount: number
  __v: number
}

export function ResourcesTab({ learningPathId }: { learningPathId: string }) {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      try {
        console.log(learningPathId)
        const res = await fetch(`/api/learning-paths/${learningPathId}/resources`)
        if (!res.ok) throw new Error("Failed to fetch resources")

        const data = await res.json()
        console.log(data)
        setResources(Array.isArray(data.resources) ? data.resources : []) // Use data.resources if present
      } catch (e) {
        console.log(e)
        setResources([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [learningPathId])

  const handleAddResources = () => setShowUploader(true)
  const handleUploaderCancel = () => {
    setShowUploader(false)
    setUploadStatus("idle")
    setUploadProgress(0)
  }
  const handleResourcesAdded = async () => {
    setShowUploader(false)
    setUploadStatus("idle")
    setUploadProgress(0)
    // Refresh resources
    const res = await fetch(`/api/learning-paths/${learningPathId}/resources`)
    if (res.ok) {
      const data = await res.json()
      setResources(Array.isArray(data.resources) ? data.resources : [])
    }
  }
  const handleUploadFile = async (file: File, title: string, description: string) => {
    setUploadStatus("uploading")
    setUploadProgress(0)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title)
      formData.append("description", description)
      const response = await axios.post(`/api/learning-paths/${learningPathId}/resources`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })
      if (response.status === 200) {
        setUploadStatus("success")
      } else {
        setUploadStatus("error")
      }
    } catch (error) {
      setUploadStatus("error")
    }
  }
  const handleSubmitUrl = async (data: { title: string; url: string; description: string }) => {
    setUploadStatus("uploading")
    setUploadProgress(0)
    try {
      const response = await axios.post(`/api/learning-paths/${learningPathId}/resources`, {
        ...data,
        type: data.url.includes("youtube.com") ? "youtube" : "webpage",
      })
      if (response.status === 200) {
        setUploadStatus("success")
      } else {
        setUploadStatus("error")
      }
    } catch (error) {
      setUploadStatus("error")
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Learning Resources</CardTitle>
          <CardDescription>Add and manage resources for this learning path</CardDescription>
        </div>
        <Button onClick={handleAddResources} className="gap-2">
          <Plus className="h-4 w-4" /> Add Resources
        </Button>
      </CardHeader>
      <CardContent>
        {showUploader ? (
          <ResourceUploader
            learningPathId={learningPathId}
            onCancel={handleUploaderCancel}
            onSuccess={handleResourcesAdded}
            onUploadFile={handleUploadFile}
            onSubmitUrl={handleSubmitUrl}
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
          />
        ) : (
          <ResourceList resources={resources} learningPathId={learningPathId} />
        )}
      </CardContent>
    </Card>
  )
}
