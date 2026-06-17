"use client"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, FolderKanban, Users, X, Loader2 } from "lucide-react"
import type { Workspace } from "@/lib/types"
import { AvatarGroup } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useUpdateWorkspace } from "@/hooks/use-members"
import { useDeleteWorkspace, useCreateWorkspace } from "@/hooks/use-workspaces"

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
  const [showRename, setShowRename] = useState(false)
  const [renameValue, setRenameValue] = useState(workspace.name)
  const [showDelete, setShowDelete] = useState(false)

  const updateWorkspace = useUpdateWorkspace()
  const deleteWorkspace = useDeleteWorkspace()
  const createWorkspace = useCreateWorkspace()

  async function handleRename() {
    if (!renameValue.trim() || renameValue.trim() === workspace.name) {
      setShowRename(false)
      return
    }
    await updateWorkspace.mutateAsync({ workspaceId: workspace.id, name: renameValue.trim() })
    setShowRename(false)
  }

  async function handleDelete() {
    await deleteWorkspace.mutateAsync(workspace.id)
    setShowDelete(false)
  }

  function handleDuplicate() {
    createWorkspace.mutate({ name: `${workspace.name} (copy)`, description: workspace.description || undefined })
  }

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
    <>
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
            <DropdownMenuItem onClick={() => { setRenameValue(workspace.name); setShowRename(true) }}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => setShowDelete(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {cardContent}
      </div>

      {showRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowRename(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Rename Workspace</h3>
              <button onClick={() => setShowRename(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRename(false)}>Cancel</Button>
              <Button onClick={handleRename} disabled={!renameValue.trim() || updateWorkspace.isPending}>
                {updateWorkspace.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {updateWorkspace.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDelete(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Delete Workspace</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{workspace.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDelete(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteWorkspace.isPending}>
                {deleteWorkspace.isPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                {deleteWorkspace.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
