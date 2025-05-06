import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ChatInterface from "@/components/chat-interface"
import DocumentSelector from "@/components/document-selector"
import ModelSelector from "@/components/model-selector"

export const metadata: Metadata = {
  title: "New Chat | EduSense AI",
  description: "Start a new chat with your learning materials",
}

export default async function NewChatPage({
  searchParams,
}: {
  searchParams: { documentId?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const initialDocumentId = searchParams.documentId

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Chat</h1>
        <p className="text-muted-foreground">Start a conversation with your learning materials</p>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <DocumentSelector initialDocumentId={initialDocumentId} />
          </div>
          <div className="w-full md:w-1/3">
            <ModelSelector />
          </div>
        </div>

        <ChatInterface />
      </div>
    </div>
  )
}
