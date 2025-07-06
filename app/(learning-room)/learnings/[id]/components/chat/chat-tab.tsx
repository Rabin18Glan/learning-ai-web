import ChatInterface from "@/app/(learning-room)/learnings/[id]/components/chat/chat-interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import React from "react"
import useChatTab from "../../hooks/useChatTab"
import ChatTabSkeleton from "./chat-tab-skeleton"



// Custom hook for chat tab logic


// Skeleton Components


const NoResourcesState = ({ onAddResources }: { onAddResources?: () => void }) => (
  <div className="text-center py-12">
    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium mb-2">No resources yet</h3>
    <p className="text-muted-foreground mb-6">
      Add some resources to this learning path to start chatting with the AI tutor
    </p>
    <Button onClick={onAddResources}>Add Resources</Button>
  </div>
)

const ChatTabCard = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle>Chat with AI Tutor</CardTitle>
      <CardDescription>Ask questions about the content in this learning path</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

interface ChatTabContentProps {
  hasResources: boolean | null
  vectorStoreId: string | null
  learningPathId: string
  onAddResources?: () => void
}

const ChatTabContent: React.FC<ChatTabContentProps> = ({
  hasResources,
  vectorStoreId,
  learningPathId,
  onAddResources
}) => {
  if (!hasResources) {
    return <NoResourcesState onAddResources={onAddResources} />
  }

  return <ChatInterface learningPathId={learningPathId} />
}

interface ChatTabProps {
  learningPathId: string
  onAddResources?: () => void
}

export function ChatTab({ learningPathId, onAddResources }: ChatTabProps) {
  const { hasResources, vectorStoreId, isLoading } = useChatTab(learningPathId)

  if (isLoading) {
    return <ChatTabSkeleton />
  }

  return (
    <ChatTabCard>
      <ChatTabContent
        hasResources={hasResources}
        vectorStoreId={vectorStoreId}
        learningPathId={learningPathId}
        onAddResources={onAddResources}
      />
    </ChatTabCard>
  )
}