"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api, ApiError } from "@/lib/api"
import type { WorkspaceMember } from "@/lib/types"

interface ApiMember {
  id: string
  workspaceId: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
  userEmail: string | null
  userName: string | null
  userImage: string | null
}

function mapMember(m: ApiMember): WorkspaceMember {
  return {
    id: m.id,
    userId: m.userId,
    workspaceId: m.workspaceId,
    role: m.role,
    user: { id: m.userId, name: m.userName || "", email: m.userEmail || "", image: m.userImage },
  }
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const members = await api.get<ApiMember[]>(`/workspace-members?workspaceId=${workspaceId}`)
      return members.map(mapMember)
    },
    enabled: !!workspaceId,
  })
}

export function useAddWorkspaceMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { workspaceId: string; email: string; role?: "owner" | "admin" | "member" | "viewer" }) => {
      return api.post<ApiMember[]>("/workspace-members", {
        workspaceId: data.workspaceId,
        email: data.email,
        role: data.role || "member",
      })
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspace-members", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Member added")
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to add member"),
  })
}

export function useUpdateWorkspaceMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { memberId: string; role: "owner" | "admin" | "member" | "viewer"; workspaceId: string }) => {
      return api.put<ApiMember[]>(`/workspace-members/${data.memberId}`, { role: data.role })
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspace-members", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Member role updated")
    },
    onError: () => toast.error("Failed to update member role"),
  })
}

export function useRemoveWorkspaceMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { memberId: string; workspaceId: string }) => {
      await api.delete(`/workspace-members/${data.memberId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspace-members", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Member removed")
    },
    onError: () => toast.error("Failed to remove member"),
  })
}

export function useUpdateWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { workspaceId: string; name?: string; description?: string | null }) => {
      const body: Record<string, string | undefined> = {}
      if (data.name) body.name = data.name
      if (data.description !== undefined) body.description = data.description || undefined
      return api.put<ApiWorkspace>(`/workspaces/${data.workspaceId}`, body)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspaces", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace updated")
    },
    onError: () => toast.error("Failed to update workspace"),
  })
}

interface ApiWorkspace {
  id: string
  name: string
  slug: string
  description: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
