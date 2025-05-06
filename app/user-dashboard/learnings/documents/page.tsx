import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { Search, Filter, Grid3X3, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DocumentGrid from "@/components/document-grid"
import DocumentList from "@/components/document-list"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const metadata: Metadata = {
  title: "Documents | EduSense AI",
  description: "Manage your learning documents",
}

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // This would be fetched from an API in a real application
  const documents = [
    {
      id: "1",
      title: "Introduction to Machine Learning",
      description: "A comprehensive guide to ML fundamentals",
      fileType: "pdf",
      uploadDate: "2023-05-15T10:30:00Z",
      size: 2500000,
      tags: ["machine learning", "ai", "beginners"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "2",
      title: "Advanced Data Structures",
      description: "Deep dive into complex data structures",
      fileType: "pdf",
      uploadDate: "2023-06-20T14:45:00Z",
      size: 3200000,
      tags: ["programming", "algorithms", "computer science"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "3",
      title: "Web Development Fundamentals",
      description: "Learn the basics of web development",
      fileType: "pdf",
      uploadDate: "2023-07-05T09:15:00Z",
      size: 1800000,
      tags: ["web", "html", "css", "javascript"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
    {
      id: "4",
      title: "Python for Data Science",
      description: "Using Python for data analysis and visualization",
      fileType: "pdf",
      uploadDate: "2023-08-12T11:20:00Z",
      size: 4100000,
      tags: ["python", "data science", "programming"],
      thumbnail: "/placeholder.svg?height=400&width=300",
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage and interact with your learning materials</p>
        </div>
        <Button asChild>
          <a href="/learnings/upload">Upload New Document</a>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">Word</SelectItem>
              <SelectItem value="ppt">PowerPoint</SelectItem>
              <SelectItem value="txt">Text</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="size">Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-end mb-4">
          <TabsList>
            <TabsTrigger value="grid">
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              List
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="grid" className="mt-0">
          <DocumentGrid documents={documents} />
        </TabsContent>
        <TabsContent value="list" className="mt-0">
          <DocumentList documents={documents} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
