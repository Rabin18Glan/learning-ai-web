"use client"

import { ChatTab } from "./components/chat/chat-tab"
import { NotesTab } from "./components/notes/notes-tab"
import { OverviewTab } from "./components/overview/overview-tab"
import { ResourcesTab } from "./components/resources-tab"
import { TaskTab } from "./components/task-tab"
import { VisualizeTab } from "./components/visualize-tab"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { IResource, ResourceType } from "@/models/Resource"
import { ArrowLeft, BarChart, BookOpen, Clock, FileEdit, FileText, Globe, MessageSquare, Network, Settings, Sparkles, Tag, Users } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LearningSessionHead from "./components/learning-session-head"


export interface LearningPath {
  _id: string
  title: string
  description: string
  coverImage?: string
  tags: string[]
  creatorId: {
    _id: string
    name: string
    email: string
    image?: string
  }
  isPublic: boolean
  sections?: any[]
  resources: IResource[]
  createdAt?: string
  updatedAt?: string
}

export default function LearningPathPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  const id = params.id as string

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/learning-paths/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch learning path")
        }

        const data = await response.json()
        console.log(data)
        setLearningPath(data)
      } catch (error) {
        console.error("Error fetching learning path:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchLearningPath()
    }

  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container py-8 space-y-8">
          {/* Header Skeleton */}
          <div className="relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-8 animate-pulse">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="relative z-10 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl bg-white/40" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-80 rounded-xl bg-white/40" />
                <Skeleton className="h-4 w-96 rounded-lg bg-white/30" />
              </div>
              <Skeleton className="h-12 w-12 rounded-2xl bg-white/40" />
            </div>
            <div className="relative z-10 flex gap-3 mt-6">
              <Skeleton className="h-8 w-20 rounded-full bg-white/40" />
              <Skeleton className="h-8 w-24 rounded-full bg-white/40" />
              <Skeleton className="h-8 w-16 rounded-full bg-white/40" />
            </div>
            {/* Glass bubbles */}
            <div className="absolute top-6 right-8 w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 left-12 w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-xl">
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-xl bg-white/40" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="h-96 rounded-2xl bg-white/30" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-2xl bg-white/30" />
              <Skeleton className="h-80 rounded-2xl bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-full animate-pulse border border-white/20"></div>
            <div className="absolute inset-2 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
              <BookOpen className="h-8 w-8 text-gray-600" />
            </div>
            {/* Glass bubbles around icon */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-white/50 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Learning Path Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">The learning path you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            onClick={() => router.push("/learnings")}
            size="lg"
            className="bg-white/30 backdrop-blur-sm border border-white/40 text-gray-700 hover:bg-white/40 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Learnings
          </Button>
        </div>
      </div>
    )
  }

  return (
<div className="min-h-screen relative">
  <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1488998427799-e3362cec87c3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0dWR5fGVufDB8fDB8fHww')] bg-cover bg-center -z-10" />


     
      <div className="container p-2 md:space-y-8 md:p-8 space-y-4 relative">
        <LearningSessionHead learningPath={learningPath} />
        <div className="flex flex-wrap items-center gap-3">
          {learningPath.tags?.map((tag, i) => (
            <Badge key={i} className="px-4 py-2 bg-white/30 backdrop-blur-sm border border-white/40 text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white/40">
              <Tag className="h-3 w-3 mr-2" />
              {tag}
            </Badge>
          ))}
       
        
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="relative">
            {/* Glass ripple effect behind tabs */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-2xl blur-sm"></div>
            
            <TabsList className="w-full bg-white/30 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-2 grid grid-cols-6 gap-2 h-auto relative z-10">
              <TabsTrigger
                value="overview"
                className="flex-col gap-2  py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-sm hidden md:block font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="flex-col gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block ">Resources</span>
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="flex-col gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block ">Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="flex-col gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <FileEdit className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block ">Notes</span>
              </TabsTrigger>
              <TabsTrigger
                value="visualize"
                className="flex-col gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <Network className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block ">Visualize</span>
              </TabsTrigger>
              <TabsTrigger
                value="tracking"
                className="flex-col gap-2 py-4 px-6 rounded-xl data-[state=active]:bg-white/40 data-[state=active]:backdrop-blur-sm data-[state=active]:border data-[state=active]:border-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:bg-white/25"
              >
                <BarChart className="h-5 w-5" />
                <span className="text-sm font-medium hidden md:block ">Tracking</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Floating glass bubbles around tabs */}
            <div className="absolute top-4 left-8 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute top-6 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
            <div className="absolute bottom-4 left-1/3 w-4 h-4 bg-white/25 rounded-full animate-bounce"></div>
            <div className="absolute bottom-6 right-1/4 w-3 h-3 bg-white/35 rounded-full animate-pulse"></div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab learningPathId={id} />
          </TabsContent>
          <TabsContent value="resources" className="space-y-6">
            <ResourcesTab learningPathId={id} />
          </TabsContent>
          <TabsContent value="chat" className="space-y-6">
            <ChatTab learningPathId={id} />
          </TabsContent>
          <TabsContent value="notes" className="space-y-6">
            <NotesTab learningPathId={id} />
          </TabsContent>
          <TabsContent value="visualize" className="space-y-6">
            <VisualizeTab learningPathId={id} />
          </TabsContent>
          <TabsContent value="tracking" className="space-y-6">
            <TaskTab learningPathId={id} />
          </TabsContent>
          {/* <TabsContent value="voice" className="space-y-6">
            <VoiceChat learningPathId={id} />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}