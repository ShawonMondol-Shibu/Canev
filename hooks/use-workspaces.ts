"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
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

async function fetchWorkspaces(): Promise<Workspace[]> {
  const [workspaces, members] = await Promise.all([
    api.get<ApiWorkspace[]>("/workspaces"),
    api.get<ApiMember[]>("/workspace-members?workspaceId=").catch(() => [] as ApiMember[]),
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
      return api.post<ApiWorkspace[]>("/workspaces", {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description || null,
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  })
}

export function useDeleteWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/workspaces/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspaces"] }),
  })
}
