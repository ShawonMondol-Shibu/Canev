"use client"

import { useState } from "react"
import { Users, UserMinus, Shield, Plus, X } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Can } from "@/components/shared/can"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { useWorkspaceMembers, useUpdateWorkspaceMember, useRemoveWorkspaceMember, useAddWorkspaceMember } from "@/hooks/use-members"

export default function MembersPage() {
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces()
  const [workspaceId, setWorkspaceId] = useState("")
  const { data: members, isLoading: membersLoading } = useWorkspaceMembers(workspaceId)
  const updateMember = useUpdateWorkspaceMember()
  const removeMember = useRemoveWorkspaceMember()
  const addMember = useAddWorkspaceMember()
  const [showAdd, setShowAdd] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState<"member" | "admin" | "viewer">("member")

  return (
    <>
      <Navbar title="Members" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h2 className="text-xl font-bold">Workspace Members</h2>
            <p className="text-sm text-muted-foreground">
              View and manage members in your workspaces
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Workspace
            </label>
            {wsLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
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

          {workspaceId && (
            <>
              <Can role="admin" workspaceId={workspaceId}>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {members?.length || 0} member{(members?.length || 0) !== 1 ? "s" : ""}
                  </p>
                  <Button size="sm" onClick={() => setShowAdd(true)}>
                    <Plus className="mr-1 size-3.5" />
                    Add Member
                  </Button>
                </div>
              </Can>

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
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                          autoFocus
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter the user's email"
                          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium">Role</label>
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as "member" | "admin" | "viewer")}
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
                          if (!newEmail.trim()) return
                          await addMember.mutateAsync({ workspaceId, email: newEmail.trim(), role: newRole })
                          setNewEmail("")
                          setNewRole("member")
                          setShowAdd(false)
                        }}
                        disabled={!newEmail.trim() || addMember.isPending}
                      >
                        {addMember.isPending ? "Adding..." : "Add"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border bg-card">
                {membersLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-md" />
                    ))}
                  </div>
                ) : members && members.length > 0 ? (
                  <div className="divide-y">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.user.email || member.userId} size="sm" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{member.user.name || member.user.email || member.userId.slice(0, 8)}</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                                <Shield className="size-3" />
                                {member.role}
                              </span>
                            </div>
                            {member.user.email && (
                              <p className="text-xs text-muted-foreground">{member.user.email}</p>
                            )}
                          </div>
                        </div>
                        <Can role="admin" workspaceId={workspaceId}>
                          <div className="flex items-center gap-2">
                            {member.role !== "owner" && (
                              <>
                                <select
                                  value={member.role}
                                  onChange={(e) =>
                                    updateMember.mutate({ memberId: member.id, role: e.target.value as "owner" | "admin" | "member" | "viewer", workspaceId })
                                  }
                                  className="rounded-md border bg-transparent px-2 py-1 text-xs outline-none"
                                >
                                  <option value="admin">Admin</option>
                                  <option value="member">Member</option>
                                  <option value="viewer">Viewer</option>
                                </select>
                                <button
                                  onClick={() => removeMember.mutate({ memberId: member.id, workspaceId })}
                                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-destructive"
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
                ) : (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Users className="mb-3 size-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No members found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {!workspaceId && (
            <div className="flex flex-col items-center py-20 text-center">
              <Users className="mb-3 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Select a workspace</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a workspace above to view its members
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
