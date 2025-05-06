import { Card, CardContent } from "@/components/ui/card"
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

interface DocumentGridProps {
  documents: Document[]
}

export function DocumentGrid({ documents }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video relative bg-muted">
            {doc.thumbnail ? (
              <img src={doc.thumbnail || "/placeholder.svg"} alt={doc.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Chat with Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    <span>Add to Favorites</span>
                  </DropdownMenuItem>
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
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{doc.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {doc.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{doc.size}</span>
                <span>{doc.uploadedAt}</span>
              </div>
              <div className="flex flex-wrap gap-1 pt-2">
                {doc.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
