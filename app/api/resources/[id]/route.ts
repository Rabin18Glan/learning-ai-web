import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Resource from "@/models/Resource"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }
    await connectToDatabase()
    const resource = await Resource.findById(id)
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }
    return NextResponse.json(resource)
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json({ error: error || "Failed to fetch resource" }, { status: 500 })
  }
}
