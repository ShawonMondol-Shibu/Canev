"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Workspace, WorkspaceMember } from "@/lib/types"

interface ApiWorkspace {
  id: string
  name: string
  slug: string
  description: string | null
  ownerId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  _count: { members: number }
  members: {
    id: string
    role: string
    user: { id: string; name: string; email: string; image: string | null }
  }[]
}

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

async function fetchWorkspaces(): Promise<Workspace[]> {
  const workspaces = await api.get<ApiWorkspace[]>("/workspaces")

  return workspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    ownerId: ws.ownerId,
    createdAt: new Date(ws.createdAt),
    updatedAt: new Date(ws.updatedAt),
    members: (ws.members || []).map((m) => ({
      id: m.id,
      userId: m.user.id,
      workspaceId: ws.id,
      role: m.role as WorkspaceMember["role"],
      user: { id: m.user.id, name: m.user.name, email: m.user.email, image: m.user.image },
    })),
    projects: [],
    _count: {
      projects: 0,
      members: ws._count?.members ?? 0,
    },
  }))
}

async function fetchWorkspace(id: string): Promise<Workspace> {
  const [ws, members] = await Promise.all([
    api.get<ApiWorkspace>(`/workspaces/${id}`),
    api.get<ApiMember[]>(`/workspace-members?workspaceId=${id}`).catch(() => [] as ApiMember[]),
  ])

  return {
    id: ws.id,
    name: ws.name,
    description: ws.description,
    ownerId: ws.ownerId,
    createdAt: new Date(ws.createdAt),
    updatedAt: new Date(ws.updatedAt),
    members: members.map((m) => ({
      id: m.id,
      userId: m.userId,
      workspaceId: m.workspaceId,
      role: m.role,
      user: { id: m.userId, name: m.userName || "", email: m.userEmail || "", image: m.userImage },
    })),
    projects: [],
    _count: { projects: 0, members: members.length },
  }
}

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: fetchWorkspaces,
  })
}

export function useWorkspace(id: string) {
  return useQuery({
    queryKey: ["workspaces", id],
    queryFn: () => fetchWorkspace(id),
    enabled: !!id,
  })
}

export function useCreateWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; slug?: string; description?: string }) => {
      return api.post<ApiWorkspace[]>("/workspaces", {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || undefined,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace created")
    },
    onError: () => toast.error("Failed to create workspace"),
  })
}

export function useDeleteWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/workspaces/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace deleted")
    },
    onError: () => toast.error("Failed to delete workspace"),
  })
}
