"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, BookOpen, Home, Settings } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface DashboardNavProps {
  onNavItemClick?: () => void
}

export function DashboardNav({ onNavItemClick }: DashboardNavProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Learnings",
      href: "/learnings",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  const handleClick = () => {
    if (onNavItemClick) {
      onNavItemClick()
    }
  }

  return (
    <ScrollArea className="h-full py-6">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname.startsWith(item.href) ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
              )}
              asChild
              onClick={handleClick}
            >
              <Link href={item.href}>
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
