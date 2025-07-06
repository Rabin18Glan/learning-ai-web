import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectToDatabase from "@/lib/db"
import Resource from "@/models/Resource"
import mongoose from "mongoose"
import { getServerSession } from "next-auth/next"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    await connectToDatabase()
    
    const resource = await Resource.findById(id)
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: resource
    })
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch resource" 
      }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    console.log('Deleting resource with ID:', id)
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    await connectToDatabase()

    const resource = await Resource.findByIdAndDelete(id)
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
      data: resource
    })
  } catch (error) {
    console.error("Error deleting resource:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to delete resource" 
      }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    const body = await req.json()
    
    await connectToDatabase()

    const resource = await Resource.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    )
    
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: resource
    })
  } catch (error) {
    console.error("Error updating resource:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update resource" 
      }, 
      { status: 500 }
    )
  }
}

// Optional: Add PATCH method for partial updates
export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing properties
    const { id } = await params
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid resource ID" }, { status: 400 })
    }

    const body = await req.json()
    
    await connectToDatabase()

    const resource = await Resource.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    )
    
    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Resource updated successfully",
      data: resource
    })
  } catch (error) {
    console.error("Error patching resource:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to update resource" 
      }, 
      { status: 500 }
    )
  }
}