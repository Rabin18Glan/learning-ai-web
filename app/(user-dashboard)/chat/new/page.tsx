"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentSelector } from "@/components/document-selector"
import { FileText, MessageSquare, Mic, Send, StopCircle, Upload, X } from "lucide-react"

export default function NewChatPage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
  const [chatTitle, setChatTitle] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleStartChat = () => {
    // In a real app, this would create a new chat session
    const chatId = `chat-${Date.now()}`
    router.push(`/chat/${chatId}`)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Implement actual voice recording logic here
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Start New Chat</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-none shadow-md">
          <CardHeader>
            <CardTitle>New AI Tutor Session</CardTitle>
            <CardDescription>Start a new conversation with your AI tutor to learn about any topic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Input
                placeholder="Give your chat a title (optional)"
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
                className="bg-white/80 dark:bg-gray-950/80"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Documents</CardTitle>
            <CardDescription>Choose documents to include in this chat session</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentSelector
              onSelect={(docIds) => setSelectedDocuments(docIds)}
              selectedDocuments={selectedDocuments}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedDocuments.length > 0 ? (
                selectedDocuments.map((docId) => (
                  <div
                    key={docId}
                    className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Document {docId.split("-")[1]}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No documents selected</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Upload New Document
              </span>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
            <CardDescription>Start your conversation with a question</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="voice">
                  <Mic className="h-4 w-4 mr-2" />
                  Voice
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your question here..."
                    className="min-h-[120px]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select learning mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="explain">Explain Concepts</SelectItem>
                      <SelectItem value="quiz">Quiz Me</SelectItem>
                      <SelectItem value="summarize">Summarize Content</SelectItem>
                      <SelectItem value="practice">Practice Problems</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="voice">
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Button
                    variant={isRecording ? "destructive" : "outline"}
                    size="lg"
                    className={`rounded-full h-16 w-16 ${isRecording ? "animate-pulse" : ""}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? <StopCircle className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? "Recording... Click to stop" : "Click to start recording"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleStartChat} disabled={!input && !isRecording}>
              <Send className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
