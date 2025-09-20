import dbConnect from '@/lib/db'
import Note, { INote } from '@/models/Note'
import Activity, { ActivityArea, ActivityType } from '@/models/Activity'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id } = await context.params

  try {
    const session = await getServerSession(authOptions)
    const notes = await Note.find({ learningPathId: id })

    // ✅ log activity if user is authenticated
    if (session?.user) {
      await Activity.create({
        learningPathId: id,
        userId: session.user.id,
        area: ActivityArea.NOTE,
        type: ActivityType.VIEWED,
        description: `Viewed ${notes.length} note(s)`,
      })
    }

    return NextResponse.json(notes)
  } catch (error) {
    console.error("GET /api/:learningPathId/notes error:", error)
    return NextResponse.json({ error: 'Failed to fetch notes.' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id } = await context.params
  const { content, userId, title } = await req.json()

  try {
    const newNote: INote = await Note.create({
      learningPathId: id,
      userId,
      content,
      title,
    })

    // ✅ log activity after note creation
    await Activity.create({
      learningPathId: id,
      userId,
      area: ActivityArea.NOTE,
      type: ActivityType.ADDED,
      description: `Added note: ${title || "Untitled"}`,
    })

    return NextResponse.json(newNote)
  } catch (error) {
    console.error("This is the error:", error)
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 })
  }
}


export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id } = await context.params
  const { noteId } = await req.json()

  try {
   const note =  await Note.deleteOne({id:noteId })
 
     const session = await getServerSession(authOptions)
    await Activity.create({
      learningPathId: id,
      userId:session?.user.id,
      area: ActivityArea.NOTE,
      type: ActivityType.ADDED,
      description: `$${noteId} Noted Deleted`,
    })

    return NextResponse.json(
      {
        success:true
      }
    )
  } catch (error) {
    console.error("This is the error:", error)
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 })
  }
}
