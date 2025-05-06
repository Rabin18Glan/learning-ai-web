import { formatDistanceToNow } from "date-fns"
import { FileText, MoreHorizontal, MessageSquare, Trash2, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  title: string
  description: string
  fileType: string
  uploadDate: string
  size: number
  tags: string[]
}

interface DocumentListProps {
  documents: Document[]
}

export default function DocumentList({ documents }: DocumentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{doc.description}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="uppercase">
                  {doc.fileType}
                </Badge>
              </TableCell>
              <TableCell>{formatFileSize(doc.size)}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(doc.uploadDate), { addSuffix: true })}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {doc.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{doc.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/learnings/documents/${doc.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/learnings/chat/new?documentId=${doc.id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with Document
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
