"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Attachment } from "@/lib/types"

interface ApiAttachment {
  id: string
  url: string
  publicId: string
  name: string
  cardId: string
  userId: string
  mimeType: string | null
  size: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

function mapAttachment(a: ApiAttachment): Attachment {
  return {
    ...a,
    createdAt: new Date(a.createdAt),
    updatedAt: new Date(a.updatedAt),
  }
}

export function useAttachments(cardId: string) {
  return useQuery({
    queryKey: ["attachments", cardId],
    queryFn: async () => {
      const raw = await api.get<ApiAttachment[]>(`/attachments?cardId=${cardId}`)
      return raw.map(mapAttachment)
    },
    enabled: !!cardId,
  })
}

export function useCreateAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; url: string; publicId: string; name: string; mimeType?: string; size?: number }) => {
      const result = await api.post<ApiAttachment[]>("/attachments", data)
      return mapAttachment(result[0])
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["attachments", vars.cardId] })
      toast.success("Attachment added")
    },
    onError: () => toast.error("Failed to add attachment"),
  })
}

export function useUpdateAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { attachmentId: string; cardId: string; name: string }) => {
      const result = await api.put<ApiAttachment>(`/attachments/${data.attachmentId}`, { name: data.name })
      return mapAttachment(result)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["attachments", vars.cardId] })
      toast.success("Attachment updated")
    },
    onError: () => toast.error("Failed to update attachment"),
  })
}

export function useDeleteAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { attachmentId: string; cardId: string }) => {
      await api.delete(`/attachments/${data.attachmentId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["attachments", vars.cardId] })
      toast.success("Attachment deleted")
    },
    onError: () => toast.error("Failed to delete attachment"),
  })
}
