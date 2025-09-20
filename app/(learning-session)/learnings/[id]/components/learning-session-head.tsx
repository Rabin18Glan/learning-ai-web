"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Clock, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { LearningPath } from "../page"


interface LearningSessionHeadProps {
  learningPath: LearningPath
}
function LearningSessionHead({ learningPath }: LearningSessionHeadProps) {

  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-3xl text-gray-800 p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl hover-lift">
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/learnings")}
            className="text-gray-700 hover:bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl hover-lift"
          >
            <ArrowLeft className="h-4 w-5 mr-1" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-gray-700 hover:bg-white/30 backdrop-blur-sm border border-white/40 rounded-2xl hover-lift"
          >
            <Settings className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </div>

        <div className="space-y-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/20">
              <BookOpen className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-800">{learningPath.title}</h1>
              <p className="text-gray-600 text-lg font-medium mt-2">{learningPath.description}</p>
            </div>

           
          </div>

           {learningPath.createdAt && (
              <div className="flex items-center gap-2 text-gray-600 bg-white/20 px-3 py-1 rounded-xl backdrop-blur-sm border border-white/30">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Created {new Date(learningPath.createdAt).toLocaleDateString()}</span>
              </div>
            )}

        </div>
      </div>

     
    </div>
  )
}

export default LearningSessionHead