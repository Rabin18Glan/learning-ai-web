import { IActivity } from "@/models/Activity";
import { IUserProgress } from "@/models/UserProgress";
import axios from "axios"
import { useEffect, useState } from "react"

interface LearningPathMeta {
  numberOfChats: number;
  numberOfResources: number;
  numberOfTaskCompleted: number;
  numberOfTaskRemained: number;
  recentActivities: IActivity[]; 
  summary: string;
  progress:IUserProgress;

    numberOfNotes:number
}

export function useMeta(learningPathId: string) {
  const [meta, setMeta] = useState<LearningPathMeta|null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMeta = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`/api/learning-paths/${learningPathId}/meta`)
        if (!res.data) throw new Error("Failed to fetch learning path meta")
        const data =  res.data
        setMeta(data)
      } catch (e) {
        setMeta(null)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMeta()
  }, [learningPathId])

  return {
    meta,
    isLoading
  }
}