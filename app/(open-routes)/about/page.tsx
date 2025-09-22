import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Github, Linkedin, Mail, Twitter } from "lucide-react"

export default function AboutPage() {
  return (
 

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              About <span className="text-primary">EduSense AI</span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground text-lg md:text-xl mb-8">
              Our mission is to transform education through AI, making learning more accessible, personalized, and
              effective for everyone.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    EduSense AI was founded in 2023 by a team of educators, AI researchers, and learning scientists who
                    shared a vision: to harness the power of artificial intelligence to make education more personalized
                    and effective.
                  </p>
                  <p>
                    We recognized that traditional learning methods often fail to adapt to individual needs, leaving
                    many students struggling to grasp complex concepts. Our team set out to create an AI-powered
                    learning companion that could understand each student's unique learning style and provide tailored
                    guidance.
                  </p>
                  <p>
                    After years of research and development, we launched EduSense AI with a mission to democratize
                    access to high-quality education and empower learners of all backgrounds to achieve their full
                    potential.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl opacity-50"></div>
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="EduSense AI Team"
                  className="relative rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-primary"
                      >
                        <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
                        <path d="M12 13v8" />
                        <path d="M5 13v6a2 2 0 0 0 2 2h12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Accessibility</h3>
                    <p className="text-muted-foreground">
                      We believe quality education should be accessible to everyone, regardless of background or
                      circumstances.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Value 2 */}
              <Card className="border-none shadow-md bg-gradient-to-br from-purple-50 to-pink-50/70 dark:from-purple-950/40 dark:to-pink-950/40">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-primary"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Innovation</h3>
                    <p className="text-muted-foreground">
                      We continuously push the boundaries of what's possible with AI to create better learning
                      experiences.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Value 3 */}
              <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50/70 dark:from-emerald-950/40 dark:to-teal-950/40">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-primary"
                      >
                        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Empathy</h3>
                    <p className="text-muted-foreground">
                      We design with deep understanding of learners' needs, challenges, and aspirations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Meet the passionate individuals behind EduSense AI
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                  <img
                    src="/placeholder.svg?height=160&width=160"
                    alt="Sarah Johnson"
                    className="rounded-full object-cover w-full h-full relative border-2 border-background"
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-primary font-medium">CEO & Co-Founder</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Former education researcher with a passion for AI-powered learning
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </div>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                  <img
                    src="/placeholder.svg?height=160&width=160"
                    alt="Michael Chen"
                    className="rounded-full object-cover w-full h-full relative border-2 border-background"
                  />
                </div>
                <h3 className="text-xl font-bold">Michael Chen</h3>
                <p className="text-primary font-medium">CTO & Co-Founder</p>
                <p className="text-muted-foreground text-sm mt-2">
                  AI researcher with expertise in natural language processing
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </div>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                  <img
                    src="/placeholder.svg?height=160&width=160"
                    alt="Aisha Patel"
                    className="rounded-full object-cover w-full h-full relative border-2 border-background"
                  />
                </div>
                <h3 className="text-xl font-bold">Aisha Patel</h3>
                <p className="text-primary font-medium">Head of Product</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Former teacher with a decade of experience in EdTech
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </a>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-40 h-40 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-sm"></div>
                  <img
                    src="/placeholder.svg?height=160&width=160"
                    alt="David Rodriguez"
                    className="rounded-full object-cover w-full h-full relative border-2 border-background"
                  />
                </div>
                <h3 className="text-xl font-bold">David Rodriguez</h3>
                <p className="text-primary font-medium">Lead Engineer</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Full-stack developer specializing in AI applications
                </p>
                <div className="flex gap-2 mt-3">
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Our Journey</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                The key milestones in our mission to transform education
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Timeline Item 1 */}
              <div className="flex gap-4 mb-12">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div className="w-0.5 bg-border flex-1 my-2"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">2023 - Foundation</h3>
                  <p className="text-muted-foreground mt-2">
                    EduSense AI was founded by a team of educators and AI researchers with a vision to transform
                    learning through artificial intelligence.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex gap-4 mb-12">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div className="w-0.5 bg-border flex-1 my-2"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">2023 - Beta Launch</h3>
                  <p className="text-muted-foreground mt-2">
                    After months of development, we launched our beta version to a select group of students and
                    educators, gathering valuable feedback.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex gap-4 mb-12">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div className="w-0.5 bg-border flex-1 my-2"></div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">2024 - Official Launch</h3>
                  <p className="text-muted-foreground mt-2">
                    EduSense AI officially launched to the public, offering AI-powered tutoring and document analysis to
                    learners worldwide.
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold">2024 - Present</h3>
                  <p className="text-muted-foreground mt-2">
                    Today, we're continuously improving our platform, adding new features, and expanding our reach to
                    help more learners achieve their educational goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="max-w-[900px] mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Join Us on Our Mission
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Be part of the education revolution. Start your learning journey with EduSense AI today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/learnings">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

     
  )
}
