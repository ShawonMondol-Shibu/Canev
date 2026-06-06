"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Project } from "@/lib/types"

interface ApiProject {
  id: string
  name: string
  description: string | null
  workspaceId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

async function fetchProjects(workspaceId: string): Promise<Project[]> {
  const projects = await api.get<ApiProject[]>(`/projects?workspaceId=${workspaceId}`)
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    workspaceId: p.workspaceId,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    lists: [],
    _count: { lists: 0, cards: 0 },
  }))
}

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => fetchProjects(workspaceId),
    enabled: !!workspaceId,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { workspaceId: string; name: string; description?: string }) => {
      return api.post<ApiProject[]>("/projects", {
        name: data.name,
        description: data.description || undefined,
        workspaceId: data.workspaceId,
      })
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["projects", vars.workspaceId] })
      toast.success("Project created")
    },
    onError: () => toast.error("Failed to create project"),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { id: string; workspaceId: string }) => {
      await api.delete(`/projects/${data.id}?workspaceId=${data.workspaceId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["projects", vars.workspaceId] })
      toast.success("Project deleted")
    },
    onError: () => toast.error("Failed to delete project"),
  })
}
