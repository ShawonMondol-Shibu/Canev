"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, FolderKanban, MoreHorizontal, ArrowLeft } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { useWorkspace } from "@/hooks/use-workspaces"
import { useProjects, useCreateProject } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AvatarGroup } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId)
  const { data: projects, isLoading: projLoading } = useProjects(workspaceId)
  const createProject = useCreateProject()
  const [showDialog, setShowDialog] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  async function handleCreate() {
    if (!name.trim()) return
    await createProject.mutateAsync({ workspaceId, name: name.trim(), description: description.trim() || undefined })
    setName("")
    setDescription("")
    setShowDialog(false)
  }

  if (wsLoading) {
    return (
      <>
        <Navbar title="Loading..." />
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar
        title={workspace?.name || "Workspace"}
        action={
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{workspace?.name}</h2>
              {workspace?.members && (
                <AvatarGroup users={workspace.members.map((m) => m.user)} size="sm" max={4} />
              )}
            </div>
            {workspace?.description && (
              <p className="mt-1 text-sm text-muted-foreground">{workspace.description}</p>
            )}
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="mr-1.5 size-4" />
            New Project
          </Button>
        </div>

        {projLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/${workspaceId}/${project.id}`}
                className="group rounded-lg border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FolderKanban className="size-5" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted">
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="mt-4 font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                )}
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{project._count?.lists || 0} lists</span>
                  <span>&middot;</span>
                  <span>{project._count?.cards || 0} cards</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <FolderKanban className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No projects yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project in this workspace
            </p>
            <Button className="mt-4" onClick={() => setShowDialog(true)}>
              <Plus className="mr-1.5 size-4" />
              Create Project
            </Button>
          </div>
        )}
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDialog(false)} />
          <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Create Project</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Landing Page Redesign"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this project about?"
                  className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name.trim() || createProject.isPending}>
                {createProject.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
