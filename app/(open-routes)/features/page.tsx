import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, FileText, MessageSquare, BookOpen, Brain, Zap, Sparkles, BarChart3 } from "lucide-react"

export default function FeaturesPage() {
  return (
    

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              Powerful Features for <span className="text-primary">Smarter Learning</span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground text-lg md:text-xl mb-8">
              Discover how EduSense AI transforms your learning experience with cutting-edge AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Key Features</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Everything you need to enhance your learning experience and master complex subjects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Document Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload PDFs, DOCs, and images. Our AI extracts key concepts and creates a knowledge base from your
                    materials.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Multiple file format support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Automatic text extraction</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Content organization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50/70 dark:from-purple-950/40 dark:to-pink-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">AI Tutoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Chat with an AI tutor that understands your documents and helps you learn through conversation.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Contextual answers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Personalized explanations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>24/7 learning assistance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Knowledge Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Visualize complex topics with interactive mind maps and knowledge graphs to enhance understanding.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Interactive mind maps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Concept relationships</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Visual learning aids</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50/70 dark:from-amber-950/40 dark:to-orange-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Voice Interaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Speak naturally with your AI tutor using advanced voice recognition and text-to-speech technology.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Natural conversations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Hands-free learning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Accessibility support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-rose-50 to-red-50/70 dark:from-rose-950/40 dark:to-red-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get customized learning paths and recommendations based on your progress and learning style.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Adaptive learning paths</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Progress tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Smart recommendations</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-sky-50 to-cyan-50/70 dark:from-sky-950/40 dark:to-cyan-950/40 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Learning Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your learning progress with detailed analytics and insights to optimize your study time.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Performance metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Study time analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Knowledge gap identification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Get started with EduSense AI in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Upload Your Documents</h3>
                <p className="text-muted-foreground">
                  Upload your study materials, textbooks, notes, or any learning content in various formats.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">AI Processes Content</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your documents, extracts key concepts, and builds a personalized knowledge base.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Start Learning</h3>
                <p className="text-muted-foreground">
                  Chat with your AI tutor, explore visualizations, and accelerate your learning journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-[900px] mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of students who are learning smarter, not harder, with EduSense AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

  )
}
