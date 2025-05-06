import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, MessageSquare } from "lucide-react"

export default function Home() {
  return (

      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Personal AI Tutor
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Upload your learning materials and interact with an intelligent AI tutor to understand content
                    deeply.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button size="lg" variant="outline">
                      Try Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex items-center justify-center">
           
                  <Link href={"/features"} className="flex flex-col items-center -space-y-32 md:-space-x-20 hover:animate-pulse">
  <img className="rounded-lg object-cover shadow-xl shadow-gray-500 w-96 md:w-96 lg:w-max"   src="/analytics.png" alt=""/>

  <img className="rounded-lg object-cover shadow-xl shadow-gray-500 w-80 md:w-96 lg:w-max"  src="/learning.png" alt=""/>
</Link>

              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to enhance your learning experience
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border-none p-6 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-4 mb-2">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Document Upload & Parsing</h3>
                <p className="text-center text-muted-foreground">
                  Upload PDFs, images, and DOCX files. Extract and store meaningful content.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-none p-6 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-4 mb-2">
                  <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">Contextual Q&A</h3>
                <p className="text-center text-muted-foreground">
                  Ask questions about your documents and get accurate, contextual answers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border-none p-6 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 p-4 mb-2">
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
                    className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Voice Interaction</h3>
                <p className="text-center text-muted-foreground">
                  Have natural conversations with your AI tutor using voice.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

   
  )
}
