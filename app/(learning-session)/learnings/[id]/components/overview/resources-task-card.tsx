
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, FileText, Sparkles, TrendingUp } from "lucide-react"

interface ResourceTaskCardProps {
  numberOfResources: number;
  numberOfTaskCompleted: number;
  numberOfTaskRemained: number
}
function ResourceTaskCard({ numberOfResources, numberOfTaskCompleted, numberOfTaskRemained }: ResourceTaskCardProps) {
  return (
    <Card className="border-0 shadow-2xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
      <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 backdrop-blur-md p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Learning Resources</CardTitle>
            <CardDescription className="text-sm text-emerald-500 dark:text-emerald-400">Your learning materials and progress</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-4 rounded-2xl bg-gradient-to-br from-blue-100/20 to-cyan-100/20 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-md border border-blue-200/30 dark:border-blue-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">Total</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-300 mb-1">{numberOfResources}</div>
            <div className="text-sm text-blue-600/70 dark:text-blue-300/70">Resources available</div>
          </div>
          <div className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-100/20 to-green-100/20 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-md border border-emerald-200/30 dark:border-emerald-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">Completed</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300 mb-1">{numberOfTaskCompleted}</div>
            <div className="text-sm text-emerald-600/70 dark:text-emerald-300/70">Tasks finished</div>
          </div>
          <div className="group p-4 rounded-2xl bg-gradient-to-br from-amber-100/20 to-orange-100/20 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-md border border-amber-200/30 dark:border-amber-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              <span className="font-semibold text-amber-900 dark:text-amber-100">Remaining</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-300 mb-1">{numberOfTaskRemained}</div>
            <div className="text-sm text-amber-600/70 dark:text-amber-300/70">In progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResourceTaskCard