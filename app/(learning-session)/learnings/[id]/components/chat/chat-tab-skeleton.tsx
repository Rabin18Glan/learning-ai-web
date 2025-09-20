import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ChatTabSkeleton = () => (
  <Card className="shadow-2xl border-0 bg-primary-500/5 backdrop-blur-lg">
    <CardHeader className="bg-primary-500/10 border-b border-primary-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl bg-primary-500/20" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-primary-500/20" />
          <Skeleton className="h-4 w-80 bg-primary-500/20" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex h-[80vh] max-h-[80vh]">
        <SidebarSkeleton />
        <MainChatAreaSkeleton />
      </div>
    </CardContent>
  </Card>
)

const SidebarSkeleton = () => (
  <div className="w-72 border-r border-primary-500/10 bg-primary-500/5 backdrop-blur-lg flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-primary-500/20">
      <Skeleton className="h-5 w-12 bg-primary-500/20" />
      <Skeleton className="h-8 w-8 rounded-full bg-primary-500/20" />
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <ChatSessionSkeleton key={i} />
      ))}
    </div>
  </div>
)

const ChatSessionSkeleton = () => (
  <div className="px-4 py-3 rounded-lg bg-primary-500/10 animate-pulse">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-3/4 bg-primary-500/20" />
      <div className="flex gap-1">
        <Skeleton className="h-6 w-6 rounded bg-primary-500/20" />
        <Skeleton className="h-6 w-6 rounded bg-primary-500/20" />
      </div>
    </div>
    <Skeleton className="h-3 w-1/2 bg-primary-500/20 mt-2" />
  </div>
)

const MainChatAreaSkeleton = () => (
  <div className="flex-1 flex flex-col bg-primary-500/5 backdrop-blur-lg">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="text-center py-8">
        <Skeleton className="h-4 w-80 mx-auto bg-primary-500/20" />
      </div>
      <ConversationSkeleton />
    </div>
    <InputAreaSkeleton />
  </div>
)

const ConversationSkeleton = () => (
  <div className="space-y-4">
    <MessageSkeleton align="right" width="w-64" height="h-20" />
    <MessageSkeleton align="left" width="w-80" height="h-32" />
    <MessageSkeleton align="right" width="w-48" height="h-16" />
  </div>
)

const MessageSkeleton = ({
  align,
  width,
  height,
}: {
  align: "left" | "right"
  width: string
  height: string
}) => (
  <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
    <div className="max-w-[80%]">
      <Skeleton className={`${height} ${width} rounded-lg bg-primary-500/20`} />
    </div>
  </div>
)

const InputAreaSkeleton = () => (
  <div className="p-4 border-t border-primary-500/20 bg-primary-500/10 backdrop-blur-lg">
    <div className="flex items-end space-x-2">
      <Skeleton className="flex-1 h-20 rounded-lg bg-primary-500/20" />
      <Skeleton className="h-10 w-10 rounded-lg bg-primary-500/20" />
    </div>
  </div>
)

export default ChatTabSkeleton