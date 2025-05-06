import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Document from "@/models/Document"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user owns the document or if document is public
    if (document.userId.toString() !== session.user.id && !document.isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Increment view count if not the owner
    if (document.userId.toString() !== session.user.id) {
      document.viewCount += 1
      await document.save()
    }

    return NextResponse.json(document)
  } catch (error: any) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    await connectDB()

    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user owns the document
    if (document.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update document
    Object.assign(document, data)
    await document.save()

    return NextResponse.json(document)
  } catch (error: any) {
    console.error("Error updating document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const document = await Document.findById(params.id)

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check if user owns the document
    if (document.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete document
    await Document.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting document:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
