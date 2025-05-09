"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, CheckCircle, Download } from "lucide-react"
import { OpenSourceLLM } from "@/lib/langchain/models"

export default function OllamaSetupPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ollamaStatus, setOllamaStatus] = useState<{
    availableLLMs: string[]
    availableEmbeddings: string[]
    missingLLMs: string[]
    missingEmbeddings: string[]
    ollamaUrl: string
  } | null>(null)
  const [pullingModel, setPullingModel] = useState<string | null>(null)

  useEffect(() => {
    checkOllamaStatus()
  }, [])

  const checkOllamaStatus = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/setup-ollama")

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to check Ollama status")
      }

      const data = await response.json()
      setOllamaStatus(data)
    } catch (error) {
      console.error("Error checking Ollama status:", error)
      setError( "Failed to check Ollama status")
    } finally {
      setLoading(false)
    }
  }

  const pullModel = async (model: string) => {
    try {
      setPullingModel(model)

      const response = await fetch("/api/setup-ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to pull model")
      }

      // Wait a bit and then refresh status
      setTimeout(() => {
        checkOllamaStatus()
        setPullingModel(null)
      }, 3000)
    } catch (error) {
      console.error("Error pulling model:", error)
      setError( "Failed to pull model")
      setPullingModel(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p>Checking Ollama status...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-4">
            <Button onClick={checkOllamaStatus}>Try Again</Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Ollama Setup</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ollama Configuration</AlertTitle>
        <AlertDescription>Ollama is running at: {ollamaStatus?.ollamaUrl || "Unknown"}</AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>LLM Models</CardTitle>
            <CardDescription>These are the language models used for generating responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(OpenSourceLLM).map((model) => {
                const isAvailable = ollamaStatus?.availableLLMs.some((m) => m.includes(model))
                const isMissing = ollamaStatus?.missingLLMs.includes(model)
                const isPulling = pullingModel === model

                return (
                  <div key={model} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isAvailable ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span>{model}</span>
                    </div>
                    <div>
                      {isAvailable ? (
                        <Badge variant="outline" className="bg-green-50">
                          Installed
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => pullModel(model)} disabled={isPulling}>
                          {isPulling ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Pulling...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Pull Model
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Embedding Models</CardTitle>
            <CardDescription>These models are used for creating vector embeddings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["bge-small", "bge-base", "nomic-embed"].map((model) => {
                const isAvailable = ollamaStatus?.availableEmbeddings.some((m) => m.includes(model))
                const isMissing = ollamaStatus?.missingEmbeddings.includes(model)
                const isPulling = pullingModel === model

                return (
                  <div key={model} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {isAvailable ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                      )}
                      <span>{model}</span>
                    </div>
                    <div>
                      {isAvailable ? (
                        <Badge variant="outline" className="bg-green-50">
                          Installed
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => pullModel(model)} disabled={isPulling}>
                          {isPulling ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Pulling...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Pull Model
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button onClick={checkOllamaStatus} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Refreshing...
            </>
          ) : (
            "Refresh Status"
          )}
        </Button>
      </div>
    </div>
  )
}
