import dbConnect from '@/lib/db'
import Note, { INote } from '@/models/Note'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect()
  const { id} = await context.params

  try {
    const notes = await Note.find({ learningPathId:id })
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

  // console.log(await req.json())

  try {
    const newNote: INote = await Note.create({
      learningPathId:id,
      userId,
      content,
      title,
    })

    return NextResponse.json(newNote)
  } catch (error) {
    console.error("This is the error:", error)
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 })
  }
}
