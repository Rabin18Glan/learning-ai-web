import { Button } from "@/components/ui/button"
import Link from "next/link"

function HeroSection() {
  return (
  <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl mb-6">
              Powerful Features for <span className="text-primary">Smarter Learning</span>
            </h1>
            <p className="max-w-[800px] mx-auto text-muted-foreground text-lg md:text-xl mb-8">
              Discover how EduSense AI transforms your learning experience with cutting-edge AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/learnings">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
          
            </div>
          </div>
        </section>
  )
}

export default HeroSection