import { type NextRequest, NextResponse } from "next/server"
import { generateRAGResponse, retrieveRelevantChunks } from "@/lib/rag-utils"

// Mock database of documents
const mockDocuments = [
  {
    id: "doc1",
    name: "Physics Notes.pdf",
    content: `
      Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.

      Classical physics, the description of physics that existed before the theory of relativity and quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, while quantum mechanics explains the aspects of nature at small (atomic and subatomic) scales, for which classical mechanics is insufficient.

      Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale.

      Quantum mechanics differs from classical physics in that energy, momentum, angular momentum, and other quantities of a bound system are restricted to discrete values (quantization), objects have characteristics of both particles and waves (wave-particle duality), and there are limits to how accurately the value of a physical quantity can be predicted prior to its measurement, given a complete set of initial conditions (the uncertainty principle).
    `,
    type: "PDF",
    chunks: [],
  },
  {
    id: "doc2",
    name: "Math Formulas.docx",
    content: `
      Differential equations are equations that relate a function with its derivatives. They are used to model various phenomena in physics, engineering, economics, and other domains.

      A first-order differential equation is an equation of the form F(x, y, y') = 0, where y' is the first derivative of y with respect to x.

      The general solution of a first-order differential equation involves an arbitrary constant. To find a particular solution, we need an initial condition, which specifies the value of y at a given value of x.

      A separable differential equation is a first-order differential equation that can be written in the form dy/dx = f(x)g(y), where f is a function of x only, and g is a function of y only.

      To solve a separable differential equation, we rewrite it as (1/g(y))dy = f(x)dx, and then integrate both sides.
    `,
    type: "DOCX",
    chunks: [],
  },
]

export async function POST(req: NextRequest) {
  try {
    const { query, documentIds } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Filter documents if documentIds are provided
    const relevantDocuments = documentIds ? mockDocuments.filter((doc) => documentIds.includes(doc.id)) : mockDocuments

    // Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks(query, relevantDocuments)

    // Generate response using RAG
    const response = await generateRAGResponse(query, relevantChunks)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
