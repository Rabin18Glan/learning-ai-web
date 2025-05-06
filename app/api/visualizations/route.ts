import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Visualization from "@/models/Visualization"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("documentId")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    await connectDB()

    // Build filter
    const filter: any = { userId: session.user.id }

    if (documentId) {
      filter.documentIds = documentId
    }

    if (type) {
      filter.visualizationType = type
    }

    // Get visualizations
    const visualizations = await Visualization.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Get total count
    const total = await Visualization.countDocuments(filter)

    return NextResponse.json({
      visualizations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching visualizations:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.title || !data.visualizationType || !data.documentIds || !data.nodes || !data.edges) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Create visualization
    const visualization = new Visualization({
      ...data,
      userId: session.user.id,
    })

    await visualization.save()

    return NextResponse.json(visualization, { status: 201 })
  } catch (error: any) {
    console.error("Error creating visualization:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
