import type React from "react"
import type { Metadata } from "next"
import { DashboardNav } from "@/components/dashboard-nav"
import UserHeader from "@/components/layout-components/user-header"

export const metadata: Metadata = {
  title: "Dashboard | EduSense AI",
  description: "Manage your learning materials and interact with your AI tutor",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <div className="flex min-h-screen flex-col">
     <UserHeader />
      <div className="flex flex-1">
        <aside className="hidden md:block w-64 border-r bg-gradient-to-b from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <DashboardNav />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
