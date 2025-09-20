import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ProgressTracker } from "@/components/progress-tracker"

export function TaskTab({ learningPathId }: { learningPathId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>Stay on top of your learning path</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressTracker learningPathId={learningPathId} />
      </CardContent>
    </Card>
  )
}
