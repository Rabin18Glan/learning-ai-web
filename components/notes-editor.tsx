"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Trash2, FileText, Edit, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
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

  // Mock data loading
  useEffect(() => {
    // In a real app, you would fetch notes from an API
    const mockNotes: Note[] = [
      {
        id: "1",
        title: "Key Machine Learning Concepts",
        content:
          "# Machine Learning Fundamentals\n\n- Supervised Learning: Training with labeled data\n- Unsupervised Learning: Finding patterns in unlabeled data\n- Reinforcement Learning: Learning through trial and error\n\n## Important Algorithms\n\n1. Linear Regression\n2. Logistic Regression\n3. Decision Trees\n4. Random Forests\n5. Support Vector Machines\n6. Neural Networks",
        createdAt: "2023-05-10T14:30:00Z",
        updatedAt: "2023-05-15T09:45:00Z",
      },
      {
        id: "2",
        title: "Neural Networks Architecture",
        content:
          "# Neural Network Architectures\n\n## Layers\n- Input Layer\n- Hidden Layers\n- Output Layer\n\n## Activation Functions\n- ReLU\n- Sigmoid\n- Tanh\n- Softmax\n\n## Backpropagation\nThe process of updating weights based on the error gradient.",
        createdAt: "2023-06-02T11:20:00Z",
        updatedAt: "2023-06-05T16:10:00Z",
      },
      {
        id: "3",
        title: "Model Evaluation Metrics",
        content:
          "# Evaluation Metrics\n\n## Classification Metrics\n- Accuracy\n- Precision\n- Recall\n- F1 Score\n- ROC-AUC\n\n## Regression Metrics\n- Mean Squared Error (MSE)\n- Root Mean Squared Error (RMSE)\n- Mean Absolute Error (MAE)\n- R-squared\n\n## Cross-Validation\nK-fold cross-validation helps prevent overfitting and provides more reliable performance estimates.",
        createdAt: "2023-06-20T09:15:00Z",
        updatedAt: "2023-06-22T14:30:00Z",
      },
    ]

    setTimeout(() => {
      setNotes(mockNotes)
      setActiveNote(mockNotes[0])
      setIsLoading(false)
    }, 1000)
  }, [learningPathId])

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "# New Note\n\nStart writing your notes here...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  const handleSaveNote = () => {
    if (activeNote) {
      const updatedNote = {
        ...activeNote,
        title: editTitle,
        content: editContent,
        updatedAt: new Date().toISOString(),
      }

      setNotes(notes.map((note) => (note.id === activeNote.id ? updatedNote : note)))
      setActiveNote(updatedNote)
      setIsEditing(false)
    }
  }

  const handleDeleteNote = () => {
    if (activeNote) {
      const updatedNotes = notes.filter((note) => note.id !== activeNote.id)
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
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()),
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
                <TabsTrigger value="edit" disabled={!isEditing}>
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview" disabled={isEditing}>
                  Preview
                </TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveNote}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEditNote}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteNote}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="edit" className="mt-0">
              <div className="space-y-4">
                <Input placeholder="Note title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
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
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {/* In a real app, you would render markdown here */}
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(activeNote.content) }} />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No note selected</h3>
            <p className="text-muted-foreground mb-6">Select a note from the sidebar or create a new one</p>
            <Button onClick={handleCreateNote}>Create New Note</Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Simple markdown formatter (in a real app, use a proper markdown library)
function formatMarkdown(text: string): string {
  // Convert headers
  let html = text
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")

  // Convert lists
  html = html.replace(/^- (.*$)/gm, "<li>$1</li>")
  html = html.replace(/<\/li>\n<li>/g, "</li><li>")
  html = html.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>")

  // Convert numbered lists
  html = html.replace(/^\d+\. (.*$)/gm, "<li>$1</li>")
  html = html.replace(/<\/li>\n<li>/g, "</li><li>")
  html = html.replace(/(<li>.*<\/li>)/g, "<ol>$1</ol>")

  // Convert paragraphs
  html = html.replace(/^(?!<[hou]|$)(.*$)/gm, "<p>$1</p>")

  // Convert line breaks
  html = html.replace(/\n/g, "")

  return html
}
