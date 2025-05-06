"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText } from "lucide-react"

interface DocumentSelectorProps {
  onSelect: (docIds: string[]) => void
  selectedDocuments: string[]
}

type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
}

export function DocumentSelector({ onSelect, selectedDocuments }: DocumentSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc-1",
      name: "Physics Notes.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2 hours ago",
    },
    {
      id: "doc-2",
      name: "Math Formulas.docx",
      type: "DOCX",
      size: "1.2 MB",
      uploadedAt: "Yesterday",
    },
    {
      id: "doc-3",
      name: "History Timeline.pdf",
      type: "PDF",
      size: "3.7 MB",
      uploadedAt: "3 days ago",
    },
    {
      id: "doc-4",
      name: "Chemistry Lab Report.pdf",
      type: "PDF",
      size: "5.1 MB",
      uploadedAt: "1 week ago",
    },
    {
      id: "doc-5",
      name: "Literature Notes.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadedAt: "2 weeks ago",
    },
  ])

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleToggleDocument = (docId: string) => {
    if (selectedDocuments.includes(docId)) {
      onSelect(selectedDocuments.filter((id) => id !== docId))
    } else {
      onSelect([...selectedDocuments, docId])
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[240px] rounded-md border">
        <div className="p-4 space-y-2">
          {filteredDocuments.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No documents found</p>
          ) : (
            filteredDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
                <Checkbox
                  id={doc.id}
                  checked={selectedDocuments.includes(doc.id)}
                  onCheckedChange={() => handleToggleDocument(doc.id)}
                />
                <label htmlFor={doc.id} className="flex items-center space-x-2 text-sm cursor-pointer flex-1">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onSelect([])} disabled={selectedDocuments.length === 0}>
          Clear All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(documents.map((doc) => doc.id))}
          disabled={selectedDocuments.length === documents.length}
        >
          Select All
        </Button>
      </div>
    </div>
  )
}
