import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, User, Bot, Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Message } from "../../types/chat.types";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

interface MessageAreaProps {
  message: Message;

}

const MessageArea: React.FC<MessageAreaProps> = ({ message}) => {
  const auth = useSession();
  const { id: learningPathId } = useParams() as { id: string };
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAsNote = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Note from AI Tutor - ${new Date().toLocaleDateString()}`,
          content: message.content,
          userId: auth.data?.user.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to save note");

      toast.success("Message saved as a note!");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className={`group flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
        <div className={`flex items-center gap-3 mb-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br ${
              message.role === "user" ? "from-primary-500 to-primary-600" : "from-primary-400 to-primary-500"
            } `}
          >
            {message.role === "user" ? <User className="w-4 h-4 text-orange-500" /> : <Bot className="w-4 h-4 text-primary" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-500">
              {message.role === "user" ? "You" : "AI Tutor"}
            </span>
            <span className="text-xs text-primary-500/60">
              {message.timestamp ? formatTimestamp(message.timestamp) : "now"}
            </span>
          </div>
        </div>
        <Card
          className={`relative overflow-hidden transition-all duration-300 border border-primary-500/20 bg-background/60 backdrop-blur-md ${
            message.role === "user" ? "bg-primary-500/10" : "bg-primary-400/5"
          } ${isHovered ? "transform scale-[1.01] shadow-lg" : "shadow-md"}`}
        >
          <CardContent className="p-5">
            {message.role === "assistant" ? (
              <div className="prose dark:prose-invert max-w-none prose-headings:text-primary-500 prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-table:text-foreground">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      const inline = !match;
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg !bg-primary-500/10 shadow-inner"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={`${className} bg-primary-500/10 px-2 py-1 rounded text-sm font-mono border border-primary-500/20`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-4 border-primary-500/60 pl-6 italic bg-primary-500/5 py-3 rounded-r-lg my-4 shadow-inner">
                          {children}
                        </blockquote>
                      );
                    },
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto my-6 rounded-lg border border-primary-500/20 shadow-sm">
                          <table className="w-full border-collapse">{children}</table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border-b border-primary-500/20 bg-primary-500/5 p-4 text-left font-semibold">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return <td className="border-b border-primary-500/10 p-4">{children}</td>;
                    },
                    a({ href, children }) {
                      return (
                        <a
                          href={href}
                          className="text-primary-500 hover:text-primary-600 underline underline-offset-2 font-medium transition-colors duration-200"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      );
                    },
                    hr() {
                      return <hr className="my-8 border-primary-500/20" />;
                    },
                    h1({ children }) {
                      return <h1 className="text-2xl font-bold mb-4 text-primary-500 border-b border-primary-500/20 pb-2">{children}</h1>;
                    },
                    h2({ children }) {
                      return <h2 className="text-xl font-semibold mb-3 text-primary-500">{children}</h2>;
                    },
                    h3({ children }) {
                      return <h3 className="text-lg font-semibold mb-2 text-primary-500">{children}</h3>;
                    },
                    p({ children }) {
                      return <p className="mb-4 text-foreground leading-relaxed">{children}</p>;
                    },
                    ul({ children }) {
                      return <ul className="list-disc pl-6 mb-4 text-foreground space-y-1">{children}</ul>;
                    },
                    ol({ children }) {
                      return <ol className="list-decimal pl-6 mb-4 text-foreground space-y-1">{children}</ol>;
                    },
                    li({ children }) {
                      return <li className="text-foreground leading-relaxed">{children}</li>;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">{message.content}</p>
            )}
            {message.role === "assistant" && (
              <div
                className={`flex items-center gap-2 mt-4 pt-4 border-t border-primary-500/10 transition-all duration-300 ${
                  isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 text-xs text-primary-500 hover:bg-primary-500/10"
                  onClick={handleCopy}
                  disabled={isCopied}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-3 text-xs text-primary-500 hover:bg-primary-500/10"
                  onClick={handleSaveAsNote}
                  disabled={isSaving}
                >
                  <Bookmark className="w-3 h-3 mr-2" />
                  {isSaving ? "Saving..." : "Save Note"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageArea;