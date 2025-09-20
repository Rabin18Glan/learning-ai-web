import axios from "axios"
import { useEffect, useState } from "react"

const useChatTab = (learningPathId: string) => {
    const [hasResources, setHasResources] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [vectorStoreId, setVectorStoreId] = useState<string | null>(null)

    useEffect(() => {
        const fetchResources = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`/api/learning-paths/${learningPathId}/resources`)
                const data = res.data
                setHasResources(Array.isArray(data.resources) && data.resources.length > 0)
                setVectorStoreId(data.vectorStoreId || null)
            } catch {
                setHasResources(false)
                setVectorStoreId(null)
            } finally {
                setIsLoading(false)
            }
        }
        fetchResources()
    }, [learningPathId])

    return {
        hasResources,
        vectorStoreId,
        isLoading
    }
}

export default useChatTab