import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IActivity } from "@/models/Activity"
import { FileText, MessageSquare, Network, StickyNote, CheckSquare, Clock, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function getIconAndColor(area: IActivity["area"]) {
  switch (area) {
    case "RESOURCES":
      return {
        icon: <FileText className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-blue-400 to-cyan-500 backdrop-blur-lg",
        ringColor: "ring-blue-400/30",
        gradientBg: "bg-gradient-to-br from-blue-100/20 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900 backdrop-blur-md",
        textColor: "text-blue-600 dark:text-blue-200",
        borderColor: "border-blue-300/30 dark:border-blue-700/30"
      }
    case "CHAT":
      return {
        icon: <MessageSquare className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-indigo-400 to-purple-500 backdrop-blur-lg",
        ringColor: "ring-indigo-400/30",
        gradientBg: "bg-gradient-to-br from-indigo-100/20 to-purple-100/20 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-md",
        textColor: "text-indigo-600 dark:text-indigo-200",
        borderColor: "border-indigo-300/30 dark:border-indigo-700/30"
      }
    case "VISUALIZE":
      return {
        icon: <Network className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-purple-400 to-pink-500 backdrop-blur-lg",
        ringColor: "ring-purple-400/30",
        gradientBg: "bg-gradient-to-br from-purple-100/20 to-pink-100/20 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-md",
        textColor: "text-purple-600 dark:text-purple-200",
        borderColor: "border-purple-300/30 dark:border-purple-700/30"
      }
    case "NOTE":
      return {
        icon: <StickyNote className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-emerald-400 to-green-500 backdrop-blur-lg",
        ringColor: "ring-emerald-400/30",
        gradientBg: "bg-gradient-to-br from-emerald-100/20 to-green-100/20 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-md",
        textColor: "text-emerald-600 dark:text-emerald-200",
        borderColor: "border-emerald-300/30 dark:border-emerald-700/30"
      }
    case "TASK":
      return {
        icon: <CheckSquare className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-orange-400 to-red-500 backdrop-blur-lg",
        ringColor: "ring-orange-400/30",
        gradientBg: "bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-md",
        textColor: "text-orange-600 dark:text-orange-200",
        borderColor: "border-orange-300/30 dark:border-orange-700/30"
      }
    default:
      return {
        icon: <FileText className="h-5 w-5" />,
        bg: "bg-gradient-to-br from-gray-400 to-slate-500 backdrop-blur-lg",
        ringColor: "ring-gray-400/30",
        gradientBg: "bg-gradient-to-br from-gray-100/20 to-slate-100/20 dark:from-gray-900/20 dark:to-slate-900/20 backdrop-blur-md",
        textColor: "text-gray-600 dark:text-gray-200",
        borderColor: "border-gray-300/30 dark:border-gray-700/30"
      }
  }
}

function ActivitiesCard({ data }: { data: IActivity[] }) {
  return (
    <Card className="border-0 shadow-2xl bg-white/10  dark:bg-slate-950/10 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
      <CardHeader className="bg-gradient-to-r from-slate-500/10 to-gray-500/10 backdrop-blur-md p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-500/20 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-110">
            <Activity className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent">Recent Activity</CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">Your latest learning interactions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        {data.length === 0 ? (
          <div className="text-center py-8 h-80 flex flex-col items-center justify-center">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-400/20 to-gray-400/20 rounded-full animate-pulse backdrop-blur-md"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-slate-500/50 to-gray-600/50 backdrop-blur-lg rounded-full flex items-center justify-center shadow-inner">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-2">No recent activity</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Start learning to see your activity timeline here!</p>
          </div>
        ) : (
          <div className="relative h-96">
            <div className="h-full overflow-y-auto pr-4 scrollbar-modern">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300/50 to-transparent dark:via-slate-600/50"></div>
              <div className="space-y-2 ">
                {data.map((activity, index) => {
                  const { icon, bg, ringColor, gradientBg, textColor, borderColor } = getIconAndColor(activity.area)
                  const isLast = index === data.length - 1;

                  return (
                    <div key={index} className="relative flex items-center gap-4 group p-2">
                      <div
                        className={`relative z-10 flex-shrink-0 w-12 h-12 ${bg} rounded-2xl shadow-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300 ring-4 ${ringColor}`}
                      >
                        {icon}
                        {index === 0 && (
                          <div
                            className={`absolute inset-0 ${bg} rounded-2xl animate-ping opacity-20`}
                          ></div>
                        )}
                      </div>
                      <div
                        className={`flex-1 min-w-0 p-4 rounded-2xl ${gradientBg} border ${borderColor} group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-semibold text-sm ${textColor} mb-1 line-clamp-2`}
                            >
                              {activity.description || activity.type}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatDistanceToNow(new Date(activity.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${bg.replace(
                              "bg-gradient-to-br",
                              "bg-gradient-to-r"
                            )} text-white shadow-sm transition-all duration-300 group-hover:shadow-md`}
                          >
                            {activity.area.toLowerCase()}
                          </div>
                        </div>
                      </div>
                      {!isLast && (
                        <div className="absolute left-6 top-12 w-px h-6 bg-slate-200/50 dark:bg-slate-700/50"></div>
                      )}
                    </div>
                  );

                })}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/20 to-transparent dark:from-slate-950/20 pointer-events-none rounded-b-3xl"></div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ActivitiesCard
