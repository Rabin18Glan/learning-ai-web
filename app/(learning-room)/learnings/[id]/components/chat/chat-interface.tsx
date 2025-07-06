"use client"

import useChat from "../../hooks/useChat"
import ChatArea from "./chat-area"
import ChatSidebar from "./chat-sidebar"



interface ChatInterfaceProps {
  learningPathId: string
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
    handleSubmit
  } = useChat(learningPathId)

  return (
    <div className="flex h-[600px] max-h-[80vh]">
      <ChatSidebar
        sessions={sessions}
        selectedChatId={selectedChatId}
        isLoading={isLoading}
        isLoadingChats={isLoadingChats}
        editingTitleId={editingTitleId}
        editingTitle={editingTitle}
        onNewChat={handleNewChat}
        onSelectChat={setSelectedChatId}
        onEditStart={(chatId, title) => {
          setEditingTitleId(chatId)
          setEditingTitle(title)
        }}
        onEditSubmit={handleEditTitle}
        onEditChange={setEditingTitle}
        onDeleteChat={handleDeleteChat}
      />
      <ChatArea
        messages={messages}
        input={input}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  )
}