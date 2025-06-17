import { workflowSteps } from "../_data/workflow-steps"
import WorkFlowCard from "./work-flow-card"


function WorkFlowSection() {
  return (
     <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-blue-50/30 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-blue-950/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
                Get started with EduSense AI in just a few simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {
            workflowSteps.map((workFlow,index)=>{
              return <WorkFlowCard key={index} workFlow={workFlow} stepNumber={index+1}/>
            })
           }
            </div>
          </div>
        </section>
  )
}

export default WorkFlowSection