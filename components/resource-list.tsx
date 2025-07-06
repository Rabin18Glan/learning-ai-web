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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, ExternalLink, FileText, Globe, Loader2, Trash2, Youtube } from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { Resource } from "../app/(learning-room)/learnings/[id]/components/resources-tab"

interface ResourceListProps {
  resources: Resource[]
  learningPathId: string
  onResourceDelete?: (resourceId: string) => Promise<void>
}

type FileType = "pdf" | "youtube" | "webpage"
type TabValue = "all" | FileType

const TAB_CONFIG = [
  { value: "all" as const, label: "All" },
  { value: "pdf" as const, label: "Documents" },
  { value: "youtube" as const, label: "YouTube" },
  { value: "webpage" as const, label: "Webpages" },
]

const RESOURCE_ICONS = {
  pdf: <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  youtube: <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" />,
  webpage: <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />,
} as const

const STATUS_BADGES = {
  pending: (
    <Badge variant="secondary">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Pending
    </Badge>
  ),
  processing: (
    <Badge variant="secondary">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Processing
    </Badge>
  ),
  failed: (
    <Badge variant="destructive">
      <AlertCircle className="mr-2 h-4 w-4" />
      Failed
    </Badge>
  ),
  completed: <Badge variant="outline">Completed</Badge>,
} as const

interface ResourceCardProps {
  resource: Resource
  isDeleting: boolean
  onDeleteClick: (resourceId: string) => void
}

function ResourceCard({ resource, isDeleting, onDeleteClick }: ResourceCardProps) {
  const icon = RESOURCE_ICONS[resource.fileType as keyof typeof RESOURCE_ICONS] || 
    <FileText className="h-5 w-5" />
  
  const statusBadge = STATUS_BADGES[resource.status as keyof typeof STATUS_BADGES] || null

  return (
    <div className="border rounded-md p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon}
          <h3 className="text-lg font-semibold truncate" title={resource.title}>
            {resource.title}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDeleteClick(resource._id)}
          disabled={isDeleting}
          className="shrink-0"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {resource.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {resource.description}
        </p>
      )}
      
      <div className="mb-4">
        {statusBadge}
      </div>
      
      <div className="flex justify-end">
        <Button variant="link" size="sm" asChild>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            View <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  )
}

function ResourceGrid({ 
  resources, 
  isDeleting, 
  deletingResourceId, 
  onDeleteClick 
}: {
  resources: Resource[]
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
          key={resource._id}
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
  const [activeTab, setActiveTab] = useState<TabValue>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredResources = useMemo(() => {
    if (activeTab === "all") return resources
    return resources.filter((resource) => resource.fileType === activeTab)
  }, [resources, activeTab])

  const resourceCounts = useMemo(() => {
    const counts = resources.reduce((acc, resource) => {
      acc[resource.fileType] = (acc[resource.fileType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      all: resources.length,
      pdf: counts.pdf || 0,
      youtube: counts.youtube || 0,
      webpage: counts.webpage || 0,
    }
  }, [resources])

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
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
        <TabsList className="grid w-full grid-cols-4">
          {TAB_CONFIG.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="relative">
              {label}
              {resourceCounts[value] > 0 && (
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {resourceCounts[value]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {TAB_CONFIG.map(({ value, label }) => (
          <TabsContent key={value} value={value} className="mt-6">
            <ResourceGrid
              resources={value === "all" ? filteredResources : filteredResources.filter(r => r.fileType === value)}
              isDeleting={isDeleting}
              deletingResourceId={resourceToDelete}
              onDeleteClick={handleDeleteClick}
            />
          </TabsContent>
        ))}
      </Tabs>

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