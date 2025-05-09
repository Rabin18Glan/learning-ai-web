import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LearningPath from "@/models/LearningPath"
import mongoose from "mongoose"
import  connectToDatabase  from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    await connectToDatabase()

    const learningPath = await LearningPath.findById(id)
      .populate("creatorId", "name email image")
      .populate("collaborators", "name email image")

    if (!learningPath) {
      return NextResponse.json({ error: "Learning path not found" }, { status: 404 })
    }

    // Check if user has access to this learning path
    const userId = session.user.id
    const isCreator = learningPath.creatorId._id.toString() === userId
    const isCollaborator = learningPath.collaborators.some((collab: any) => collab._id.toString() === userId)

    if (!isCreator && !isCollaborator && !learningPath.isPublic) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json(learningPath)
  } catch (error) {
    console.error("Error fetching learning path:", error)
    return NextResponse.json({ error: "Failed to fetch learning path" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const userId = session.user.id

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
    const isCreator = learningPath.creatorId.toString() === userId
    const isCollaborator = learningPath.collaborators.includes(userId)

    if (!isCreator && !isCollaborator) {
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const userId = session.user.id

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
    if (learningPath.creatorId.toString() !== userId) {
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
