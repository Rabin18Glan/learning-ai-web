"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical, Trash, Edit, MessageSquare } from "lucide-react"

type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
}

export function RecentDocuments() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Physics Notes.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Math Formulas.docx",
      type: "DOCX",
      size: "1.2 MB",
      uploadedAt: "Yesterday",
    },
    {
      id: "3",
      name: "History Timeline.pdf",
      type: "PDF",
      size: "3.7 MB",
      uploadedAt: "3 days ago",
    },
  ])

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No documents uploaded yet</p>
          <Button className="mt-4">Upload Document</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doc.type} • {doc.size} • {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <span>
                      <MessageSquare className="h-4 w-4" />
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(doc.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
