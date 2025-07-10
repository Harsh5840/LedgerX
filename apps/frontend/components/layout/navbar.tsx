"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface NavbarProps {
  userRole: "USER" | "ADMIN"
  userName?: string
}

export function Navbar({ userRole, userName = "John Doe" }: NavbarProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "Redirecting to homepage...",
    })
    router.push("/")
  }

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions, users..."
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-white">{userName}</p>
                <p className="text-xs leading-none text-slate-600 dark:text-slate-400">
                  {userRole === "ADMIN" ? "Administrator" : "User"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
