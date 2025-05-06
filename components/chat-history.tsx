"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, MoreVertical, Trash, ArrowRight } from "lucide-react"

type ChatSession = {
  id: string
  title: string
  preview: string
  timestamp: string
  documentName?: string
}

export function ChatHistory() {
  const router = useRouter()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "chat1",
      title: "Physics Concepts",
      preview: "Can you explain the concept of quantum entanglement?",
      timestamp: "2 hours ago",
      documentName: "Physics Notes.pdf",
    },
    {
      id: "chat2",
      title: "Math Problem Solving",
      preview: "How do I solve this differential equation?",
      timestamp: "Yesterday",
      documentName: "Math Formulas.docx",
    },
    {
      id: "chat3",
      title: "History Questions",
      preview: "What were the main causes of World War I?",
      timestamp: "3 days ago",
      documentName: "History Timeline.pdf",
    },
  ])

  const handleDelete = (id: string) => {
    setChatSessions(chatSessions.filter((session) => session.id !== id))
  }

  const handleContinueChat = (id: string) => {
    router.push(`/chat/${id}`)
  }

  return (
    <div className="space-y-4">
      {chatSessions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No chat sessions yet</p>
          <Button className="mt-4">Start New Chat</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {chatSessions.map((session) => (
            <Card key={session.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{session.preview}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">{session.timestamp}</p>
                      {session.documentName && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{session.documentName}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleContinueChat(session.id)}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleContinueChat(session.id)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Continue Chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(session.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
