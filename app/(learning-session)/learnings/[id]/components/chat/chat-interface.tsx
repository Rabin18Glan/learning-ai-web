"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatArea from "./chat-area";
import useChat from "../../hooks/useChat";

interface ChatInterfaceProps {
  learningPathId: string;
}

export default function ChatInterface({ learningPathId }: ChatInterfaceProps) {
  const {
    sessions,
    selectedChatId,
    messages,
    input,
    isLoading,
    isLoadingChats,
    editingTitleId,
    editingTitle,
    messagesEndRef,
    setSelectedChatId,
    setInput,
    setEditingTitleId,
    setEditingTitle,
    handleNewChat,
    handleDeleteChat,
    handleEditTitle,
    handleSubmit,
  } = useChat(learningPathId);

  return (
    <div className="flex flex-col h-[80vh] max-w-full bg-background/80 backdrop-blur-xl rounded-xl shadow-2xl border border-primary-500/20 overflow-hidden transform-none">
      {/* Tabs */}
      <div className="flex border-b border-primary-500/10 bg-background/60 backdrop-blur-md overflow-x-auto scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent">
        {isLoadingChats ? (
          <div className="flex p-2 space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-32 bg-primary-500/10 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <div
                key={session._id}
                className={`flex items-center px-4 py-2 border-r border-primary-500/10 ${
                  selectedChatId === session._id ? "bg-primary-500/20" : "hover:bg-primary-500/10"
                } transition-colors duration-200`}
              >
                {editingTitleId === session._id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditTitle(session._id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="h-8 w-24 bg-primary-500/5 border-primary-500/20 text-primary-500"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary-500 hover:bg-primary-500/10"
                    >
                      <span className="sr-only">Save title</span>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </Button>
                  </form>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedChatId(session._id)}
                      className="text-sm text-primary-500 truncate max-w-[120px]"
                    >
                      {session.title || "Untitled"}
                    </button>
                    <div className="flex gap-1 ml-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditingTitleId(session._id);
                          setEditingTitle(session.title);
                        }}
                        className="h-8 w-8 text-primary-500 hover:bg-primary-500/10"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Edit chat title</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteChat(session._id)}
                        className="h-8 w-8 text-primary-500 hover:bg-primary-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete chat</span>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNewChat}
              disabled={isLoading}
              className="h-10 w-10 ml-2 text-primary-500 hover:bg-primary-500/10"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">New chat</span>
            </Button>
          </>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-0 bg-background/80 backdrop-blur-md">
        {isLoadingChats ? (
          <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent">
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
          </div>
        ) : (
          <ChatArea
            messages={messages}
            input={input}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}