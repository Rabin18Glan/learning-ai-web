import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Note from '@/models/Note';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const notes = await Note.find({ learningPath: id });
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  const { content, user } = await req.json();
  try {
    const note = new Note({ learningPath: id, content, user });
    await note.save();
    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save note.' }, { status: 500 });
  }
}
