

import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import React from "react"
import { ChatSession } from "../../types/chat.types"

interface ChatSessionItemProps {
    session: ChatSession
    isSelected: boolean
    isEditing: boolean
    editingTitle: string
    isLoading: boolean
    onSelect: () => void
    onEditStart: () => void
    onEditSubmit: (e: React.FormEvent) => void
    onEditChange: (value: string) => void
    onDelete: () => void
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
    onDelete
}) => (
    <div
        className={`group cursor-pointer px-4 py-3 border-b hover:bg-muted ${isSelected ? "bg-muted font-bold" : ""
            }`}
        onClick={onSelect}
    >
        {isEditing ? (
            <form onSubmit={onEditSubmit} className="flex items-center gap-2">
                <input
                    className="border rounded px-1 py-0.5 text-sm"
                    value={editingTitle}
                    onChange={e => onEditChange(e.target.value)}
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
                            onEditStart()
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
                            onDelete()
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
)


export default ChatSessionItem