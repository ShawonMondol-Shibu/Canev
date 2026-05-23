"use client"

import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { currentUser } from "@/lib/mock-data"

interface NavbarProps {
  title?: string
  action?: React.ReactNode
}

export default function Navbar({ title, action }: NavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">{title || "Dashboard"}</h1>
        {action}
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted">
          <Search className="size-4" />
        </button>
        <button className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted">
          <Bell className="size-4" />
        </button>
        <Link href="/dashboard/profile">
          <Avatar name={currentUser.name} size="sm" className="cursor-pointer transition-opacity hover:opacity-80" />
        </Link>
      </div>
    </header>
  )
}
