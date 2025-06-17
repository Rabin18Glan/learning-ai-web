import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LearningPath from "@/models/LearningPath"
import mongoose from "mongoose"
import connectToDatabase from "@/lib/db"

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params = context.params instanceof Promise ? await context.params : context.params
    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await connectToDatabase()

    // Populate resources for normalized model
    const learningPath = await LearningPath.findById(id)
      .populate("creatorId", "name email image")
      .populate("collaborators", "name email image")
      .lean()
      

    let lp = learningPath
    if (Array.isArray(lp)) {
      if (!lp[0]) {
        return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
      }
      lp = lp[0]
    }

    if (!lp) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
    }

    // Do NOT fetch or attach resources here. Only return the learning path meta info.
    // If you want to keep collaborators, that's fine, but do not attach resources.

    // Use unique variable names to avoid redeclaration
    const userIdMeta = session.user.id
    const isCreatorMeta = lp.creatorId._id.toString() === userIdMeta
    const isCollaboratorMeta = lp.collaborators.some((collab: any) => collab._id.toString() === userIdMeta)

    if (!isCreatorMeta && !isCollaboratorMeta && !lp.isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(lp)
  } catch (error) {
    console.error("Error fetching learning path:", error)
    return NextResponse.json({ error: "Failed to fetch learning path" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params = context.params instanceof Promise ? await context.params : context.params
    const { id } = params
    const userIdPut = session.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const updates = await req.json()

    await connectToDatabase()

    // Find the learning path
    const learningPath = await LearningPath.findById(id)

    if (!learningPath) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
    }

    // Check if user is the creator or a collaborator
    const isCreatorPut = learningPath.creatorId.toString() === userIdPut
    const isCollaboratorPut = learningPath.collaborators.includes(userIdPut)

    if (!isCreatorPut && !isCollaboratorPut) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update the learning path
    const updatedLearningPath = await LearningPath.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    )

    return NextResponse.json(updatedLearningPath)
  } catch (error) {
    console.error("Error updating learning path:", error)
    return NextResponse.json({ error: "Failed to update learning path" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params if it's a Promise (Next.js 14+ App Router API)
    const params = context.params instanceof Promise ? await context.params : context.params
    const { id } = params
    const userIdDelete = session.user.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await connectToDatabase()

    // Find the learning path
    const learningPath = await LearningPath.findById(id)

    if (!learningPath) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
    }

    // Check if user is the creator
    if (learningPath.creatorId.toString() !== userIdDelete) {
      return NextResponse.json({ error: "Only the creator can delete a learning path" }, { status: 403 })
    }

    // Delete the learning path
    await LearningPath.findByIdAndDelete(id)

    // TODO: Delete associated vector store data

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting learning path:", error)
    return NextResponse.json({ error: "Failed to delete learning path" }, { status: 500 })
  }
}
