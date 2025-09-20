import UserHeader from "@/components/common/layouts/user-header"
import type { Metadata } from "next"
import type React from "react"


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
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
