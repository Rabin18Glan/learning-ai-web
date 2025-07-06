
 const ChatSkeleton = () => (
    <div className="animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-3 border-b">
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="flex gap-1">
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        ))}
    </div>
)


export default ChatSkeleton