import dbConnect from '@/lib/db';
import Activity from '@/models/Activity';
import Chat from '@/models/Chat';
import Resource from '@/models/Resource';
import Tasks from '@/models/Tasks';
import UserProgress from '@/models/UserProgress';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  try {
    const numberOfResources = (await Resource.find({ learningPathId: id })).length;
    const numberOfChats = (await Chat.find({ learningPathId: id })).length
    const numberOfTaskCompleted = (await Tasks.find({ learningPathId: id })).length;
    const numberOfTaskRemained = (await Tasks.find({ learningPathId: id })).length;
    const recentActivities = await Activity.find({learningPathId:id});
    const summary = "This is the summary about the Document";
    const progress = await UserProgress.find({learningPathId:id})
    return NextResponse.json({ 
    numberOfChats,
    numberOfResources,
    numberOfTaskCompleted,
    numberOfTaskRemained,
    recentActivities,
    summary,
    progress
     });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes.' }, { status: 500 });
  }
}

