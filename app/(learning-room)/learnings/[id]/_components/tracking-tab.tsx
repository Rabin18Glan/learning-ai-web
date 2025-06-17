import React from "react"
import { ProgressTracker } from "@/components/progress-tracker"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function TrackingTab({ learningPathId }: { learningPathId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracking</CardTitle>
        <CardDescription>Track your learning progress and set goals</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressTracker learningPathId={learningPathId} />
      </CardContent>
    </Card>
  )
}
