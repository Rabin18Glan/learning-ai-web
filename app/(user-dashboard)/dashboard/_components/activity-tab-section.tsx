"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import OverviewTab from "./overview-tab"
import ProgressTab from "./progress-tab"
import RecentTab from "./recent-tab"

function ActivityTabSection() {
     const [activeTab, setActiveTab] = useState("overview")

  return (
   <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
        </TabsList>
       <OverviewTab />
       <RecentTab />
       <ProgressTab />

      </Tabs>
  )
}

export default ActivityTabSection