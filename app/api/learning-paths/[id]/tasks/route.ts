import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserProgress from '@/models/UserProgress';
import Tasks from '@/models/Tasks';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } =await  params;
  try {
    const progress = await Tasks.find({ learningPathId: id });
    return NextResponse.json({ tasks:progress });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress.' }, { status: 500 });
  }
}
