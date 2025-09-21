
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IUserProgress } from "@/models/UserProgress";
import { Activity, BookOpenIcon, CheckCircleIcon, Clock, MessageCircle, Notebook, PenLine, Star, TrendingUp, Zap } from "lucide-react";

interface ProgressCardProps {
    data: IUserProgress;
    numberOfCompletedTasks: number;
    numberOfTaskRemained: number;
    numberOfResources: number;
    loading: boolean;
    numberOfChats: number;
    numberOfNotes: number;
}

export function ProgressCard({ data, loading, numberOfCompletedTasks, numberOfTaskRemained, numberOfResources, numberOfChats, numberOfNotes }: ProgressCardProps) {
    if (loading) {
        return (
            <Card className="border-0 shadow-2xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-md p-6">
                    <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Progress</CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">Your learning journey progress</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-48">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-24 w-24 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full mx-auto backdrop-blur-md"></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-16 bg-white/10 dark:bg-slate-950/10 rounded-2xl backdrop-blur-md"></div>
                            <div className="h-16 bg-white/10 dark:bg-slate-950/10 rounded-2xl backdrop-blur-md"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const progressPercentage = Math.floor((numberOfCompletedTasks / (numberOfCompletedTasks + numberOfTaskRemained)) * 100);

    return (
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/10 dark:bg-slate-950/10 backdrop-blur-xl rounded-3xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <CardHeader className="text-center relative z-10 p-6">
                <div className="relative mx-auto mb-8 w-36 h-36">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-red-500/30 rounded-full animate-pulse backdrop-blur-md"></div>
                    <div className="absolute inset-2 bg-gradient-to-br from-orange-500/50 to-red-600/50 backdrop-blur-lg rounded-full opacity-50 blur-md"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="text-8xl filter drop-shadow-2xl transform hover:scale-110 transition-transform duration-300">🔥</div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r p-2 from-orange-600/80 to-red-600/80 text-white font-black  text-2xl w-12 h-12 rounded-full border-white/20 backdrop-blur-sm">
                                {data.lastStreakCount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-extrabold  bg-clip-text text-primary">Your Progress</CardTitle>
                    <CardDescription className="text-base font-medium text-gray-500 dark:text-slate-400">
                        Keep the momentum going! 🚀
                    </CardDescription>
                </div>
                <div className="mt-6 relative">
                    <div className="w-full bg-gray-200/20 dark:bg-gray-700/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                        <div
                            className="bg-gradient-to-r from-indigo-500/80 to-purple-600/80 h-full rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progressPercentage?progressPercentage:0}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse backdrop-blur-md"></div>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                        <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{progressPercentage?progressPercentage:0}% Complete</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
                <div className="grid grid-cols-1 gap-4">


                    <div className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-100/20 to-green-100/20 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-md border border-emerald-200/30 dark:border-emerald-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl backdrop-blur-sm">
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Completed Tasks</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-300">Well done!</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{numberOfCompletedTasks}</div>
                                <TrendingUp className="w-4 h-4 text-emerald-500 ml-auto" />
                            </div>
                        </div>
                    </div>


                    <div className="group p-4 rounded-2xl bg-gradient-to-br from-blue-100/20 to-cyan-100/20 dark:from-blue-900/20 dark:to-cyan-900/20 backdrop-blur-md border border-blue-200/30 dark:border-blue-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-sm">
                                    <BookOpenIcon className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Resources</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-300">Knowledge gained</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{numberOfResources}</div>
                                <Star className="w-4 h-4 text-blue-500 ml-auto" />
                            </div>
                        </div>
                    </div>


                    <div className="group p-4 rounded-2xl bg-gradient-to-br from-violet-100/20 to-purple-100/20 dark:from-violet-900/20 dark:to-purple-900/20 backdrop-blur-md border border-violet-200/30 dark:border-violet-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-violet-500/20 rounded-xl backdrop-blur-sm">
                                    <MessageCircle className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-violet-900 dark:text-violet-100">Chats</p>
                                    <p className="text-xs text-violet-600 dark:text-violet-300">Stay on Conversation</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-violet-600 dark:text-violet-300">{numberOfChats}</div>
                                <Zap className="w-4 h-4 text-violet-500 ml-auto" />
                            </div>
                        </div>
                    </div>


                    <div className="group p-4 rounded-2xl bg-gradient-to-br from-teal-100/20 to-cyan-100/20 dark:from-teal-900/20 dark:to-cyan-900/20 backdrop-blur-md border border-teal-200/30 dark:border-teal-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-500/20 rounded-xl backdrop-blur-sm">
                                    <Notebook className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-teal-900 dark:text-teal-100">Notes</p>
                                    <p className="text-xs text-teal-600 dark:text-teal-300">Don't forget to take notes</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-teal-600 dark:text-teal-300">{numberOfNotes}</div>
                                <PenLine className="w-4 h-4 text-teal-500 ml-auto" />
                            </div>
                        </div>
                    </div>


                    <div className="group p-4 rounded-2xl bg-gradient-to-br from-pink-100/20 to-rose-100/20 dark:from-pink-900/20 dark:to-rose-900/20 backdrop-blur-md border border-pink-200/30 dark:border-pink-800/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-500/20 rounded-xl backdrop-blur-sm">
                                    <Clock className="w-5 h-5 text-pink-600 dark:text-pink-300" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-pink-900 dark:text-pink-100">Last Activity</p>
                                    <p className="text-xs text-pink-600 dark:text-pink-300">Stay consistent</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-pink-600 dark:text-pink-300">
                                    {new Date(data.lastAccessedAt).toLocaleDateString()}
                                </div>
                                <Activity className="w-4 h-4 text-pink-500 ml-auto" />
                            </div>
                        </div>
                    </div>


                </div>
            </CardContent>

        </Card>
    )
}