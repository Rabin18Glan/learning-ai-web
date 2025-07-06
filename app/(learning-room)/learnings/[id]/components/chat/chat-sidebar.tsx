
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import React from "react"
import { ChatSession } from "../../types/chat.types"
import ChatSkeleton from "./chat-sekeleton"
import ChatSessionItem from "./chat-session-item"
interface ChatSidebarProps {
    sessions: ChatSession[]
    selectedChatId: string | null
    isLoading: boolean
    isLoadingChats: boolean
    editingTitleId: string | null
    editingTitle: string
    onNewChat: () => void
    onSelectChat: (chatId: string) => void
    onEditStart: (chatId: string, title: string) => void
    onEditSubmit: (chatId: string) => void
    onEditChange: (value: string) => void
    onDeleteChat: (chatId: string) => void
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    sessions,
    selectedChatId,
    isLoading,
    isLoadingChats,
    editingTitleId,
    editingTitle,
    onNewChat,
    onSelectChat,
    onEditStart,
    onEditSubmit,
    onEditChange,
    onDeleteChat
}) => (
    <div className="w-64 border-r flex flex-col">
        <div className="flex items-center justify-between p-2 border-b">
            <span className="font-semibold">Chats</span>
            <Button size="icon" variant="ghost" onClick={onNewChat} disabled={isLoading || isLoadingChats}>
                <Plus className="h-5 w-5" />
            </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {isLoadingChats ? (
                <ChatSkeleton />
            ) : sessions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No chats yet</div>
            ) : (
                sessions.map(session => (
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
                            e.preventDefault()
                            onEditSubmit(session._id)
                        }}
                        onEditChange={onEditChange}
                        onDelete={() => onDeleteChat(session._id)}
                    />
                ))
            )}
        </div>
    </div>
)


export default ChatSidebar