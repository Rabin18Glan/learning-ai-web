
"use client";

import { ChatTab } from "./components/chat/chat-tab";
import { NotesTab } from "./components/notes/notes-tab";
import { OverviewTab } from "./components/overview/overview-tab";
import { ResourcesTab } from "./components/resources-tab";
import { TaskTab } from "./components/task-tab";
import { VisualizeTab } from "./components/visualize-tab";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import type { IResource } from "@/models/Resource";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LearningSessionHead from "./components/learning-session-head";

export interface LearningPath {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  creatorId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  isPublic: boolean;
  sections?: any[];
  resources: IResource[];
  createdAt?: string;
  updatedAt?: string;
}

export default function LearningPathPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);

  const id = params.id as string;

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/learning-paths/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch learning path");
        }
        const data = await response.json();
        setLearningPath(data);
      } catch (error) {
        console.error("Error fetching learning path:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLearningPath();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex">
          {/* Sidebar Skeleton */}
          <div className="fixed top-0 left-0 w-72 h-full bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-4 flex flex-col space-y-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-9 w-full rounded-xl bg-blue-50" />
              <Skeleton className="h-9 w-full rounded-xl bg-blue-50" />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl bg-blue-50" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-40 rounded bg-blue-50" />
                <Skeleton className="h-4 w-56 rounded bg-blue-50" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 rounded-xl bg-blue-50" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-14 rounded-full bg-blue-50" />
              <Skeleton className="h-6 w-16 rounded-full bg-blue-50" />
              <Skeleton className="h-6 w-12 rounded-full bg-blue-50" />
            </div>
            <div className="flex flex-col gap-1.5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-8 rounded-xl bg-blue-50" />
              ))}
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="flex-1 ml-72 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              <Skeleton className="h-80 rounded-xl bg-gray-100 shadow-sm" />
              <div className="lg:col-span-2 space-y-2">
                <Skeleton className="h-60 rounded-xl bg-gray-100 shadow-sm" />
                <Skeleton className="h-72 rounded-xl bg-gray-100 shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-6">
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-blue-50 rounded-full shadow-lg"></div>
            <div className="absolute inset-2 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Learning Path Not Found</h1>
          <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm">The learning path you're looking for doesn't exist or you don't have access to it.</p>
          <Button
            size="sm"
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl h-9 px-4 font-medium hover:scale-110 transition-all duration-300"
            onClick={() => router.push("/learnings")}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Learnings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1488998427799-e3362cec87c3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN0dWR5fGVufDB8fDB8fHww')] bg-cover bg-center opacity-20 -z-10" />
      <div className="flex">
        <LearningSessionHead learningPath={learningPath} activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 ml-72 p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
            <TabsContent value="overview" className="space-y-2">
              <OverviewTab learningPathId={id} />
            </TabsContent>
            <TabsContent value="resources" className="space-y-2">
              <ResourcesTab learningPathId={id} />
            </TabsContent>
            <TabsContent value="chat" className="space-y-2">
              <ChatTab learningPathId={id} />
            </TabsContent>
            <TabsContent value="notes" className="space-y-2">
              <NotesTab learningPathId={id} />
            </TabsContent>
            <TabsContent value="visualize" className="space-y-2">
              <VisualizeTab learningPathId={id} />
            </TabsContent>
            <TabsContent value="tracking" className="space-y-2">
              <TaskTab learningPathId={id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
