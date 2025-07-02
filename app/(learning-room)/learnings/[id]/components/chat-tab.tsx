import React, { useEffect, useState } from "react"
import axios from "axios"
import ChatInterface from "@/components/chat-interface"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function ChatTab({ learningPathId }: { learningPathId: string }) {
  const [hasResources, setHasResources] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vectorStoreId, setVectorStoreId] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`/api/learning-paths/${learningPathId}/resources`)
        const data = res.data
        setHasResources(Array.isArray(data.resources) && data.resources.length > 0)
        setVectorStoreId(data.vectorStoreId || null)
      } catch {
        setHasResources(false)
        setVectorStoreId(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchResources()
  }, [learningPathId])

  if (isLoading) return <Skeleton className="h-64 w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat with AI Tutor</CardTitle>
        <CardDescription>Ask questions about the content in this learning path</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasResources ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources yet</h3>
            <p className="text-muted-foreground mb-6">
              Add some resources to this learning path to start chatting with the AI tutor
            </p>
            <Button>Add Resources</Button>
          </div>
        ) 
        : 
        // !vectorStoreId ? (
        //   <div className="text-center py-12">
        //     <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        //     <h3 className="text-lg font-medium mb-2">Resources are being processed</h3>
        //     <p className="text-muted-foreground mb-6">
        //       Please wait while we process your resources. This may take a few minutes.
        //     </p>
        //   </div>
        // ) : 
        (
          <ChatInterface learningPathId={learningPathId} />
        )}
      </CardContent>
    </Card>
  )
}
