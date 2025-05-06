import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlayCircle } from "lucide-react"

interface LearningPathCardProps {
  title: string
  description: string
  progress: number
  totalTopics: number
  completedTopics: number
  image: string
  tags: string[]
}

export function LearningPathCard({
  title,
  description,
  progress,
  totalTopics,
  completedTopics,
  image,
  tags,
}: LearningPathCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedTopics}/{totalTopics} topics
            </span>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2">
          <PlayCircle className="h-4 w-4" />
          Continue Learning
        </Button>
      </CardFooter>
    </Card>
  )
}
