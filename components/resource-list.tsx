"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Youtube, Globe, ExternalLink, MessageSquare, Trash2, AlertCircle, Loader2 } from "lucide-react"
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
import { toast } from "@/components/ui/use-toast"

interface Resource {
  _id: string
  type: "document" | "youtube" | "webpage"
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  addedAt: string
  processingStatus: "pending" | "processing" | "completed" | "failed"
  processingError?: string
  metadata: Record<string, any>
}

interface ResourceListProps {
  resources: Resource[]
  learningPathId: string
}

export function ResourceList({ resources, learningPathId }: ResourceListProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (resourceId: string) => {
    setResourceToDelete(resourceId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!resourceToDelete) return

    setIsDeleting(true)
    try {
      // In a real implementation, this would delete the resource from the server
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
  }

  const filteredResources =
    activeTab === "all" ? resources : resources.filter((resource) => resource.type === activeTab)

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-600 dark:text-red-400" />
      case "webpage":
        return <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="youtube">YouTube</TabsTrigger>
          <TabsTrigger value="webpage">Webpages</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredResources.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No resources found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredResources.map((resource) => (
                <div key={resource._id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <h3 className="text-lg font-semibold">{resource.title}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(resource._id)}>
                      {isDeleting && resourceToDelete === resource._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {resource.description && <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>}
                  <div className="mt-2">
                    {resource.processingStatus === "pending" && (
                      <Badge variant="secondary">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Pending
                      </Badge>
                    )}
                    {resource.processingStatus === "processing" && (
                      <Badge variant="secondary">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </Badge>
                    )}
                    {resource.processingStatus === "failed" && (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Failed: {resource.processingError || "Unknown error"}
                      </Badge>
                    )}
                    {resource.processingStatus === "completed" && <Badge variant="outline">Completed</Badge>}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="link" size="sm" asChild>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    {resource.metadata?.transcriptUrl && (
                      <Button variant="link" size="sm" asChild>
                        <a
                          href={resource.metadata.transcriptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          Transcript <FileText className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {resource.metadata?.summary && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          /* Handle summary display */
                        }}
                      >
                        Summary <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="document">
          {filteredResources.filter((resource) => resource.type === "document").length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No document resources found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredResources
                .filter((resource) => resource.type === "document")
                .map((resource) => (
                  <div key={resource._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(resource._id)}>
                        {isDeleting && resourceToDelete === resource._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    )}
                    <div className="mt-2">
                      {resource.processingStatus === "pending" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Pending
                        </Badge>
                      )}
                      {resource.processingStatus === "processing" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {resource.processingStatus === "failed" && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Failed: {resource.processingError || "Unknown error"}
                        </Badge>
                      )}
                      {resource.processingStatus === "completed" && <Badge variant="outline">Completed</Badge>}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="link" size="sm" asChild>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          View <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      {resource.metadata?.transcriptUrl && (
                        <Button variant="link" size="sm" asChild>
                          <a
                            href={resource.metadata.transcriptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            Transcript <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {resource.metadata?.summary && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            /* Handle summary display */
                          }}
                        >
                          Summary <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="youtube">
          {filteredResources.filter((resource) => resource.type === "youtube").length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No YouTube resources found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredResources
                .filter((resource) => resource.type === "youtube")
                .map((resource) => (
                  <div key={resource._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(resource._id)}>
                        {isDeleting && resourceToDelete === resource._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    )}
                    <div className="mt-2">
                      {resource.processingStatus === "pending" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Pending
                        </Badge>
                      )}
                      {resource.processingStatus === "processing" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {resource.processingStatus === "failed" && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Failed: {resource.processingError || "Unknown error"}
                        </Badge>
                      )}
                      {resource.processingStatus === "completed" && <Badge variant="outline">Completed</Badge>}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="link" size="sm" asChild>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          View <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      {resource.metadata?.transcriptUrl && (
                        <Button variant="link" size="sm" asChild>
                          <a
                            href={resource.metadata.transcriptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            Transcript <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {resource.metadata?.summary && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            /* Handle summary display */
                          }}
                        >
                          Summary <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="webpage">
          {filteredResources.filter((resource) => resource.type === "webpage").length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No webpage resources found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredResources
                .filter((resource) => resource.type === "webpage")
                .map((resource) => (
                  <div key={resource._id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <h3 className="text-lg font-semibold">{resource.title}</h3>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(resource._id)}>
                        {isDeleting && resourceToDelete === resource._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                    )}
                    <div className="mt-2">
                      {resource.processingStatus === "pending" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Pending
                        </Badge>
                      )}
                      {resource.processingStatus === "processing" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {resource.processingStatus === "failed" && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Failed: {resource.processingError || "Unknown error"}
                        </Badge>
                      )}
                      {resource.processingStatus === "completed" && <Badge variant="outline">Completed</Badge>}
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="link" size="sm" asChild>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          View <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      {resource.metadata?.transcriptUrl && (
                        <Button variant="link" size="sm" asChild>
                          <a
                            href={resource.metadata.transcriptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            Transcript <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {resource.metadata?.summary && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => {
                            /* Handle summary display */
                          }}
                        >
                          Summary <MessageSquare className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setResourceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isDeleting} onClick={handleDeleteConfirm}>
              {isDeleting ? (
                <>
                  Deleting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
