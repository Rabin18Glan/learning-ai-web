import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import { ChatSession } from "../../types/chat.types";
import ChatSessionItem from "./chat-session-item";

interface ChatSidebarProps {
  sessions: ChatSession[];
  selectedChatId: string | null;
  isLoading: boolean;
  isLoadingChats: boolean;
  editingTitleId: string | null;
  editingTitle: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onEditStart: (chatId: string, title: string) => void;
  onEditSubmit: (chatId: string) => void;
  onEditChange: (value: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  selectedChatId,
  isLoading,
  editingTitleId,
  editingTitle,
  onNewChat,
  onSelectChat,
  onEditStart,
  onEditSubmit,
  onEditChange,
  onDeleteChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-background/60 backdrop-blur-md transition-all duration-300">
      <div className="p-4 border-b border-primary-500/10">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-lg text-primary-500">Chats</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={onNewChat}
            disabled={isLoading}
            aria-label="Start new chat"
            className="bg-primary-500/10 hover:bg-primary-500/20 text-primary-500"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-primary-500/60" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-primary-500/5 border-primary-500/20 focus:ring-primary-500/30 text-primary-500"
            aria-label="Search chat sessions"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center text-primary-500/60 py-8">No chats found</div>
        ) : (
          filteredSessions.map((session) => (
            <ChatSessionItem
              key={session._id}
              session={session}
              isSelected={selectedChatId === session._id}
              isEditing={editingTitleId === session._id}
              editingTitle={editingTitle}
              isLoading={isLoading}
              onSelect={() => onSelectChat(session._id)}
              onEditStart={() => onEditStart(session._id, session.title)}
              onEditSubmit={(e) => {
                e.preventDefault();
                onEditSubmit(session._id);
              }}
              onEditChange={onEditChange}
              onDelete={() => onDeleteChat(session._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;