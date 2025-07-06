import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ChatTabSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex h-[600px] max-h-[80vh]">
        <SidebarSkeleton />
        <MainChatAreaSkeleton />
      </div>
    </CardContent>
  </Card>
)

const SidebarSkeleton = () => (
  <div className="w-64 border-r flex flex-col">
    <div className="flex items-center justify-between p-2 border-b">
      <Skeleton className="h-5 w-12" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
    <div className="flex-1 overflow-y-auto">
      <div className="animate-pulse">
        {[1, 2, 3].map((i) => (
          <ChatSessionSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
)

const ChatSessionSkeleton = () => (
  <div className="px-4 py-3 border-b">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <div className="flex gap-1">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-6 rounded" />
      </div>
    </div>
    <Skeleton className="h-3 w-1/2" />
  </div>
)

const MainChatAreaSkeleton = () => (
  <div className="flex-1 flex flex-col">
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4">
      <div className="text-center py-8">
        <Skeleton className="h-4 w-80 mx-auto" />
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
  height
}: {
  align: 'left' | 'right'
  width: string
  height: string
}) => (
  <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
    <div className="max-w-[80%]">
      <Skeleton className={`${height} ${width} rounded-lg`} />
    </div>
  </div>
)

const InputAreaSkeleton = () => (
  <div className="flex items-end space-x-2 p-4 border-t">
    <Skeleton className="flex-1 h-20 rounded-md" />
    <Skeleton className="h-10 w-10 rounded-md" />
  </div>
)

export default ChatTabSkeleton