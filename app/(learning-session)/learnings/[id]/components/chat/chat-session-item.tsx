import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import { ChatSession } from "../../types/chat.types";

interface ChatSessionItemProps {
  session: ChatSession;
  isSelected: boolean;
  isEditing: boolean;
  editingTitle: string;
  isLoading: boolean;
  onSelect: () => void;
  onEditStart: () => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onEditChange: (value: string) => void;
  onDelete: () => void;
}

const ChatSessionItem: React.FC<ChatSessionItemProps> = ({
  session,
  isSelected,
  isEditing,
  editingTitle,
  isLoading,
  onSelect,
  onEditStart,
  onEditSubmit,
  onEditChange,
  onDelete,
}) => (
  <div
    className={`group cursor-pointer p-3 rounded-lg hover:bg-primary-500/10 transition-all duration-200 ${
      isSelected ? "bg-primary-500/20 font-semibold" : ""
    }`}
    onClick={onSelect}
  >
    {isEditing ? (
      <form onSubmit={onEditSubmit} className="flex items-center gap-2">
        <input
          className="flex-1 border border-primary-500/20 rounded px-2 py-1 text-sm bg-primary-500/5 focus:ring-primary-500/30 text-primary-500"
          value={editingTitle}
          onChange={(e) => onEditChange(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={isLoading}
          className="bg-primary-500/10 border-primary-500/20 text-primary-500 hover:bg-primary-500/20"
        >
          Save
        </Button>
      </form>
    ) : (
      <div className="flex items-center justify-between">
        <span className="text-sm text-primary-500 truncate">{session.title || "Untitled"}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onEditStart();
            }}
            className="text-primary-500 hover:bg-primary-500/20"
            tabIndex={-1}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-primary-500 hover:bg-primary-500/20"
            tabIndex={-1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )}
    <div className="text-xs text-primary-500/60">
      {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleString() : ""}
    </div>
  </div>
);

export default ChatSessionItem;