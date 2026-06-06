"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Save, UserMinus, Plus, X } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useWorkspace } from "@/hooks/use-workspaces"
import { useWorkspaceMembers, useAddWorkspaceMember, useUpdateWorkspaceMember, useRemoveWorkspaceMember, useUpdateWorkspace } from "@/hooks/use-members"
import { useDeleteWorkspace } from "@/hooks/use-workspaces"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar } from "@/components/ui/avatar"
import { Can } from "@/components/shared/can"

export default function WorkspaceSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string

  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId)
  const { data: members, isLoading: membersLoading } = useWorkspaceMembers(workspaceId)
  const updateWorkspace = useUpdateWorkspace()
  const deleteWorkspace = useDeleteWorkspace()
  const addMember = useAddWorkspaceMember()
  const updateMember = useUpdateWorkspaceMember()
  const removeMember = useRemoveWorkspaceMember()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newUserId, setNewUserId] = useState("")
  const [newRole, setNewRole] = useState<"member" | "admin" | "viewer">("member")

  if (!initialized && workspace) {
    setName(workspace.name)
    setDescription(workspace.description || "")
    setInitialized(true)
  }

  async function handleSave() {
    await updateWorkspace.mutateAsync({ workspaceId, name: name.trim(), description: description.trim() || null })
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this workspace?")) {
      await deleteWorkspace.mutateAsync(workspaceId)
      router.push("/dashboard")
    }
  }

  return (
    <>
      <Navbar
        title="Settings"
        action={
          <button
            onClick={() => router.push(`/dashboard/${workspaceId}`)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold">Workspace Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your workspace preferences
            </p>
          </div>

          {wsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-20 w-full rounded-md" />
            </div>
          ) : (
            <Can role="admin" workspaceId={workspaceId}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Workspace Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} disabled={updateWorkspace.isPending}>
                  <Save className="mr-1.5 size-4" />
                  {updateWorkspace.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Can>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Members</h3>
                <p className="text-sm text-muted-foreground">
                  {members?.length || 0} member{(members?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <Can role="admin" workspaceId={workspaceId}>
                <Button size="sm" onClick={() => setShowAdd(true)}>
                  <Plus className="mr-1 size-3.5" />
                  Add Member
                </Button>
              </Can>
            </div>

            {membersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-md border bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={member.userId} size="sm" />
                      <div>
                        <p className="text-sm font-medium">{member.user.name || member.userId.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                    <Can role="admin" workspaceId={workspaceId}>
                      <div className="flex items-center gap-2">
                        {member.role !== "owner" && (
                          <>
                            <select
                              value={member.role}
                              onChange={(e) =>
                                updateMember.mutate({ memberId: member.id, role: e.target.value as any, workspaceId })
                              }
                              className="rounded-md border bg-transparent px-2 py-1 text-xs outline-none"
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                              <option value="viewer">Viewer</option>
                            </select>
                            <button
                              onClick={() => removeMember.mutate({ memberId: member.id, workspaceId })}
                              className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                            >
                              <UserMinus className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </Can>
                  </div>
                ))}
              </div>
            )}
          </div>

          {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
              <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Add Member</h3>
                  <button onClick={() => setShowAdd(false)} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium">User ID</label>
                    <input
                      autoFocus
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                      placeholder="Enter the user's ID"
                      className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button
                    onClick={async () => {
                      if (!newUserId.trim()) return
                      await addMember.mutateAsync({ workspaceId, userId: newUserId.trim(), role: newRole })
                      setNewUserId("")
                      setNewRole("member")
                      setShowAdd(false)
                    }}
                    disabled={!newUserId.trim() || addMember.isPending}
                  >
                    {addMember.isPending ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          <Can role="owner" workspaceId={workspaceId}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Once you delete a workspace, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteWorkspace.isPending}>
                <Trash2 className="mr-1.5 size-4" />
                {deleteWorkspace.isPending ? "Deleting..." : "Delete Workspace"}
              </Button>
            </div>
          </Can>
        </div>
      </div>
    </>
  )
}
