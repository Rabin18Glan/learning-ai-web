"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  accept: string
  onFileSelect: (file: File) => void
  selectedFile?: File | null
  error?: string
}

export function FileUploader({ accept, onFileSelect, selectedFile, error }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!acceptedTypes.includes(fileExtension)) {
      alert(`File type not supported. Please select: ${accept}`)
      return false
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 50MB.')
      return false
    }
    
    return true
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const removeFile = () => {
    onFileSelect(null as any)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragging 
            ? "border-primary bg-primary/5 scale-105" 
            : error 
              ? "border-red-300 bg-red-50 dark:bg-red-950/20" 
              : "border-muted-foreground/20 hover:border-muted-foreground/40"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`rounded-full p-4 ${
            error ? "bg-red-100 dark:bg-red-900/20" : "bg-primary/10"
          }`}>
            <Upload className={`h-8 w-8 ${
              error ? "text-red-500" : "text-primary"
            }`} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Drag & Drop File</h3>
            <p className="text-sm text-muted-foreground">or click to browse files</p>
            <p className="text-xs text-muted-foreground">Supported formats: {accept.replace(/\./g, '').toUpperCase()}</p>
            <p className="text-xs text-muted-foreground">Maximum size: 50MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileChange}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="outline" className="mt-2" asChild>
              <span>Select File</span>
            </Button>
          </label>
        </div>
      </Card>

      {selectedFile && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-4 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">{selectedFile.name}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <Button 
              onClick={removeFile} 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
