import { BookOpen, Clock, FileText, MessageSquare } from "lucide-react"
import { ReactNode } from "react"

export interface Metric{
    icon:ReactNode
    title:string,
    metric:number

}

 function getMatrices():Metric[]{
    const totalLearningTime =25
    const totalLearningPaths = 5
    const totalDocuments = 20
    const totalChatSessions=13
    return [
        {
        icon:<Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
        title:"Total Learning Time",
        metric:totalLearningTime
        },
          {
        icon: <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
        title:"Learning Paths",
        metric:totalLearningPaths
        },
          {
        icon:   <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />             ,
        title:"Documents",
        metric:totalDocuments
        },
        {
        icon:  <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        title:"Chat Sessions",
        metric:totalChatSessions
        }
        
    ]
}

export const metrices = getMatrices();
