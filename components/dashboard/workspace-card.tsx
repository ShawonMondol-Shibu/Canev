"use client"

import Link from "next/link"
import { MoreHorizontal, FolderKanban, Users } from "lucide-react"
import type { Workspace } from "@/lib/types"
import { AvatarGroup } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface WorkspaceCardProps {
  workspace: Workspace
}

const colors = [
  "from-blue-500 to-blue-600",
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
]

function getColor(id: string) {
  const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return colors[index % colors.length]
}

export default function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const cardContent = (
    <>
      <div className={cn("h-20 bg-gradient-to-br p-4", getColor(workspace.id))}>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-white drop-shadow-sm">{workspace.name}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        {workspace.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{workspace.description}</p>
        )}
        <div className="mt-auto flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FolderKanban className="size-3.5" />
            {workspace._count?.projects || 0} projects
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {workspace._count?.members || 0}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <AvatarGroup
            users={workspace.members.map((m) => m.user)}
            size="sm"
            max={3}
          />
        </div>
      </div>
    </>
  )

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <Link
        href={`/dashboard/${workspace.id}`}
        className="absolute inset-0 z-0"
        aria-label={workspace.name}
      />
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-2 top-2 z-10 rounded-md p-1.5 text-white/80 hover:bg-white/20">
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {cardContent}
    </div>
  )
}
