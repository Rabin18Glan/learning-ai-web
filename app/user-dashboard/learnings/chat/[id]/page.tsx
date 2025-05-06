import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ChatInterface from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chat | EduSense AI",
  description: "Continue your conversation with EduSense AI",
}

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // In a real app, you would fetch the chat history from an API
  const chatId = params.id
  const chatTitle = "Machine Learning Concepts"
  const documentTitle = "Introduction to Machine Learning"

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/learnings">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chatTitle}</h1>
          <p className="text-muted-foreground">Chatting with: {documentTitle}</p>
        </div>
      </div>

      <ChatInterface chatId={chatId} />
    </div>
  )
}
