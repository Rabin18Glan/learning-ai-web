import React, { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Brain, CheckCircle2, FileText, MessageSquare, Sparkles, Zap } from "lucide-react"
import { Feature } from '../types/feature';



interface FeatureCardProps{
    feature:Feature,
    className?:string
}
function FeatureCard({className,feature}:FeatureCardProps) {
  const {description,icon,keyFeature,title} = feature;
  return (
       <Card className={`border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 overflow-hidden ${className}`}>
                <CardHeader className="pb-2">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                  {description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {keyFeature.map((feat,index)=>{
                         return    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feat}</span>
                    </li>
                    })}
                   
                  </ul>
                </CardContent>
              </Card>
  )
}

export default FeatureCard