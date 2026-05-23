"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import WorkspaceCard from "@/components/dashboard/workspace-card"
import { useWorkspaces, useCreateWorkspace } from "@/hooks/use-workspaces"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const createWorkspace = useCreateWorkspace()
  const [showDialog, setShowDialog] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  async function handleCreate() {
    if (!name.trim()) return
    await createWorkspace.mutateAsync({ name: name.trim(), description: description.trim() || undefined })
    setName("")
    setDescription("")
    setShowDialog(false)
  }

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Workspaces</h2>
            <p className="text-sm text-muted-foreground">
              Manage your projects and teams
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-1.5 size-4" />
            New Workspace
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <WorkspaceCard key={ws.id} workspace={ws} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Plus className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No workspaces yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first workspace to get started
            </p>
            <Button className="mt-4" onClick={() => setShowDialog(true)}>
              <Plus className="mr-1.5 size-4" />
              Create Workspace
            </Button>
          </div>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDialog(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Create Workspace</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Product Design"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this workspace about?"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim() || createWorkspace.isPending}>
                {createWorkspace.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
