
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, FileText, MessageSquare, Network, TrendingUp, Users, Award, Sparkles } from "lucide-react"
import { useMeta } from "../../hooks/useMeta"
import { ProgressCard } from "./progress"
import ActivitiesCard from "./activities"
import ResourceTaskCard from "./resources-task-card"

interface LearningPathMetaProps {
  learningPathId: string
}

export function OverviewTab({ learningPathId }: LearningPathMetaProps) {
  const { isLoading, meta } = useMeta(learningPathId);

  if (isLoading || !meta) {
    return (
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 w-full rounded-3xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-md" />
          <Skeleton className="h-48 w-full rounded-3xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-md" />
          <Skeleton className="h-48 w-full rounded-3xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-md" />
        </div>
        <Skeleton className="h-64 w-full rounded-3xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-md" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/10 via-blue-50/5 to-indigo-50/5 dark:from-slate-950/10 dark:via-blue-950/5 dark:to-indigo-950/5 p-6 space-y-8">
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProgressCard data={meta.progress} loading={isLoading} numberOfChats={meta.numberOfChats} numberOfNotes={meta.numberOfNotes}  numberOfCompletedTasks={meta.numberOfTaskCompleted} numberOfTaskRemained={meta.numberOfTaskRemained} numberOfResources={meta.numberOfResources} />
        
        </div>
        <div className="lg:col-span-2 space-y-8">
        <ResourceTaskCard numberOfResources={meta.numberOfResources} numberOfTaskCompleted={meta.numberOfTaskCompleted} numberOfTaskRemained={meta.numberOfTaskRemained} />
          <ActivitiesCard data={meta.recentActivities.reverse()} />
        </div>
      </div>

    </div>
  )
}
