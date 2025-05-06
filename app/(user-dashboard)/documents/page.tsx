"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentCard } from "@/components/document-card"
import { DocumentGrid } from "@/components/document-grid"
import { FileText, Grid, List, Plus, Search, SlidersHorizontal, Upload } from "lucide-react"

type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  tags: string[]
  thumbnail?: string
}

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Physics Notes.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2 hours ago",
      tags: ["Physics", "Science"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "2",
      name: "Math Formulas.docx",
      type: "DOCX",
      size: "1.2 MB",
      uploadedAt: "Yesterday",
      tags: ["Math", "Formulas"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "3",
      name: "History Timeline.pdf",
      type: "PDF",
      size: "3.7 MB",
      uploadedAt: "3 days ago",
      tags: ["History"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "4",
      name: "Chemistry Lab Report.pdf",
      type: "PDF",
      size: "5.1 MB",
      uploadedAt: "1 week ago",
      tags: ["Chemistry", "Science", "Lab"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "5",
      name: "Literature Notes.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadedAt: "2 weeks ago",
      tags: ["Literature", "English"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "6",
      name: "Biology Diagrams.png",
      type: "PNG",
      size: "4.2 MB",
      uploadedAt: "3 weeks ago",
      tags: ["Biology", "Science", "Diagrams"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
  ])

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <div className="flex items-center gap-2">
          <Link href="/upload">
            <Button className="gap-1">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-primary/10" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-primary/10" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {filteredDocuments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {searchQuery ? "Try a different search term" : "Upload your first document to get started"}
                </p>
                <Link href="/upload">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <DocumentGrid documents={filteredDocuments} />
          ) : (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Documents you've recently uploaded or accessed</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredDocuments.slice(0, 3).length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No recent documents</p>
              ) : viewMode === "grid" ? (
                <DocumentGrid documents={filteredDocuments.slice(0, 3)} />
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.slice(0, 3).map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Documents</CardTitle>
              <CardDescription>Documents you've marked as favorites</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4 text-muted-foreground">No favorite documents yet</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shared">
          <Card>
            <CardHeader>
              <CardTitle>Shared Documents</CardTitle>
              <CardDescription>Documents shared with you by others</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4 text-muted-foreground">No shared documents</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
