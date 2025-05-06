import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Document from "@/models/Document"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("query") || ""
    const tag = searchParams.get("tag") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    await connectDB()

    // Build filter
    const filter: any = { userId: session.user.id }

    if (tag) {
      filter.tags = tag
    }

    if (query) {
      filter.$text = { $search: query }
    }

    // Get documents
    const documents = await Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)

    // Get total count
    const total = await Document.countDocuments(filter)

    return NextResponse.json({
      documents,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error("Error fetching documents:", error)
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
    if (!data.title || !data.fileUrl || !data.fileType || !data.fileSize) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectDB()

    // Create document
    const document = new Document({
      ...data,
      userId: session.user.id,
      status: "processing",
    })

    await document.save()

    return NextResponse.json(document, { status: 201 })
  } catch (error: any) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
