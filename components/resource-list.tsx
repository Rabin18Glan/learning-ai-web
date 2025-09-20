"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { IResource } from "@/models/Resource"
import { AlertCircle, BarChart3, BookOpen, Calendar, Clock, Download, ExternalLink, Eye, FileText, Globe, Loader2, RefreshCw, Sparkles, Trash2, Youtube } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface ResourceListProps {
  resources: IResource[]
  learningPathId: string
  onResourceDelete?: (resourceId: string) => Promise<void>
}




const RESOURCE_ICONS = {
  pdf: <FileText className="h-6 w-6" />,
  youtube: <Youtube className="h-6 w-6" />,
  webpage: <Globe className="h-6 w-6" />,
} as const

const RESOURCE_GRADIENTS = {
  pdf: "bg-gradient-to-br from-blue-500 to-indigo-600",
  youtube: "bg-gradient-to-br from-red-500 to-pink-600",
  webpage: "bg-gradient-to-br from-emerald-500 to-teal-600",
} as const

const RESOURCE_COLORS = {
  pdf: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    border: "border-blue-200/50 dark:border-blue-800/50",
    text: "text-blue-700 dark:text-blue-300"
  },
} as const


interface ResourceCardProps {
  resource: IResource
  isDeleting: boolean
  onDeleteClick: (resourceId: string) => void
}

function ResourceViewer({ resource }: { resource: IResource }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&showinfo=0` : url
    }
    if (type === 'pdf') {
      // Try multiple PDF viewing strategies
      if (url.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1]
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`
        }
      }
      // Use Google Docs Viewer as fallback for PDFs
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    }
    return url
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const refreshViewer = () => {
    setIsLoading(true)
    setHasError(false)
    setIframeKey(prev => prev + 1)
  }

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [resource])

  const renderViewer = () => {
    const embedUrl = getEmbedUrl(resource.fileUrl, resource.fileType)
    console.log("Clicked here")
    if (hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
          <div className="bg-red-500 text-white p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Unable to load content</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            This content couldn't be displayed within the app. This might be due to security restrictions or the content provider's policies.
          </p>
          <div className="flex gap-3">
            <Button onClick={refreshViewer} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button asChild>
              <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Externally
              </a>
            </Button>
          </div>
        </div>
      )
    }

    return (
      <>
        <iframe
          key={iframeKey}
          src={embedUrl}
          className="w-full h-full rounded-xl border-0"
          title={resource.title}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow={resource.fileType === 'youtube' ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" : ""}
          allowFullScreen={resource.fileType === 'youtube'}
          sandbox={resource.fileType === 'webpage' ? "allow-scripts allow-same-origin allow-popups allow-forms allow-modals" : undefined}
        />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100/90 to-slate-200/90 dark:from-slate-800/90 dark:to-slate-900/90 flex items-center justify-center rounded-xl backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
              <p className="text-muted-foreground font-medium">Loading content...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <DialogContent className={`${isFullscreen ? 'max-w-[100vw] h-[100vh]' : 'max-w-6xl h-[85vh]'} p-0 overflow-hidden rounded-3xl transition-all duration-300`}>
      <div className="h-full flex flex-col">
        {/* Enhanced Header */}
        <DialogHeader className="p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-4 ${RESOURCE_GRADIENTS[resource.fileType as keyof typeof RESOURCE_GRADIENTS] || 'bg-gray-500'} rounded-2xl shadow-xl`}>
                <div className="text-white">
                  {RESOURCE_ICONS[resource.fileType as keyof typeof RESOURCE_ICONS] || <FileText className="h-6 w-6" />}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold line-clamp-2 mb-2">{resource.title}</DialogTitle>
                <DialogDescription className="text-base line-clamp-2 mb-4">
                  {resource.description || "No description available"}
                </DialogDescription>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>{resource.viewCount || 0} views</span>
                  </div>
                  {resource.fileSize && (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>{(resource.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
              {resource.fileType === 'pdf' && !hasError && (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-xl p-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshViewer}
                    className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
                    title="Refresh content"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
                  >
                    {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white/50 hover:bg-white/70 backdrop-blur-sm"
                  >
                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open External
                    </a>
                  </Button>
                </div>)}

            </div>
          </div>
        </DialogHeader>

        {/* Enhanced Content Viewer */}
        <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-2">
          <div className="h-full w-full bg-white dark:bg-slate-800 rounded-2xl shadow-inner overflow-hidden relative">
            {renderViewer()}

            {/* PDF Controls */}
            {resource.fileType === 'pdf' && !hasError && !isLoading && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="text-white hover:bg-white/20"
                  >
                    Previous
                  </Button>
                  <span className="text-sm">Page {currentPage}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="text-white hover:bg-white/20"
                  >
                    Next
                  </Button>
                </div>
              </div>

            )}
          </div>
        </div>
      </div>

    </DialogContent>
  )
}

function ResourceCard({ resource, isDeleting, onDeleteClick }: ResourceCardProps) {
  const icon = RESOURCE_ICONS[resource.fileType as keyof typeof RESOURCE_ICONS] || <FileText className="h-6 w-6" />
  const gradient = RESOURCE_GRADIENTS[resource.fileType as keyof typeof RESOURCE_GRADIENTS] || 'bg-gray-500'
  const colors = RESOURCE_COLORS[resource.fileType as keyof typeof RESOURCE_COLORS] || RESOURCE_COLORS.pdf

  return (
    <div className={`group relative overflow-hidden rounded-2xl ${colors.bg} border ${colors.border} hover:shadow-xl transition-all duration-300 hover:scale-105 hover-lift`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
      </div>

      {/* Card Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`p-3 ${gradient} rounded-xl shadow-lg text-white transform group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-bold text-lg line-clamp-2 ${colors.text} group-hover:text-opacity-80 transition-colors`} title={resource.title}>
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(resource._id as string)}
            disabled={isDeleting}
            className="shrink-0 hover:bg-red-500/20 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {resource.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 mr-1" />
                <span className="hidden md:inline">View Here</span>

              </Button>
            </DialogTrigger>
            <ResourceViewer resource={resource} />
          </Dialog>

          <Button
            variant="outline"
            size="sm"
          >
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full h-full"
              title="Open in new tab"
            >

              <ExternalLink className="h-4 lg:mr-1" />
              <span className="hidden lg:inline">View Outside</span>
            </a>
          </Button>

        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className={`absolute inset-0 ${gradient} opacity-5 rounded-2xl`}></div>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <div className="relative mx-auto w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full animate-pulse"></div>
        <div className="absolute inset-2 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center">
          <BookOpen className="h-8 w-8 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">No Resources Found</h3>
      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{message}</p>
      <p className="text-sm text-muted-foreground mt-4">Click "Add Resources" to get started with your learning materials.</p>
    </div>
  )
}

function ResourceGrid({
  resources,
  isDeleting,
  deletingResourceId,
  onDeleteClick
}: {
  resources: IResource[]
  isDeleting: boolean
  deletingResourceId: string | null
  onDeleteClick: (resourceId: string) => void
}) {
  if (resources.length === 0) {
    return <EmptyState message="No resources found." />
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource._id as string}
          resource={resource}
          isDeleting={isDeleting && deletingResourceId === resource._id}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  )
}

export function ResourceList({
  resources,
  learningPathId,
  onResourceDelete
}: ResourceListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)


  const handleDeleteClick = useCallback((resourceId: string) => {
    setResourceToDelete(resourceId)
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!resourceToDelete) return

    setIsDeleting(true)
    try {
      if (onResourceDelete) {
        await onResourceDelete(resourceToDelete)
      } else {
        // Fallback simulation for backward compatibility
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      toast({
        title: "Resource deleted",
        description: "The resource has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting resource:", error)
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setResourceToDelete(null)
    }
  }, [resourceToDelete, onResourceDelete])

  const handleDialogClose = useCallback(() => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setResourceToDelete(null)
    }
  }, [isDeleting])

  return (
    <div>



      <ResourceGrid
        resources={resources}
        isDeleting={isDeleting}
        deletingResourceId={resourceToDelete}
        onDeleteClick={handleDeleteClick}
      />




      <AlertDialog open={deleteDialogOpen} onOpenChange={handleDialogClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone
              and will permanently remove the resource from your learning path.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  Deleting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Delete Resource"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
