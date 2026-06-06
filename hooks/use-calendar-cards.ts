"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export interface CalendarCardItem {
  id: string
  title: string
  priority: string
  dueDate: string
  listId: string
  projectId: string
  projectName: string
  workspaceId: string
  workspaceName: string
}

async function fetchCalendarCards(): Promise<CalendarCardItem[]> {
  const workspaces = await api.get<{ id: string; name: string }[]>("/workspaces")
  const cards: CalendarCardItem[] = []

  for (const ws of workspaces) {
    const projects = await api.get<
      { id: string; name: string; workspaceId: string }[]
    >(`/projects?workspaceId=${ws.id}`)

    for (const proj of projects) {
      const lists = await api.get<
        { id: string; title: string; projectId: string }[]
      >(`/lists?projectId=${proj.id}`)

      const listIds = lists.map((l) => l.id)
      if (listIds.length === 0) continue

      const allCards = await Promise.all(
        listIds.map((listId) =>
          api
            .get<
              {
                id: string
                title: string
                priority: string
                dueDate: string | null
                listId: string
              }[]
            >(`/cards?listId=${listId}`)
            .catch(() => []),
        ),
      )

      for (const cardList of allCards) {
        for (const c of cardList) {
          if (c.dueDate) {
            cards.push({
              id: c.id,
              title: c.title,
              priority: c.priority,
              dueDate: c.dueDate,
              listId: c.listId,
              projectId: proj.id,
              projectName: proj.name,
              workspaceId: ws.id,
              workspaceName: ws.name,
            })
          }
        }
      }
    }
  }
  return cards
}

export function useCalendarCards() {
  return useQuery({
    queryKey: ["calendar-cards"],
    queryFn: fetchCalendarCards,
  })
}
