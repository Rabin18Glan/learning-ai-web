import FeatureCard from "@/components/feature-card"
import { keyFeatures } from "@/lib/data/features"

function KeyFeatureSection() {
  return (
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
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 mt-8">
          {
            keyFeatures.map((feature, index) => {
              return <FeatureCard key={index} feature={feature} />
            })
          }
        </div>
      </div>
    </section>
  )
}

export default KeyFeatureSection