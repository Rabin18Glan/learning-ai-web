import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { loadDocument } from '@/lib/agent/document_loader';
import { structuredLLM } from '@/lib/agent/model';
import dbConnect from '@/lib/db';
import Resource, { IResource } from '@/models/Resource';
import Visualization, { IVisualization } from '@/models/Visualization';
import { GraphDataSchema } from '@/validations/graph-schema';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Activity from '@/models/Activity';  

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const params = context.params instanceof Promise ? await context.params : context.params
  const { id } = params
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // Extract visualization type from query params

  try {
    const query: { learningPathId: string; visualizationType?: string } = { learningPathId: id };
    if (type) {
      query.visualizationType = type; // Add type filter if provided
    }

    const visualizations = await Visualization.find(query);
    return NextResponse.json({ visualizations });
  } catch (error) {
    console.error('Error fetching visualizations:', error);
    return NextResponse.json({ error: 'Failed to fetch visualizations.' }, { status: 500 });
  }
}

// POST: Create a new visualization for a learning path
export async function POST(req: NextRequest, context: { params: { id: string } }) {
  await dbConnect();
  const params = context.params instanceof Promise ? await context.params : context.params
  const { id } = params
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    // Parse request body to get visualization type
    const body = await req.json();
    const { type } = z
      .object({
        type: z.enum(['knowledge-graph', 'mindmap', 'dataflow-diagram']),
      })
      .parse(body);

    // Fetch resources for the learning path
    const resources: IResource[] = await Resource.find({ learningPathId: id });
    if (!resources.length) {
      return NextResponse.json({ error: 'No resources found for the learning path.' }, { status: 404 });
    }

    // Process resources to create document context
    let documentContext = '';
    for (const resource of resources) {
      const documents = await loadDocument(resource);
      documents.forEach(doc => {
        documentContext += `
             ${doc.id}
              ${doc.metadata}
            ${doc.pageContent} \n`
      });
    }

    // Generate visualization data using structuredLLM
    const parsedData = await structuredLLM.invoke(documentContext, {
      metadata: { type }
    });



    // Map visualization type to layout
    const layoutMap: Record<string, IVisualization['layout']> = {
      'knowledge-graph': 'force',
      mindmap: 'hierarchical',
      'dataflow-diagram': 'dag',
    };

    // Create and save the visualization
    const visualization = await Visualization.create({
      learningPathId: id,
      title: parsedData.metadata?.title || `Visualization for Learning Path ${id}`,
      description: parsedData.metadata?.description,
      userId: session.user.id,
      visualizationType: type,
      nodes: parsedData.nodes,
      edges: parsedData.edges,
      layout: layoutMap[type],
      settings: {
        theme: 'light',
        showLabels: true,
        nodeSize: 'variable',
        edgeWidth: 'variable',
        highlightConnections: true,
        groupClusters: false,
      },
      isPublic: false,
      viewCount: 0,
    });

   
    await Activity.create({
      userId: session.user.id,
      learningPathId: id,
      type: 'visualization',
      action: 'created',
      details: `Created a ${type} visualization titled "${visualization.title}"`,
    });

    return NextResponse.json({ visualization }, { status: 201 });
  } catch (error) {
    console.error('Error creating visualization:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid visualization data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create visualization.' }, { status: 500 });
  }
}
