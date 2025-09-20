import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Brain, Sparkles } from "lucide-react";
import React from "react";
import ChatInterface from "./chat-interface";
import useChatTab from "../../hooks/useChatTab";

const NoResourcesState = ({ onAddResources }: { onAddResources?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6">
    <div className="relative mb-8 group">
      <div className="w-32 h-32 rounded-full bg-primary-500 flex items-center justify-center shadow-2xl shadow-primary-500/25">
        <BookOpen className="w-16 h-16 text-white" />
      </div>
      <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center shadow-lg animate-bounce">
        <Plus className="w-6 h-6 text-white" />
      </div>
    </div>
    <h3 className="text-3xl font-bold mb-4 text-primary-500">No Resources Yet</h3>
    <p className="text-primary-500/60 text-center max-w-md mb-8 text-lg">
      Add some learning resources to unlock AI-powered tutoring.
    </p>
    <Button
      onClick={onAddResources}
      className="bg-primary-500 hover:bg-primary-600 text-white shadow-xl shadow-primary-500/25 px-8 py-4 text-lg"
    >
      <BookOpen className="w-5 h-5 mr-3" />
      Add Learning Resources
    </Button>
  </div>
);

const ChatTabCard = ({ children }: { children: React.ReactNode }) => (
  <Card className="shadow-2xl border-0 bg-background/80 backdrop-blur-xl overflow-hidden max-w-full transform-none">
    <CardHeader className="bg-primary-500/5 border-b border-primary-500/10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-xl text-primary-500">Chat with AI</CardTitle>
          <CardDescription className="text-base text-primary-500/60">
            Get instant help and explanations about your learning materials
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">{children}</CardContent>
  </Card>
);

interface ChatTabContentProps {
  hasResources: boolean | null;
  learningPathId: string;
  onAddResources?: () => void;
}

const ChatTabContent: React.FC<ChatTabContentProps> = ({
  hasResources,
  learningPathId,
  onAddResources,
}) => {
  if (!hasResources) {
    return <NoResourcesState onAddResources={onAddResources} />;
  }
  return <ChatInterface learningPathId={learningPathId} />;
};

interface ChatTabProps {
  learningPathId: string;
  onAddResources?: () => void;
}

export function ChatTab({ learningPathId, onAddResources }: ChatTabProps) {
  const { hasResources, isLoading } = useChatTab(learningPathId);

  if (isLoading) {
    return (
      <Card className="shadow-2xl border-0 bg-background/80 backdrop-blur-xl max-w-full transform-none">
        <CardHeader className="bg-primary-500/5 border-b border-primary-500/10">
          <div className="h-6 w-48 bg-primary-500/20 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary-500/20 animate-pulse mb-6"></div>
            <div className="h-6 w-48 bg-primary-500/10 rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="h-20 w-64 bg-primary-500/10 rounded-xl animate-pulse" />
            </div>
            <div className="flex justify-start">
              <div className="h-32 w-80 bg-primary-500/10 rounded-xl animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ChatTabCard>
      <ChatTabContent hasResources={hasResources} learningPathId={learningPathId} onAddResources={onAddResources} />
    </ChatTabCard>
  );
}