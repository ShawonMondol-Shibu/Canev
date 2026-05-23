"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
} from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { useState } from "react"
import { currentUser } from "@/lib/mock-data"
import { authClient } from "@/lib/auth-client"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Board", href: "/dashboard/board", icon: Kanban },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Members", href: "/dashboard/members", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-200",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="font-heading text-lg font-bold tracking-wider">
            CANEV
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "rounded-md p-1.5 transition-colors hover:bg-sidebar-accent",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/50">
          {!collapsed && "Main"}
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center border-l-0 px-2"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="size-4 shrink-0" />
              {!collapsed && item.name}
            </Link>
          )
        })}
      </nav>

      <div className={cn("border-t border-sidebar-border p-3", collapsed && "flex flex-col items-center")}>
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 rounded-md transition-colors hover:bg-sidebar-accent",
            collapsed ? "justify-center p-2" : "p-2"
          )}
        >
          <Avatar name={currentUser.name} size="sm" />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/50">{currentUser.email}</p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  authClient.signOut()
                }}
                className="rounded-md p-1.5 text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="size-4" />
              </button>
            </>
          )}
        </Link>
      </div>
    </aside>
  )
}
