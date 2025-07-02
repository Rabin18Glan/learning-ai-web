import FeatureCard from "../../../../components/feature-card"
import { features } from "../../../../lib/data/features"


function KeyFeatureSection() {
  return (
   <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Key Features</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Everything you need to enhance your learning experience and master complex subjects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature,index)=>{
                return <FeatureCard key={index}  feature={feature}/>
              })}
      
            </div>
          </div>
        </section>
  )
}

export default KeyFeatureSection