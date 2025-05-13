"use client"

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Send, Loader2, Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"

interface Message {
  _id?: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

interface ChatSession {
  _id: string
  title: string
  lastMessageAt?: string
}

interface ChatInterfaceProps {
  learningPathId: string
}

export default function ChatInterface({ learningPathId }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch all chat sessions
  useEffect(() => {
    axios.get(`/api/learning-paths/${learningPathId}/chat`)
      .then(res => {
        setSessions(res.data.chats || [])
        if (res.data.chats && res.data.chats.length > 0) {
          setSelectedChatId(res.data.chats[0]._id)
        } else {
          handleNewChat()
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learningPathId])

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return
    axios.get(`/api/learning-paths/${learningPathId}/chat/${selectedChatId}`)
      .then(res => setMessages(res.data.messages || []))
  }, [selectedChatId, learningPathId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Create a new chat session
  const handleNewChat = async () => {
    setIsLoading(true)
    const res = await axios.post(`/api/learning-paths/${learningPathId}/chat`, { title: "New Chat" })
    if (res.data.chat) {
      setSessions(prev => [res.data.chat, ...prev])
      setSelectedChatId(res.data.chat._id)
      setMessages([])
    }
    setIsLoading(false)
  }

  // Delete a chat session
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm("Delete this chat?")) return
    setIsLoading(true)
    await axios.delete(`/api/learning-paths/${learningPathId}/chat`, { data: { chatId } })
    setSessions(prev => prev.filter(s => s._id !== chatId))
    if (selectedChatId === chatId) {
      setSelectedChatId(sessions.length > 1 ? sessions.find(s => s._id !== chatId)?._id || null : null)
      setMessages([])
    }
    setIsLoading(false)
  }

  // Edit chat title
  const handleEditTitle = async (chatId: string) => {
    setIsLoading(true)
    await axios.put(`/api/learning-paths/${learningPathId}/chat`, { chatId, title: editingTitle })
    setSessions(prev =>
      prev.map(s => (s._id === chatId ? { ...s, title: editingTitle } : s))
    )
    setEditingTitleId(null)
    setEditingTitle("")
    setIsLoading(false)
  }

  // Send a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !selectedChatId) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await axios.post(`/api/learning-paths/${learningPathId}/chat/${selectedChatId}`, { content: userMessage })
      setMessages(prev => [...prev, { role: "assistant", content: response.data.message.content }])
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error processing your request." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[600px] max-h-[80vh]">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="flex items-center justify-between p-2 border-b">
          <span className="font-semibold">Chats</span>
          <Button size="icon" variant="ghost" onClick={handleNewChat} disabled={isLoading}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No chats yet</div>
          ) : (
            sessions.map(session => (
              <div
                key={session._id}
                className={`group cursor-pointer px-4 py-3 border-b hover:bg-muted ${selectedChatId === session._id ? "bg-muted font-bold" : ""}`}
                onClick={() => setSelectedChatId(session._id)}
              >
                {editingTitleId === session._id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      handleEditTitle(session._id)
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      className="border rounded px-1 py-0.5 text-sm"
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      autoFocus
                    />
                    <Button type="submit" size="sm" variant="outline" disabled={isLoading}>
                      Save
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{session.title || "Untitled"}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={e => {
                          e.stopPropagation()
                          setEditingTitleId(session._id)
                          setEditingTitle(session.title)
                        }}
                        tabIndex={-1}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteChat(session._id)
                        }}
                        tabIndex={-1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleString() : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-md">
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
        <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask a question about this learning path..."
            className="flex-1 resize-none"
            rows={2}
            disabled={isLoading}
            onKeyDown={e => {
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
    </div>
  )
}