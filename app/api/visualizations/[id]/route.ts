import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import connectDB from "@/lib/db"
import Visualization from "@/models/Visualization"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const visualization = await Visualization.findById(params.id)

    if (!visualization) {
      return NextResponse.json({ error: "Visualization not found" }, { status: 404 })
    }

    // Check if user owns the visualization or if it's public
    if (visualization.userId.toString() !== session.user.id && !visualization.isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Increment view count if not the owner
    if (visualization.userId.toString() !== session.user.id) {
      visualization.viewCount += 1
      await visualization.save()
    }

    return NextResponse.json(visualization)
  } catch (error: any) {
    console.error("Error fetching visualization:", error)
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

    const visualization = await Visualization.findById(params.id)

    if (!visualization) {
      return NextResponse.json({ error: "Visualization not found" }, { status: 404 })
    }

    // Check if user owns the visualization
    if (visualization.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update visualization
    Object.assign(visualization, data)
    await visualization.save()

    return NextResponse.json(visualization)
  } catch (error: any) {
    console.error("Error updating visualization:", error)
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

    const visualization = await Visualization.findById(params.id)

    if (!visualization) {
      return NextResponse.json({ error: "Visualization not found" }, { status: 404 })
    }

    // Check if user owns the visualization
    if (visualization.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete visualization
    await Visualization.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting visualization:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
