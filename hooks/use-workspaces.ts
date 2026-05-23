"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { authClient } from "@/lib/auth-client"
import type { Workspace } from "@/lib/types"

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

interface ApiMember {
  id: string
  workspaceId: string
  userId: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
}

async function getUserId(): Promise<string> {
  const session = await authClient.getSession()
  return session?.data?.user?.id || ""
}

async function fetchWorkspaces(): Promise<Workspace[]> {
  const userId = await getUserId()
  if (!userId) return []

  const [workspaces, members] = await Promise.all([
    api.get<ApiWorkspace[]>(`/workspaces?userId=${userId}`),
    api.get<ApiMember[]>(`/workspace-members?workspaceId=`).catch(() => [] as ApiMember[]),
  ])

  return workspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    ownerId: ws.ownerId,
    createdAt: new Date(ws.createdAt),
    updatedAt: new Date(ws.updatedAt),
    members: members
      .filter((m) => m.workspaceId === ws.id)
      .map((m) => ({
        id: m.id,
        userId: m.userId,
        workspaceId: m.workspaceId,
        role: m.role,
        user: { id: m.userId, name: "", email: "", image: null },
      })),
    projects: [],
    _count: {
      projects: 0,
      members: members.filter((m) => m.workspaceId === ws.id).length,
    },
  }))
}

async function fetchWorkspace(id: string): Promise<Workspace> {
  const userId = await getUserId()
  const [ws, members] = await Promise.all([
    api.get<ApiWorkspace>(`/workspaces/${id}?userId=${userId}`),
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
      user: { id: m.userId, name: "", email: "", image: null },
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
      const userId = await getUserId()
      return api.post<ApiWorkspace[]>("/workspaces", {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || null,
        ownerId: userId,
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  })
}

export function useDeleteWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const userId = await getUserId()
      await api.delete(`/workspaces/${id}?userId=${userId}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  })
}
