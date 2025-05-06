"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Search, X } from "lucide-react"

interface DocumentSidebarProps {
  chatId: string
}

type Document = {
  id: string
  name: string
  type: string
}

export function DocumentSidebar({ chatId }: DocumentSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Physics Notes.pdf",
      type: "PDF",
    },
    {
      id: "doc2",
      name: "Math Formulas.docx",
      type: "DOCX",
    },
    {
      id: "doc3",
      name: "History Timeline.pdf",
      type: "PDF",
    },
  ])

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Documents</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Tabs defaultValue="all" className="flex-1">
        <div className="px-4 py-2 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1">
              Active
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-2">
              {filteredDocuments.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">No documents found</p>
              ) : (
                filteredDocuments.map((doc) => (
                  <Button key={doc.id} variant="ghost" className="w-full justify-start">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="active" className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              <p className="text-center text-sm text-muted-foreground py-4">No active documents for this chat</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className="p-4 border-t">
        <Button className="w-full">Upload New Document</Button>
      </div>
    </div>
  )
}
