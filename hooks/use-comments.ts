"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Comment } from "@/lib/types"

interface ApiComment {
  id: string
  content: string
  cardId: string
  userId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

function mapComment(c: ApiComment): Comment {
  return {
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  }
}

export function useComments(cardId: string) {
  return useQuery({
    queryKey: ["comments", cardId],
    queryFn: async () => {
      const raw = await api.get<ApiComment[]>(`/comments?cardId=${cardId}`)
      return raw.map(mapComment)
    },
    enabled: !!cardId,
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; content: string }) => {
      const result = await api.post<ApiComment[]>("/comments", data)
      return mapComment(result[0])
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["comments", vars.cardId] })
      toast.success("Comment added")
    },
    onError: () => toast.error("Failed to add comment"),
  })
}

export function useUpdateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { commentId: string; cardId: string; content: string }) => {
      const result = await api.put<ApiComment>(`/comments/${data.commentId}`, { content: data.content })
      return mapComment(result)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["comments", vars.cardId] })
      toast.success("Comment updated")
    },
    onError: () => toast.error("Failed to update comment"),
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { commentId: string; cardId: string }) => {
      await api.delete(`/comments/${data.commentId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["comments", vars.cardId] })
      toast.success("Comment deleted")
    },
    onError: () => toast.error("Failed to delete comment"),
  })
}
