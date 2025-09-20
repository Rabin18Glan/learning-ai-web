import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
function HeroSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Your Personal AI Assistant
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Upload your learning materials and interact with an intelligent AI to understand content
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
            </div>
          </div>
          <div className="mx-auto lg:ml-auto flex items-center justify-center">

            <Link href={"/features"} className="flex flex-col items-center -space-y-32 md:-space-x-20 hover:animate-pulse">
              <img className="rounded-lg object-cover shadow-xl shadow-gray-500 w-96 md:w-96 lg:w-max" src="/overview.png" alt="" />

              <img className="rounded-lg object-cover shadow-xl shadow-gray-500 w-80 md:w-96 lg:w-max" src="/documents.png" alt="" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection