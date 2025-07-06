"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Trash2, FileText, Edit, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "next-auth/react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  userId?: string
}

interface NotesEditorProps {
  learningPathId: string
}

export function NotesEditor({ learningPathId }: NotesEditorProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const auth = useSession()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/learning-paths/${learningPathId}/notes`)
        const data = await res.json()
        setNotes(data)
        setActiveNote(data[0] || null)
      } catch (error) {
        console.error("Error fetching notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [learningPathId])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "# New Note\n\nStart writing your notes here...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: auth.data?.user.id,
    }

    setNotes([...notes, newNote])
    setActiveNote(newNote)
    setEditTitle(newNote.title)
    setEditContent(newNote.content)
    setIsEditing(true)
  }

  const handleEditNote = () => {
    if (activeNote) {
      setEditTitle(activeNote.title)
      setEditContent(activeNote.content)
      setIsEditing(true)
    }
  }

  const handleSaveNote = async () => {
    if (!activeNote) return

    const updatedNote: Note = {
      ...activeNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date().toISOString(),
      userId: auth.data?.user.id,
    }

    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      })

      if (!res.ok) throw new Error("Failed to save note")

      const savedNote = await res.json()
      setNotes(notes.map(note => (note.id === savedNote.id ? savedNote : note)))
      setActiveNote(savedNote)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving note:", error)
    }
  }

  const handleDeleteNote = () => {
    if (activeNote) {
      const updatedNotes = notes.filter(note => note.id !== activeNote.id)
      setNotes(updatedNotes)
      setActiveNote(updatedNotes.length > 0 ? updatedNotes[0] : null)
      setIsEditing(false)
    }
  }

  const handleSelectNote = (note: Note) => {
    setActiveNote(note)
    setIsEditing(false)
  }

  const filteredNotes = searchQuery
    ? notes.filter(
        note =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="md:col-span-3">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" onClick={handleCreateNote}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    activeNote?.id === note.id ? "bg-muted" : ""
                  }`}
                  onClick={() => handleSelectNote(note)}
                >
                  <h3 className="font-medium truncate">{note.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No notes match your search" : "No notes yet"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        {activeNote ? (
          <Tabs defaultValue="edit" value={isEditing ? "edit" : "preview"}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="edit" disabled={!isEditing}>Edit</TabsTrigger>
                <TabsTrigger value="preview" disabled={isEditing}>Preview</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button size="sm" onClick={handleSaveNote}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEditNote}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteNote}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="edit" className="mt-0">
              <div className="space-y-4">
                <Input
                  placeholder="Note title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write your notes here... Markdown is supported."
                  className="min-h-[400px] font-mono"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{activeNote.title}</h2>
                <div className="prose dark:prose-invert max-w-none prose-code:text-foreground">
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
                            {activeNote.content}
                          </ReactMarkdown>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No note selected</h3>
            <p className="text-muted-foreground mb-6">
              Select a note from the sidebar or create a new one
            </p>
            <Button onClick={handleCreateNote}>Create New Note</Button>
          </div>
        )}
      </div>
    </div>
  )
}
