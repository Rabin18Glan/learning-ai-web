import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Resource from "@/models/Resource"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    await connectToDatabase()
    const resources = await Resource.find({})
    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching all resources:", error)
    return NextResponse.json({ error: error || "Failed to fetch resources" }, { status: 500 })
  }
}
