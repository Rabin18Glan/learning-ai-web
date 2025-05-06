import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical, Trash, Edit, MessageSquare, Star, Download } from "lucide-react"

type Document = {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  tags: string[]
  thumbnail?: string
}

interface DocumentCardProps {
  document: Document
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{document.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-muted-foreground">
                {document.type} • {document.size}
              </p>
              <p className="text-xs text-muted-foreground">{document.uploadedAt}</p>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <span>
              <MessageSquare className="h-4 w-4" />
            </span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <span>
              <Star className="h-4 w-4" />
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
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
