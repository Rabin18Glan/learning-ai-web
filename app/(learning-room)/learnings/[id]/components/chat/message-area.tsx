import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { toast } from "sonner"
import { Message } from "../../types/chat.types"
import { useSession } from "next-auth/react"
import { useParams } from "next/navigation"

interface MessageAreaProps {
  message: Message
  index: number


}

const MessageArea: React.FC<MessageAreaProps> = ({ message, index, }) => {
  const auth = useSession();
   const { id:learningPathId} = useParams() as { id: string }
  
  const handleSaveAsNote = async () => {
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Note from Message ${index + 1}`,
          content: message.content,
          userId:auth.data?.user.id,
        }),
      })

      if (!res.ok) throw new Error("Failed to save note")

      toast.success("Message saved as a note!")
    } catch (error) {
      console.error("Error saving note:", error)
      toast.error("Failed to save note")
    }
  }

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <Card
        className={`relative p-4 max-w-[80%] ${message.role === "user"
          ? "bg-primary text-primary-foreground"
          : "bg-muted"
          }`}
      >
        {message.role === "assistant" && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={handleSaveAsNote}
            title="Save as note"
          >
            <Copy className="w-4 h-4" />
          </Button>
        )}

        {message.role === "assistant" ? (
          <div className="prose dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-table:text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  const inline = !match
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md !bg-gray-100 dark:!bg-gray-800"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={`${className} bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                      {children}
                    </code>
                  )
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-4 border-primary pl-4 italic bg-muted/30 py-2 rounded-r my-4">
                      {children}
                    </blockquote>
                  )
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
                        {children}
                      </table>
                    </div>
                  )
                },
                th({ children }) {
                  return (
                    <th className="border border-border bg-muted/50 p-3 text-left font-semibold">
                      {children}
                    </th>
                  )
                },
                td({ children }) {
                  return (
                    <td className="border border-border p-3">
                      {children}
                    </td>
                  )
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      className="text-primary hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  )
                },
                hr() {
                  return <hr className="my-6 border-border" />
                },
                h1({ children }) {
                  return <h1 className="text-2xl font-bold mb-4 text-foreground">{children}</h1>
                },
                h2({ children }) {
                  return <h2 className="text-xl font-semibold mb-3 text-foreground">{children}</h2>
                },
                h3({ children }) {
                  return <h3 className="text-lg font-semibold mb-2 text-foreground">{children}</h3>
                },
                p({ children }) {
                  return <p className="mb-3 text-foreground leading-relaxed">{children}</p>
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 mb-3 text-foreground">{children}</ul>
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 mb-3 text-foreground">{children}</ol>
                },
                li({ children }) {
                  return <li className="mb-1 text-foreground">{children}</li>
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
      </Card>
    </div>
  )
}

export default MessageArea
