
import React, { useEffect, useState } from "react"
import { ResourceUploader } from "@/components/resource-uploader"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, FileText, Upload, Zap, BookOpen, Database } from "lucide-react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { CircularProgressIndicator } from "@/components/circular-progress-indicator"
import { ResourceList } from "@/components/resource-list"
import { toast } from "@/components/ui/use-toast"
import { IResource } from "@/models/Resource"


export function ResourcesTab({ learningPathId }: { learningPathId: string }) {
  const [resources, setResources] = useState<IResource[]>([])
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
        setResources(Array.isArray(data.resources) ? data.resources : [])
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
        toast({
          title: "Upload successful",
          description: "Your document has been uploaded and is being processed.",
        })
      } else {
        setUploadStatus("error")
        toast({
          title: "Upload failed", 
          description: "There was an error uploading your document. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setUploadStatus("error")
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      })
    }
  }
  const handleSubmitUrl = async (data: { title: string; url: string; description: string }) => {
    setUploadStatus("uploading")
    setUploadProgress(0)
    try {
      const resourceType = data.url.includes("youtube.com") || data.url.includes("youtu.be") ? "youtube" : "webpage"
      const response = await axios.post(`/api/learning-paths/${learningPathId}/resources`, {
        ...data,
        type: resourceType,
      })
      if (response.status === 200) {
        setUploadStatus("success")
        toast({
          title: "Resource added successfully",
          description: `Your ${resourceType === 'youtube' ? 'video' : 'webpage'} has been added and is being processed.`,
        })
      } else {
        setUploadStatus("error")
        toast({
          title: "Failed to add resource",
          description: "There was an error adding your resource. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error submitting URL:', error)
      setUploadStatus("error")
      toast({
        title: "Failed to add resource",
        description: "There was an error adding your resource. Please check the URL and try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const response = await axios.delete(`/api/resources/${resourceId}`)
      
      if (response.status === 200) {
        setResources(prevResources => 
          prevResources.filter(resource => resource._id !== resourceId)
        )
        toast({
          title: "Resource deleted",
          description: "The resource has been deleted successfully.",
        })
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-slate-50/20 via-blue-50/10 to-indigo-50/10 dark:from-slate-950/20 dark:via-blue-950/10 dark:to-indigo-950/10">
   
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600/50 via-teal-600/50 to-cyan-600/50 backdrop-blur-xl p-8 text-white shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md transition-transform duration-300 hover:scale-110">
                  <Database className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-100 to-cyan-100 bg-clip-text text-transparent">Learning Resources</h1>
                  <p className="text-emerald-100/90 text-lg font-medium mt-1">Your knowledge repository</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-md hover:shadow-md transition-all duration-300">
                  <FileText className="h-5 w-5 text-emerald-100" />
                  <span className="text-sm font-semibold text-emerald-100">{resources.length} Total Resources</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleAddResources} 
                size="lg"
                className="bg-gradient-to-r from-emerald-700/80 to-cyan-700/80 hover:from-emerald-800/80 hover:to-cyan-800/80 text-white border border-white/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-6 w-6 mr-2" /> 
                Add Resources
              </Button>
              <p className="text-emerald-100/80 text-xs font-medium text-center">PDFs, DOCX</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full animate-pulse backdrop-blur-md"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-emerald-600/50 to-cyan-600/50 backdrop-blur-lg rounded-full flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold mb-2 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Loading Resources</h3>
            <p className="text-slate-600 dark:text-slate-300">Fetching your learning materials...</p>
            <CircularProgressIndicator value={70} />
          </div>
        )}

        {/* Uploader State */}
        {showUploader && !isLoading && (
          <Card className="border-0 shadow-2xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-md p-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-600/50 to-cyan-600/50 backdrop-blur-lg rounded-2xl shadow-lg transition-transform duration-300 hover:scale-110">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">Add New Resource</CardTitle>
                  <CardDescription className="text-base text-emerald-600 dark:text-emerald-300 mt-1">Upload documents</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <ResourceUploader
                learningPathId={learningPathId}
                onCancel={handleUploaderCancel}
                onSuccess={handleResourcesAdded}
                onUploadFile={handleUploadFile}
                uploadProgress={uploadProgress}
                uploadStatus={uploadStatus}
              />
            </CardContent>
          </Card>
        )}

        {/* Resources List */}
        {!showUploader && !isLoading && (
          <div className="space-y-6">
            <ResourceList
              resources={resources} 
              learningPathId={learningPathId} 
              onResourceDelete={handleDeleteResource} 
            />
          </div>
        )}
      </div>
    </div>
  )
}
