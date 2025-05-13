import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserProgress from '@/models/UserProgress';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const progress = await UserProgress.find({ learningPath: id });
    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress.' }, { status: 500 });
  }
}
