import dbConnect from '@/lib/db';
import Activity from '@/models/Activity';
import Chat from '@/models/Chat';
import Note from '@/models/Note';
import Resource from '@/models/Resource';
import Tasks from '@/models/Tasks';
import UserProgress from '@/models/UserProgress';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
   const params = context.params instanceof Promise ? await context.params : context.params
    const { id } = params
  try {
    const numberOfResources = (await Resource.find({ learningPathId: id })).length;
    const numberOfChats = (await Chat.find({ learningPathId: id })).length
    const tasks = (await Tasks.find({ learningPathId: id }));
    const recentActivities = await Activity.find({learningPathId:id});
    const summary = "This is the summary about the Document";
    const progress = await UserProgress.findOne({learningPathId:id})
     const numberOfNotes = (await Note.find({ learningPathId: id })).length
   
    const numberOfTaskCompleted = tasks.filter((task) => task.status === 'completed').length;
    const numberOfTaskRemained = tasks.filter((task) => task.status === 'pending').length;
    return NextResponse.json({ 
    numberOfChats, 
    numberOfResources,
    numberOfTaskCompleted,
    numberOfTaskRemained,
    recentActivities,
    summary,
    progress,
    numberOfNotes
     });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes.' }, { status: 500 });
  }
}

