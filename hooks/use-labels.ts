"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Label } from "@/lib/types"

interface ApiLabel {
  id: string
  name: string
  color: string
  workspaceId: string
  createdAt: string
  updatedAt: string
}

function mapLabel(l: ApiLabel): Label {
  return {
    ...l,
    createdAt: new Date(l.createdAt),
    updatedAt: new Date(l.updatedAt),
  }
}

export function useLabels(workspaceId: string) {
  return useQuery({
    queryKey: ["labels", workspaceId],
    queryFn: async () => {
      const raw = await api.get<ApiLabel[]>(`/labels?workspaceId=${workspaceId}`)
      return raw.map(mapLabel)
    },
    enabled: !!workspaceId,
  })
}

export function useCreateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { workspaceId: string; name: string; color: string }) => {
      const result = await api.post<ApiLabel[]>("/labels", data)
      return mapLabel(result[0])
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["labels", vars.workspaceId] })
      toast.success("Label created")
    },
    onError: () => toast.error("Failed to create label"),
  })
}

export function useUpdateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { labelId: string; workspaceId: string; name?: string; color?: string }) => {
      const result = await api.put<ApiLabel>(`/labels/${data.labelId}`, { name: data.name, color: data.color })
      return mapLabel(result)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["labels", vars.workspaceId] })
      toast.success("Label updated")
    },
    onError: () => toast.error("Failed to update label"),
  })
}

export function useDeleteLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { labelId: string; workspaceId: string }) => {
      await api.delete(`/labels/${data.labelId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["labels", vars.workspaceId] })
      toast.success("Label deleted")
    },
    onError: () => toast.error("Failed to delete label"),
  })
}
