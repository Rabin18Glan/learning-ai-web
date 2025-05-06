import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Send,
  FileText,
  MessageSquare,
  Network,
  Upload,
  ChevronRight,
  Lightbulb,
  BarChart3,
  BookMarked,
} from "lucide-react"

export default function DemoPage() {
  return (
 

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-10 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4 bg-background/80 backdrop-blur-sm">
                Interactive Demo
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Experience EduSense AI in Action
              </h1>
              <p className="text-muted-foreground md:text-xl mb-8 max-w-2xl mx-auto">
                Explore our key features without signing up. See how EduSense AI can transform your learning experience.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Tabs */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="chat" className="max-w-5xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="chat" className="flex flex-col items-center gap-2 py-3 md:flex-row md:gap-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chat</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex flex-col items-center gap-2 py-3 md:flex-row md:gap-3">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" className="flex flex-col items-center gap-2 py-3 md:flex-row md:gap-3">
                  <Network className="h-4 w-4" />
                  <span>Visualize</span>
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex flex-col items-center gap-2 py-3 md:flex-row md:gap-3">
                  <BookMarked className="h-4 w-4" />
                  <span>Learning</span>
                </TabsTrigger>
              </TabsList>

              {/* Chat Demo */}
              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Chat with EduSense AI
                    </CardTitle>
                    <CardDescription>
                      Ask questions about the sample documents and get intelligent responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="border-y bg-muted/40">
                      <div className="container py-4 px-4 md:px-6">
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                              <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg bg-muted p-3 flex-1">
                              <p>
                                Hello! I'm your EduSense AI assistant. I can help you understand concepts from your
                                documents. What would you like to learn about today?
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 justify-end">
                            <div className="rounded-lg bg-primary text-primary-foreground p-3 flex-1 max-w-[80%]">
                              <p>Can you explain the concept of machine learning in simple terms?</p>
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                              <AvatarFallback className="bg-secondary">U</AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                              <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg bg-muted p-3 flex-1">
                              <p>
                                Machine learning is a branch of artificial intelligence that allows computers to learn
                                from data without being explicitly programmed. Think of it like teaching a child:
                              </p>
                              <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>You show them examples (training data)</li>
                                <li>They recognize patterns (algorithm learning)</li>
                                <li>Eventually, they can identify new examples (predictions)</li>
                              </ul>
                              <p className="mt-2">
                                For instance, if you show a machine learning system thousands of cat photos, it will
                                learn to identify cats in new images it hasn't seen before. This is used in everything
                                from recommendation systems to self-driving cars!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center gap-2 p-4">
                    <Input placeholder="Ask a question about the sample documents..." className="flex-1" />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </CardFooter>
                </Card>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is a simulated chat. In the full version, you can chat about your own documents.
                  </p>
                  <Link href="/signup">
                    <Button>
                      Sign Up for Full Access
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              {/* Documents Demo */}
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Document Library
                    </CardTitle>
                    <CardDescription>Upload and manage your learning materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Sample Document 1 */}
                      <Card className="overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-primary/60" />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Introduction to Machine Learning</CardTitle>
                          <CardDescription className="text-xs">PDF • 24 pages • Uploaded 3 days ago</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline" className="bg-primary/5">
                            AI Ready
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Chat
                          </Button>
                        </CardFooter>
                      </Card>

                      {/* Sample Document 2 */}
                      <Card className="overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-primary/60" />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Data Structures & Algorithms</CardTitle>
                          <CardDescription className="text-xs">PDF • 42 pages • Uploaded 5 days ago</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline" className="bg-primary/5">
                            AI Ready
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Chat
                          </Button>
                        </CardFooter>
                      </Card>

                      {/* Sample Document 3 */}
                      <Card className="overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-primary/60" />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">Web Development Fundamentals</CardTitle>
                          <CardDescription className="text-xs">PDF • 36 pages • Uploaded 1 week ago</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Badge variant="outline" className="bg-primary/5">
                            AI Ready
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-8 gap-1">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Chat
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>

                    <div className="mt-6 border border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">Upload Your Documents</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Drag and drop your PDF, DOCX, or TXT files here
                      </p>
                      <Button variant="outline" disabled>
                        Browse Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">(Feature disabled in demo mode)</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Link href="/signup">
                      <Button>
                        Sign Up to Upload Your Documents
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Visualize Demo */}
              <TabsContent value="visualize" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-primary" />
                      Knowledge Visualization
                    </CardTitle>
                    <CardDescription>Visualize connections between concepts in your documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-lg overflow-hidden flex items-center justify-center mb-6">
                      <div className="text-center p-6">
                        <Network className="h-16 w-16 mx-auto mb-4 text-primary/60" />
                        <h3 className="text-lg font-medium mb-2">Interactive Knowledge Graph</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          In the full version, this area displays an interactive visualization of concepts and their
                          relationships from your documents.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" />
                            Key Concepts
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                              <span className="font-medium">Machine Learning</span>
                              <Badge>12 connections</Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="font-medium">Neural Networks</span>
                              <Badge>8 connections</Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="font-medium">Data Preprocessing</span>
                              <Badge>6 connections</Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="font-medium">Supervised Learning</span>
                              <Badge>5 connections</Badge>
                            </li>
                            <li className="flex items-center justify-between">
                              <span className="font-medium">Model Evaluation</span>
                              <Badge>4 connections</Badge>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-indigo-500" />
                            Topic Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Machine Learning Basics</span>
                                <span>35%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "35%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Neural Networks</span>
                                <span>25%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "25%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Data Science</span>
                                <span>20%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "20%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Algorithms</span>
                                <span>15%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "15%" }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Other Topics</span>
                                <span>5%</span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: "5%" }}></div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Link href="/signup">
                      <Button>
                        Sign Up for Interactive Visualizations
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Learning Demo */}
              <TabsContent value="learning" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5 text-primary" />
                      Learning Paths
                    </CardTitle>
                    <CardDescription>Personalized learning journeys based on your documents and goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Learning Path 1 */}
                      <Card className="overflow-hidden border-2 border-primary/20">
                        <div className="h-2 bg-gradient-to-r from-primary to-primary-foreground"></div>
                        <CardHeader>
                          <CardTitle>Machine Learning Fundamentals</CardTitle>
                          <CardDescription>A comprehensive introduction to machine learning concepts</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold">
                                1
                              </div>
                              <div>
                                <h4 className="font-medium">Introduction to ML Concepts</h4>
                                <p className="text-sm text-muted-foreground">
                                  Understanding the basics of machine learning
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background text-xs font-bold text-muted-foreground">
                                2
                              </div>
                              <div>
                                <h4 className="font-medium text-muted-foreground">Supervised Learning Techniques</h4>
                                <p className="text-sm text-muted-foreground">
                                  Classification and regression algorithms
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background text-xs font-bold text-muted-foreground">
                                3
                              </div>
                              <div>
                                <h4 className="font-medium text-muted-foreground">Neural Networks & Deep Learning</h4>
                                <p className="text-sm text-muted-foreground">Building and training neural networks</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span>Progress:</span>
                              <span className="font-medium">1/5 completed</span>
                            </div>
                            <div className="ml-auto flex h-2 w-16 overflow-hidden rounded-full bg-muted">
                              <div className="h-full bg-primary" style={{ width: "20%" }}></div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="outline">
                            Continue Learning
                          </Button>
                        </CardFooter>
                      </Card>

                      {/* Learning Path 2 */}
                      <Card className="overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                        <CardHeader>
                          <CardTitle>Web Development Essentials</CardTitle>
                          <CardDescription>Master the fundamentals of modern web development</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background text-xs font-bold text-muted-foreground">
                                1
                              </div>
                              <div>
                                <h4 className="font-medium text-muted-foreground">HTML & CSS Foundations</h4>
                                <p className="text-sm text-muted-foreground">Building blocks of web pages</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background text-xs font-bold text-muted-foreground">
                                2
                              </div>
                              <div>
                                <h4 className="font-medium text-muted-foreground">JavaScript Essentials</h4>
                                <p className="text-sm text-muted-foreground">Adding interactivity to websites</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted bg-background text-xs font-bold text-muted-foreground">
                                3
                              </div>
                              <div>
                                <h4 className="font-medium text-muted-foreground">Responsive Design</h4>
                                <p className="text-sm text-muted-foreground">
                                  Creating websites that work on all devices
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <span>Progress:</span>
                              <span className="font-medium">Not started</span>
                            </div>
                            <div className="ml-auto flex h-2 w-16 overflow-hidden rounded-full bg-muted">
                              <div className="h-full bg-primary" style={{ width: "0%" }}></div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button className="w-full" variant="outline">
                            Start Learning
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary/60" />
                      <h3 className="text-lg font-medium mb-1">Personalized Learning Paths</h3>
                      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                        In the full version, EduSense AI analyzes your documents and learning goals to create customized
                        learning paths just for you.
                      </p>
                      <Link href="/signup">
                        <Button>
                          Sign Up for Personalized Learning
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[85%]">
                Sign up now to unlock the full potential of EduSense AI with your own documents and personalized
                learning experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/signup">
                  <Button size="lg" className="min-w-[160px]">
                    Sign Up Free
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="min-w-[160px]">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required for free tier. Upgrade anytime.
              </p>
            </div>
          </div>
        </section>
      </main>


  )
}
