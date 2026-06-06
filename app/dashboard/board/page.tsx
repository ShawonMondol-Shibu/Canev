"use client"

import { useState } from "react"
import Board from "@/components/board/board"
import Navbar from "@/components/dashboard/navbar"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { useProjects } from "@/hooks/use-projects"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderKanban } from "lucide-react"

export default function BoardPage() {
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces()
  const [workspaceId, setWorkspaceId] = useState("")
  const [projectId, setProjectId] = useState("")
  const { data: projects, isLoading: projLoading } = useProjects(workspaceId)

  const selectedProject = projects?.find((p) => p.id === projectId)

  function handleWorkspaceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setWorkspaceId(e.target.value)
    setProjectId("")
  }

  if (!projectId) {
    return (
      <>
        <Navbar title="Board" />
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center">
              <FolderKanban className="mx-auto size-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-semibold">Select a Board</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a workspace and project to view its board
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Workspace
                </label>
                {wsLoading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <select
                    value={workspaceId}
                    onChange={handleWorkspaceChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select a workspace</option>
                    {workspaces?.map((ws) => (
                      <option key={ws.id} value={ws.id}>
                        {ws.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Project
                </label>
                {projLoading ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    disabled={!workspaceId}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {workspaceId ? "Select a project" : "Select a workspace first"}
                    </option>
                    {projects?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar
        title={selectedProject?.name || "Board"}
        action={
          <button
            onClick={() => setProjectId("")}
            className="ml-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Change board
          </button>
        }
      />
      <div className="flex-1 overflow-hidden">
        <Board projectId={projectId} />
      </div>
    </>
  )
}
