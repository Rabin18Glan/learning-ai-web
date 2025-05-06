"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File } from "lucide-react"

export function FileUpload() {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }

  return (
    <Card
      className={`border-2 border-dashed p-6 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Drag & Drop Files</h3>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
        <input type="file" className="hidden" id="file-upload" accept=".pdf,.docx,.txt,.jpg,.jpeg,.png" multiple />
        <label htmlFor="file-upload">
          <Button variant="outline" className="mt-2" asChild>
            <span>Select Files</span>
          </Button>
        </label>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Button variant="link" className="text-primary" onClick={() => router.push("/upload")}>
          <File className="mr-2 h-4 w-4" />
          Go to Upload Page
        </Button>
      </div>
    </Card>
  )
}
