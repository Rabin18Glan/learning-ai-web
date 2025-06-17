import React from 'react'
import { WorkFlowStep } from '../_data/workflow-steps'

interface WorkFlowCardProps{
    stepNumber:number,
    workFlow:WorkFlowStep,
    className?:string
}
function WorkFlowCard({workFlow,className,stepNumber}:WorkFlowCardProps) {
    const {description,title} = workFlow;
  return (
        <div className={`flex flex-col items-center text-center ${className}`}>
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-primary">{stepNumber}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground">
                 {description}
                </p>
              </div>
  )
}

export default WorkFlowCard