import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ChatTabSkeleton = () => (
  <Card className="shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/5">
    <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 animate-pulse"></div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 bg-gradient-to-r from-muted via-muted/60 to-muted animate-shimmer" />
          <Skeleton className="h-4 w-80 bg-gradient-to-r from-muted/60 via-muted/40 to-muted/60 animate-shimmer" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0">
      <div className="flex h-[700px] max-h-[85vh]">
        <SidebarSkeleton />
        <MainChatAreaSkeleton />
      </div>
    </CardContent>
  </Card>
)

const SidebarSkeleton = () => (
  <div className="w-80 border-r border-border/30 bg-card/40 flex flex-col">
    <div className="flex items-center justify-between p-4 border-b border-border/30">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <ChatSessionSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)

const ChatSessionSkeleton = () => (
  <div className="px-4 py-4 rounded-lg bg-muted/20 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-muted via-muted/60 to-muted animate-shimmer" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
  </div>
)

const MainChatAreaSkeleton = () => (
  <div className="flex-1 flex flex-col bg-gradient-to-br from-background via-background/95 to-muted/20">
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse mb-6"></div>
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-80 mb-8" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
      <ConversationSkeleton />
    </div>
    <InputAreaSkeleton />
  </div>
)

const ConversationSkeleton = () => (
  <div className="space-y-6">
    <MessageSkeleton align="right" width="w-64" height="h-20" />
    <MessageSkeleton align="left" width="w-80" height="h-32" />
    <MessageSkeleton align="right" width="w-48" height="h-16" />
  </div>
)

const MessageSkeleton = ({
  align,
  width,
  height
}: {
  align: 'left' | 'right'
  width: string
  height: string
}) => (
  <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
    <div className="max-w-[80%] space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className={`${height} ${width} rounded-xl bg-gradient-to-r from-muted via-muted/60 to-muted animate-shimmer`} />
    </div>
  </div>
)

const InputAreaSkeleton = () => (
  <div className="p-6 border-t border-border/30 bg-background/95 backdrop-blur-xl">
    <div className="space-y-4">
      <div className="relative">
        <Skeleton className="flex-1 h-20 rounded-lg bg-gradient-to-r from-muted via-muted/60 to-muted animate-shimmer" />
        <Skeleton className="absolute bottom-3 right-3 h-10 w-12 rounded-md" />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
)

export default ChatTabSkeleton

