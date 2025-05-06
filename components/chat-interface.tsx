"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { LLMModelSelector, EmbeddingModelSelector } from "@/components/model-selector"
import { OpenSourceLLM, OpenSourceEmbedding } from "@/lib/langchain/models"
import ReactMarkdown from "react-markdown"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatInterfaceProps {
  learningPathId: string
}

export default function ChatInterface({ learningPathId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [llmModel, setLlmModel] = useState<string>(OpenSourceLLM.LLAMA3_8B)
  const [embeddingModel, setEmbeddingModel] = useState<string>(OpenSourceEmbedding.BGE_SMALL)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch(`/api/learning-paths/${learningPathId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage,
          model: llmModel,
          embeddingModel: embeddingModel,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      <div className="flex space-x-2 mb-4">
        <div className="w-1/2">
          <label className="text-sm font-medium mb-1 block">LLM Model</label>
          <LLMModelSelector value={llmModel} onChange={setLlmModel} disabled={isLoading} />
        </div>
        <div className="w-1/2">
          <label className="text-sm font-medium mb-1 block">Embedding Model</label>
          <EmbeddingModelSelector value={embeddingModel} onChange={setEmbeddingModel} disabled={isLoading} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-md border">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Ask a question about this learning path to get started
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`p-4 max-w-[80%] ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this learning path..."
          className="flex-1 resize-none"
          rows={2}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
