"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { List, Card } from "@/lib/types"

interface ApiList {
  id: string
  title: string
  position: number
  projectId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface ApiCard {
  id: string
  title: string
  description: string | null
  position: number
  listId: string
  assigneeId: string | null
  priority: "none" | "low" | "medium" | "high" | "urgent"
  dueDate: string | null
  version: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

async function fetchBoard(projectId: string): Promise<List[]> {
  const lists = await api.get<ApiList[]>(`/lists?projectId=${projectId}`)
  const listIds = lists.map((l) => l.id)

  const cardsByList: Record<string, Card[]> = {}
  if (listIds.length > 0) {
    const allCards = await Promise.all(
      listIds.map((listId) =>
        api.get<ApiCard[]>(`/cards?listId=${listId}`).catch(() => [] as ApiCard[]),
      ),
    )
    listIds.forEach((listId, i) => {
      cardsByList[listId] = allCards[i].map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        position: c.position,
        listId: c.listId,
        assigneeId: c.assigneeId,
        dueDate: c.dueDate ? new Date(c.dueDate) : null,
        priority: c.priority,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
        assignee: null,
        comments: [],
        attachments: [],
        labels: [],
      }))
    })
  }

  return lists.map((l) => ({
    id: l.id,
    name: l.title,
    position: l.position,
    projectId: l.projectId,
    createdAt: new Date(l.createdAt),
    cards: cardsByList[l.id] || [],
  }))
}

export function useBoard(projectId: string) {
  return useQuery({
    queryKey: ["board", projectId],
    queryFn: () => fetchBoard(projectId),
    enabled: !!projectId,
  })
}

export function useCreateList() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { projectId: string; name: string }) => {
      const result = await api.post<ApiList[]>("/lists", {
        title: data.name,
        position: 999,
        projectId: data.projectId,
      })
      return result[0]
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}

export function useCreateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { listId: string; title: string; projectId: string }) => {
      const result = await api.post<ApiCard[]>("/cards", {
        title: data.title,
        position: 999,
        listId: data.listId,
      })
      return result[0]
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}

export function useMoveCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; targetListId: string; position: number; projectId: string }) => {
      const result = await api.put<ApiCard>(`/cards/${data.cardId}`, {
        listId: data.targetListId,
        position: data.position,
      })
      return result
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}

export function useReorderLists() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { projectId: string; listIds?: string[] }) => {
      if (data.listIds) {
        await Promise.all(
          data.listIds.map((id, i) =>
            api.put(`/lists/${id}`, { position: i }),
          ),
        )
      }
      return data
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}

export function useUpdateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Card> & { id: string; projectId: string }) => {
      const { projectId, ...updates } = data
      const result = await api.put<ApiCard>(`/cards/${data.id}`, updates)
      return result
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}

export function useDeleteCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; projectId: string }) => {
      await api.delete(`/cards/${data.cardId}`)
      return data
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ["board", vars.projectId] }),
  })
}
