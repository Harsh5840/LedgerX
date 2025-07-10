"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  BarChart3,
  Brain,
  Users,
  Shield,
  AlertTriangle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Wallet,
  Activity,
  Settings,
  HelpCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  userRole: "USER" | "ADMIN"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "My Accounts",
      href: "/accounts",
      icon: Wallet,
    },
    {
      title: "Transactions",
      href: "/transactions",
      icon: Activity,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "NLP Assistant",
      href: "/nlp",
      icon: Brain,
    },
  ]

  const adminNavItems = [
    {
      title: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users & Accounts",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: Activity,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Fraud Check",
      href: "/admin/fraud",
      icon: Shield,
    },
    {
      title: "Risk Assessment",
      href: "/admin/risk",
      icon: AlertTriangle,
    },
    {
      title: "NLP Assistant",
      href: "/admin/nlp",
      icon: Brain,
    },
  ]

  const navItems = userRole === "ADMIN" ? adminNavItems : userNavItems

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "Redirecting to homepage...",
    })
    router.push("/")
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-800 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 dark:border-slate-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-sm">LX</span>
            </div>
            <span className="text-xl font-bold text-white">LedgerX</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800",
                    collapsed && "px-2",
                    isActive && "bg-slate-800 text-white",
                  )}
                >
                  <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 dark:border-slate-800 space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800", collapsed && "px-2")}
        >
          <Settings className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Settings</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800", collapsed && "px-2")}
        >
          <HelpCircle className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Help</span>}
        </Button>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn("w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950", collapsed && "px-2")}
        >
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
