import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import LearningPath from "@/models/LearningPath"
import { connectToDatabase } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const userId = session.user.id

    // Get query parameters
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const isPublic = url.searchParams.get("public") === "true"

    await connectToDatabase()

    // Build query
    const query: any = {}

    if (isPublic) {
      query.isPublic = true
    } else {
      // Show user's own paths and paths where they are a collaborator
      query.$or = [{ creatorId: userId }, { collaborators: userId }]
    }

    // Get total count for pagination
    const total = await LearningPath.countDocuments(query)

    // Get learning paths
    const learningPaths = await LearningPath.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("title description coverImage tags creatorId isPublic createdAt updatedAt")
      .populate("creatorId", "name email image")

    return NextResponse.json({
      learningPaths,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching learning paths:", error)
    return NextResponse.json({ error: "Failed to fetch learning paths" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { title, description, tags, isPublic, coverImage } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    await connectToDatabase()

    const learningPath = new LearningPath({
      title,
      description,
      tags: tags || [],
      isPublic: isPublic || false,
      coverImage,
      creatorId: userId,
      sections: [],
      resources: [],
    })

    await learningPath.save()

    return NextResponse.json(learningPath, { status: 201 })
  } catch (error) {
    console.error("Error creating learning path:", error)
    return NextResponse.json({ error: "Failed to create learning path" }, { status: 500 })
  }
}
