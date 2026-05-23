"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { WorkspaceMember } from "@/lib/types"

interface ApiMember {
  id: string
  workspaceId: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
}

function mapMember(m: ApiMember): WorkspaceMember {
  return {
    id: m.id,
    userId: m.userId,
    workspaceId: m.workspaceId,
    role: m.role,
    user: { id: m.userId, name: "", email: "", image: null },
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
    mutationFn: async (data: { workspaceId: string; userId: string; role?: "owner" | "admin" | "member" | "viewer" }) => {
      return api.post<ApiMember[]>("/workspace-members", {
        workspaceId: data.workspaceId,
        userId: data.userId,
        role: data.role || "member",
      })
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspace-members", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
    },
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
    },
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
    },
  })
}

export function useUpdateWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { workspaceId: string; name?: string; description?: string | null }) => {
      const userId = await getUserId()
      return api.put<ApiWorkspace>(`/workspaces/${data.workspaceId}?userId=${userId}`, {
        name: data.name,
        description: data.description,
      })
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["workspaces", vars.workspaceId] })
      qc.invalidateQueries({ queryKey: ["workspaces"] })
    },
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

async function getUserId(): Promise<string> {
  const { authClient } = await import("@/lib/auth-client")
  const session = await authClient.getSession()
  return session?.data?.user?.id || ""
}
