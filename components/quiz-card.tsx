import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CircularProgressIndicator } from "@/components/circular-progress-indicator"
import { Brain, Clock, PlayCircle } from "lucide-react"

interface QuizCardProps {
  title: string
  description: string
  questions: number
  timeLimit: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  completed?: boolean
  score?: number
}

export function QuizCard({
  title,
  description,
  questions,
  timeLimit,
  difficulty,
  completed = false,
  score,
}: QuizCardProps) {
  // Map difficulty to color
  const difficultyColor = {
    Beginner: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Intermediate: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Advanced: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  }[difficulty]

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {completed && score !== undefined && <CircularProgressIndicator value={score} size={60} strokeWidth={6} />}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={difficultyColor}>
            {difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {questions} questions
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeLimit}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full gap-2">
          <PlayCircle className="h-4 w-4" />
          {completed ? "Review Quiz" : "Start Quiz"}
        </Button>
      </CardFooter>
    </Card>
  )
}
