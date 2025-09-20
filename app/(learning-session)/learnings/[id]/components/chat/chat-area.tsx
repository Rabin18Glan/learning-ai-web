import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import React from "react";
import MessageArea from "./message-area";
import { Message } from "../../types/chat.types";

interface ChatAreaProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  input,
  isLoading,
  messagesEndRef,
  onInputChange,
  onSubmit,
}) => (
  <div className="flex flex-col h-full min-h-0 bg-background/80 backdrop-blur-md">
    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary-500/20 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="text-center text-primary-500/60 py-8">
          Ask a question about this learning path to get started
        </div>
      ) : (
        messages.map((message, index) => (
          <MessageArea
            key={`${message._id || index}-${message.timestamp || Date.now()}`}
            message={message}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
    <form onSubmit={onSubmit} className="p-4 border-t border-primary-500/10 bg-background/60 backdrop-blur-md">
      <div className="flex items-end space-x-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask a question about this learning path..."
          className="flex-1 resize-none bg-primary-500/5 border-primary-500/20 focus:ring-primary-500/30 text-primary-500"
          rows={2}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="bg-primary-500 hover:bg-primary-600 text-white"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  </div>
);

export default ChatArea;