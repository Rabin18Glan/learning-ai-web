import { Button } from "@/components/ui/button"
import Link from "next/link"

function CallToActionSection() {
  return (
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
  )
}

export default CallToActionSection