import React from "react"
import { NotesEditor } from "./notes-editor"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function NotesTab({ learningPathId }: { learningPathId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Take and organize notes for this learning path</CardDescription>
      </CardHeader>
      <CardContent>
        <NotesEditor learningPathId={learningPathId} />
      </CardContent>
    </Card>
  )
}
