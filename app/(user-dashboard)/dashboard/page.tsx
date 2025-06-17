import { Button } from "@/components/ui/button"
import Link from "next/link"
import ActivityTabSection from "./_components/activity-tab-section"
import MetricesSection from "./_components/metrices-section"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/learnings">
            <Button>My Learnings</Button>
          </Link>
        </div>
      </div>
      <MetricesSection />
      <ActivityTabSection />
    </div>
  )
}
