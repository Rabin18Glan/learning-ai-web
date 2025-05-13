import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visualization from '@/models/Visualization';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const visualizations = await Visualization.find({ learningPath: id });
    return NextResponse.json({ visualizations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch visualizations.' }, { status: 500 });
  }
}
