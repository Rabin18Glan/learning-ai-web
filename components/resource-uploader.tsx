"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { FileUploader } from "@/components/file-uploader"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, FileText, Globe, Youtube } from "lucide-react"

interface ResourceUploaderProps {
  learningPathId: string
  onCancel: () => void
  onSuccess: () => void
}

export function ResourceUploader({ learningPathId, onCancel, onSuccess }: ResourceUploaderProps) {
  const [activeTab, setActiveTab] = useState("document")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")

  const simulateUpload = () => {
    setUploadStatus("uploading")
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus("success")
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const handleDocumentUpload = async (file: File) => {
    simulateUpload()
    // In a real implementation, this would upload the file to a server
  }

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceUrl) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      // Simulate API call
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setUploadStatus("success")
            return 100
          }
          return prev + 10
        })
      }, 200)

      // In a real implementation, this would send the URL to a server for processing
    } catch (error) {
      console.error("Error processing URL:", error)
      setUploadStatus("error")
      toast({
        title: "Error",
        description: "Failed to process URL. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleComplete = () => {
    onSuccess()
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="document" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Document
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-2">
            <Youtube className="h-4 w-4" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="webpage" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Web Page
          </TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="document-title">Document Title</Label>
            <Input
              id="document-title"
              placeholder="Enter a title for your document"
              value={resourceTitle}
              onChange={(e) => setResourceTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Textarea
              id="document-description"
              placeholder="Enter a description for your document"
              value={resourceDescription}
              onChange={(e) => setResourceDescription(e.target.value)}
              rows={3}
            />
          </div>
          <FileUploader accept=".pdf,.docx,.txt" onUpload={handleDocumentUpload} />
        </TabsContent>

        <TabsContent value="youtube" className="space-y-4 pt-4">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-title">Video Title</Label>
              <Input
                id="youtube-title"
                placeholder="Enter a title for the video"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-description">Description (Optional)</Label>
              <Textarea
                id="youtube-description"
                placeholder="Enter a description for the video"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              Process YouTube Video
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="webpage" className="space-y-4 pt-4">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webpage-title">Web Page Title</Label>
              <Input
                id="webpage-title"
                placeholder="Enter a title for the web page"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webpage-url">Web Page URL</Label>
              <Input
                id="webpage-url"
                placeholder="https://example.com/article"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webpage-description">Description (Optional)</Label>
              <Textarea
                id="webpage-description"
                placeholder="Enter a description for the web page"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full">
              Process Web Page
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {uploadStatus === "uploading" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {uploadStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">Upload Complete</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-500">
            Your resource has been uploaded successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleComplete} disabled={uploadStatus !== "success"}>
          {uploadStatus === "success" ? "Continue" : "Upload"}
        </Button>
      </div>
    </div>
  )
}
