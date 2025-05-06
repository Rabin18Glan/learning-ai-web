import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Tabs, TabsList } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Visualization | EduSense AI",
  description: "Visualize your learning materials",
}

export default async function VisualizationPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // In a real app, you would fetch the document and visualization data from an API
  const documentId = params.id;
  const documentTitle = "Introduction to Machine Learning";

  // Mock data for visualization
  const concepts = [
    { id: "1", name: "Machine Learning", description: "A field of AI that enables systems to learn from data" },
    { id: "2", name: "Supervised Learning", description: "Learning with labeled training data" },
    { id: "3", name: "Unsupervised Learning", description: "Learning from unlabeled data" },
    { id: "4", name: "Neural Networks", description: "Computing systems inspired by biological neural networks" },
    { id: "5", name: "Deep Learning", description: "Neural networks with multiple layers" },
    { id: "6", name: "Reinforcement Learning", description: "Learning through interaction with an environment" },
    { id: "7", name: "Classification", description: "Predicting discrete class labels" },
    { id: "8", name: "Regression", description: "Predicting continuous values" },
  ];

  const relationships = [
    { source: "1", target: "2", label: "includes" },
    { source: "1", target: "3", label: "includes" },
    { source: "1", target: "6", label: "includes" },
    { source: "4", target: "5", label: "enables" },
    { source: "2", target: "7", label: "used for" },
    { source: "2", target: "8", label: "used for" },
    { source: "5", target: "4", label: "type of" },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/learnings/documents">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Visualization</h1>
            <p className="text-muted-foreground">
              Document: {documentTitle}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="mindmap" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3">\
