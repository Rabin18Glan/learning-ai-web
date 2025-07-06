import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import React from "react"
import MessageArea from "./message-area"

import { Message } from "../../types/chat.types"


interface ChatAreaProps {
    messages: Message[]
    input: string
    isLoading: boolean
    messagesEndRef: React.RefObject<HTMLDivElement | null>
    onInputChange: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
}

const ChatArea: React.FC<ChatAreaProps> = ({
    messages,
    input,
    isLoading,
    messagesEndRef,
    onInputChange,
    onSubmit
}) => (
    <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-md">
            {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                    Ask a question about this learning path to get started
                </div>
            ) : (
                messages.map((message, index) => (
                    <MessageArea key={index} message={message} index={index} />
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
        <form onSubmit={onSubmit} className="flex items-end space-x-2 p-4 border-t">
            <Textarea
                value={input}
                onChange={e => onInputChange(e.target.value)}
                placeholder="Ask a question about this learning path..."
                className="flex-1 resize-none"
                rows={2}
                disabled={isLoading}
                onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        onSubmit(e)
                    }
                }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
        </form>
    </div>
)


export default ChatArea