"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { FileUploader } from "./file-uploader"

interface ResourceUploaderProps {
  learningPathId: string
  onCancel: () => void
  onSuccess: () => void
  onUploadFile: (file: File, title: string, description: string) => Promise<void>
  uploadProgress: number
  uploadStatus: "idle" | "uploading" | "success" | "error"
}

export function ResourceUploader({
  learningPathId,
  onCancel,
  onSuccess,
  onUploadFile,
  uploadProgress,
  uploadStatus,
}: ResourceUploaderProps) {
  const [resourceTitle, setResourceTitle] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!resourceTitle.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!selectedFile) {
      newErrors.file = "Please select a file to upload"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDocumentUpload = async () => {
    if (!validateForm() || !selectedFile) return
    
    setIsProcessing(true)
    try {
      await onUploadFile(selectedFile, resourceTitle.trim(), resourceDescription.trim())
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = () => {
    // Reset form state
    setResourceTitle("")
    setResourceDescription("")
    setSelectedFile(null)
    setErrors({})
    setIsProcessing(false)
    onSuccess()
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setErrors(prev => ({ ...prev, file: "" }))
  }

  const handleTitleChange = (value: string) => {
    setResourceTitle(value)
    setErrors(prev => ({ ...prev, title: "" }))
  }

  // Clear selected file on successful upload
  useEffect(() => {
    if (uploadStatus === "success") {
      setSelectedFile(null)
    }
  }, [uploadStatus])

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="document-title" className="text-sm font-medium">
            Document Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="document-title"
            placeholder="Enter a title for your document"
            value={resourceTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={errors.title ? "border-red-500 focus:border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.title}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="document-description" className="text-sm font-medium">Description (Optional)</Label>
          <Textarea
            id="document-description"
            placeholder="Enter a description for your document"
            value={resourceDescription}
            onChange={(e) => setResourceDescription(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="space-y-2">
          <FileUploader 
            accept=".pdf,.docx,.txt" 
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            error={errors.file}
          />
          {errors.file && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.file}
            </p>
          )}
        </div>
        <Button 
          onClick={handleDocumentUpload} 
          disabled={isProcessing || uploadStatus === "uploading"}
          className="w-full"
        >
          {isProcessing || uploadStatus === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Document"
          )}
        </Button>
      </div>

      {uploadStatus === "uploading" && (
        <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-blue-700 dark:text-blue-300">Uploading...</span>
            <span className="text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-blue-600 dark:text-blue-400">Please wait while we process your resource...</p>
        </div>
      )}

      {uploadStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-400">Upload Complete</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-500">
            Your resource has been uploaded successfully and is ready to use.
          </AlertDescription>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-400">Upload Failed</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-500">
            There was an error uploading your resource. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing || uploadStatus === "uploading"}
          className="px-6"
        >
          Cancel
        </Button>
        {uploadStatus === "success" && (
          <Button 
            onClick={handleComplete}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete
          </Button>
        )}
      </div>
    </div>
  )
}