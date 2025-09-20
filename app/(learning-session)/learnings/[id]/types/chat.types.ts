
export interface Message {
  _id?: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export interface ChatSession {
  _id: string
  title: string
  lastMessageAt?: string
}