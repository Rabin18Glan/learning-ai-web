import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex w-full items-start gap-4 p-4", isUser ? "justify-end" : "")}>
      {!isUser && (
        <Avatar className="h-8 w-8 ring-2 ring-blue-100 dark:ring-blue-900">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 shadow-sm",
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
        )}
      >
        <p className="text-sm">{message.content}</p>
        <div className={cn("text-xs", isUser ? "text-white/80" : "text-muted-foreground")}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ring-2 ring-indigo-100 dark:ring-indigo-900">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">JD</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
