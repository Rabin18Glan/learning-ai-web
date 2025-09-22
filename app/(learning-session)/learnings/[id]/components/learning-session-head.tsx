"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart,
  BookOpen,
  Clock,
  FileEdit,
  FileText,
  Menu,
  MessageSquare,
  Network,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { LearningPath } from "../page";

interface LearningSessionHeadProps {
  learningPath: LearningPath;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

function LearningSessionHead({
  learningPath,
  activeTab,
  setActiveTab,
}: LearningSessionHeadProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </Button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-72 h-full 
          bg-white/70 backdrop-blur-xl 
          border-r border-gray-200/60 shadow-2xl 
          p-6 flex flex-col 
          transform transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-40`}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          {/* Top Section */}
          <div className="flex flex-col gap-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/learnings")}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 w-fit"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>

            {/* Title & Description */}
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-md">
                <BookOpen className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {learningPath.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {learningPath.description}
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-3">
              {learningPath.createdAt && (
                <div className="flex items-center gap-1.5 text-gray-500 text-xs px-2 py-1 rounded-lg bg-gray-50 w-fit shadow-sm">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  <span>{new Date(learningPath.createdAt).toLocaleDateString()}</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {learningPath.tags?.map((tag, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-gray-600 text-xs font-medium shadow-sm"
                  >
                    <Tag className="h-3.5 w-3.5 text-blue-500" />
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200" />

          {/* Bottom Section */}
          <div className="flex-grow w-full flex flex-col justify-between mt-28">
            {/* Navigation */}
            <TabsList className="flex flex-col gap-2 bg-transparent static w-full">
              {[
                { value: "overview", label: "Overview", icon: BookOpen },
                { value: "resources", label: "Resources", icon: FileText },
                { value: "chat", label: "Chat", icon: MessageSquare },
                { value: "notes", label: "Notes", icon: FileEdit },
                { value: "visualize", label: "Visualize", icon: Network },
                { value: "tracking", label: "Tasks", icon: BarChart },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-start justify-start gap-3 w-full px-4 py-2.5 rounded-xl 
                    text-sm font-medium text-gray-700 
                    hover:bg-blue-50 hover:text-blue-700 
                    data-[state=active]:bg-blue-600 
                    data-[state=active]:text-white 
                    transition-all duration-300 shadow-none"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* User Info */}
            {session?.user && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full shadow-sm"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-gray-500">{session.user.email}</span>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </>
  );
}

export default LearningSessionHead;
