"use client"

import { useState } from "react"
import { Users, UserMinus, Shield } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar } from "@/components/ui/avatar"
import { Can } from "@/components/shared/can"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { useWorkspaceMembers, useUpdateWorkspaceMember, useRemoveWorkspaceMember } from "@/hooks/use-members"

export default function MembersPage() {
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces()
  const [workspaceId, setWorkspaceId] = useState("")
  const { data: members, isLoading: membersLoading } = useWorkspaceMembers(workspaceId)
  const updateMember = useUpdateWorkspaceMember()
  const removeMember = useRemoveWorkspaceMember()

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
                    <div
                      key={member.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={member.userId} size="sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {member.userId.slice(0, 8)}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium capitalize text-primary">
                              <Shield className="size-3" />
                              {member.role}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">ID: {member.userId.slice(0, 12)}...</p>
                        </div>
                      </div>
                      <Can role="admin" workspaceId={workspaceId}>
                        <div className="flex items-center gap-2">
                          {member.role !== "owner" && (
                            <>
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  updateMember.mutate({
                                    memberId: member.id,
                                    role: e.target.value as any,
                                    workspaceId,
                                  })
                                }
                                className="rounded-md border bg-transparent px-2 py-1 text-xs outline-none"
                              >
                                <option value="admin">Admin</option>
                                <option value="member">Member</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <button
                                onClick={() =>
                                  removeMember.mutate({ memberId: member.id, workspaceId })
                                }
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
