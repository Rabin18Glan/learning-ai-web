"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import  UserIcon  from "@/components/ui/user-icon"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function UserNav() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  // Optional: For debugging
  console.log("Session status:", status)
  console.log("Session data:", session)
  
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          
          <UserIcon />
              {status === "authenticated" && session?.user?.name 
                ? session.user.name.charAt(0) 
                : "?"}
         
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          {status === "authenticated" && session?.user ? (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Not signed in</p>
              <p className="text-xs leading-none text-muted-foreground">Sign in to access all features</p>
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>Profile</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/subscription")}>Subscription</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      
        {status === "authenticated" ? (
          <DropdownMenuItem    onClick={handleLogout}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/login")}>Log in</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}