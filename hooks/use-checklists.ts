"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Checklist, ChecklistItem } from "@/lib/types"

interface ApiChecklist {
  id: string
  cardId: string
  title: string
  position: number
  createdAt: string
  updatedAt: string
}

interface ApiChecklistItem {
  id: string
  checklistId: string
  content: string
  isCompleted: number
  position: number
  createdAt: string
  updatedAt: string
}

function mapChecklist(c: ApiChecklist): Checklist {
  return {
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
    items: [],
  }
}

function mapChecklistItem(i: ApiChecklistItem): ChecklistItem {
  return {
    ...i,
    createdAt: new Date(i.createdAt),
    updatedAt: new Date(i.updatedAt),
  }
}

export function useChecklists(cardId: string) {
  return useQuery({
    queryKey: ["checklists", cardId],
    queryFn: async () => {
      const checklists = await api.get<ApiChecklist[]>(`/checklists?cardId=${cardId}`)
      const itemsByChecklist: Record<string, ChecklistItem[]> = {}
      if (checklists.length > 0) {
        const itemsArrays = await Promise.all(
          checklists.map((cl) =>
            api.get<ApiChecklistItem[]>(`/checklist-items?checklistId=${cl.id}`),
          ),
        )
        checklists.forEach((cl, i) => {
          itemsByChecklist[cl.id] = itemsArrays[i].map(mapChecklistItem)
        })
      }
      return checklists.map((c) => ({
        ...mapChecklist(c),
        items: itemsByChecklist[c.id] || [],
      }))
    },
    enabled: !!cardId,
  })
}

export function useCreateChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { cardId: string; title: string }) => {
      const result = await api.post<ApiChecklist[]>("/checklists", { ...data, position: 999 })
      return mapChecklist(result[0])
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Checklist created")
    },
    onError: () => toast.error("Failed to create checklist"),
  })
}

export function useUpdateChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { checklistId: string; cardId: string; title?: string; position?: number }) => {
      const result = await api.put<ApiChecklist>(`/checklists/${data.checklistId}`, { title: data.title, position: data.position })
      return mapChecklist(result)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Checklist updated")
    },
    onError: () => toast.error("Failed to update checklist"),
  })
}

export function useDeleteChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { checklistId: string; cardId: string }) => {
      await api.delete(`/checklists/${data.checklistId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Checklist deleted")
    },
    onError: () => toast.error("Failed to delete checklist"),
  })
}

export function useCreateChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { checklistId: string; cardId: string; content: string }) => {
      const { cardId: _cid, ...rest } = data
      const result = await api.post<ApiChecklistItem[]>("/checklist-items", { ...rest, position: 999 })
      return mapChecklistItem(result[0])
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Item added")
    },
    onError: () => toast.error("Failed to add item"),
  })
}

export function useUpdateChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { itemId: string; cardId: string; content?: string; isCompleted?: number; position?: number }) => {
      const result = await api.put<ApiChecklistItem>(`/checklist-items/${data.itemId}`, {
        content: data.content,
        isCompleted: data.isCompleted,
        position: data.position,
      })
      return mapChecklistItem(result)
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Item updated")
    },
    onError: () => toast.error("Failed to update item"),
  })
}

export function useDeleteChecklistItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { itemId: string; cardId: string }) => {
      await api.delete(`/checklist-items/${data.itemId}`)
      return data
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["checklists", vars.cardId] })
      toast.success("Item deleted")
    },
    onError: () => toast.error("Failed to delete item"),
  })
}
