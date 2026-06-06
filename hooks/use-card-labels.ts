"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Label } from "@/lib/types"

interface ApiCardLabel {
  cardId: string
  labelId: string
}

interface ApiLabel {
  id: string
  name: string
  color: string
  workspaceId: string
  createdAt: string
  updatedAt: string
}

export function useCardLabels(cardId: string) {
  return useQuery({
    queryKey: ["card-labels", cardId],
    queryFn: async () => {
      const raw = await api.get<ApiCardLabel[]>(`/card-labels?cardId=${cardId}`)
      return raw
    },
    enabled: !!cardId,
  })
}

export function useAttachLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; labelId: string }) => {
      const result = await api.post<ApiCardLabel[]>("/card-labels", data)
      return result[0]
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["card-labels", vars.cardId] })
      toast.success("Label attached")
    },
    onError: () => toast.error("Failed to attach label"),
  })
}

export function useDetachLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; labelId: string }) => {
      await api.delete(`/card-labels?cardId=${data.cardId}&labelId=${data.labelId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["card-labels", vars.cardId] })
      toast.success("Label detached")
    },
    onError: () => toast.error("Failed to detach label"),
  })
}
