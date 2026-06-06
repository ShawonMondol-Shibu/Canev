"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import type { List, Card } from "@/lib/types"
import BoardColumn from "./board-column"
import BoardCard from "./board-card"
import CardModal from "./card-modal"
import { Plus } from "lucide-react"
import { useBoard, useCreateList, useMoveCard, useReorderLists, useDeleteCard, useUpdateCard } from "@/hooks/use-board"
import { useCanEdit } from "@/hooks/use-workspace-role"

interface BoardProps {
  projectId: string
  workspaceId: string
}

export default function Board({ projectId, workspaceId }: BoardProps) {
  const canEdit = useCanEdit(workspaceId)
  const { data: lists, isLoading } = useBoard(projectId)
  const createList = useCreateList()
  const moveCard = useMoveCard()
  const reorderLists = useReorderLists()
  const deleteCard = useDeleteCard()
  const updateCard = useUpdateCard()

  const [activeCard, setActiveCard] = useState<Card | null>(null)
  const [activeList, setActiveList] = useState<List | null>(null)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [newListName, setNewListName] = useState("")
  const [showNewList, setShowNewList] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (event.active.data.current?.type === "card") {
      setActiveCard(event.active.data.current.card as Card)
    } else if (event.active.data.current?.type === "list") {
      setActiveList(event.active.data.current.list as List)
    }
  }, [])

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (!lists) return
      const { active, over } = event
      if (!over || active.data.current?.type !== "card") return

      const activeListId = active.data.current?.card?.listId
      const overListId = over.data.current?.type === "list"
        ? over.id
        : over.data.current?.card?.listId

      if (!activeListId || !overListId || activeListId === overListId) return

      const activeList = lists.find((l) => l.id === activeListId)
      const overList = lists.find((l) => l.id === overListId)
      if (!activeList || !overList) return

      const activeCardItem = activeList.cards.find((c) => c.id === active.id)
      if (!activeCardItem) return

      setActiveCard(activeCardItem)
    },
    [lists]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || !lists) {
        setActiveCard(null)
        setActiveList(null)
        return
      }

      if (active.data.current?.type === "card") {
        const card = active.data.current.card as Card
        const overListId = over.data.current?.type === "list"
          ? over.id
          : over.data.current?.card?.listId

        if (overListId && overListId !== card.listId) {
          moveCard.mutate({ cardId: card.id, targetListId: overListId as string, position: 0, projectId })
        }
      }

      if (active.data.current?.type === "list") {
        reorderLists.mutate({ projectId })
      }

      setActiveCard(null)
      setActiveList(null)
    },
    [lists, moveCard, reorderLists, projectId]
  )

  async function handleAddList() {
    if (!newListName.trim()) return
    await createList.mutateAsync({ projectId, name: newListName.trim() })
    setNewListName("")
    setShowNewList(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 overflow-x-auto p-6">
          <SortableContext items={lists?.map((l) => l.id) || []} strategy={horizontalListSortingStrategy}>
            {lists?.map((list) => (
              <BoardColumn
                key={list.id}
                list={list}
                projectId={projectId}
                workspaceId={workspaceId}
                onCardClick={setSelectedCard}
                canEdit={canEdit}
              />
            ))}
          </SortableContext>

          {showNewList && canEdit ? (
            <div className="flex w-72 shrink-0 flex-col rounded-lg border bg-card p-3">
              <input
                autoFocus
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name..."
                className="w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none focus:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleAddList() }
                  if (e.key === "Escape") { setShowNewList(false); setNewListName("") }
                }}
              />
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={handleAddList}
                  disabled={!newListName.trim()}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Add list
                </button>
                <button
                  onClick={() => { setShowNewList(false); setNewListName("") }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : canEdit ? (
            <button
              onClick={() => setShowNewList(true)}
              className="flex w-72 shrink-0 items-start justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-solid hover:border-primary/30 hover:text-foreground"
            >
              <Plus className="size-4" />
              Add column
            </button>
          ) : null}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="w-72 opacity-90">
              <BoardCard card={activeCard} onClick={() => {}} />
            </div>
          ) : null}
          {activeList ? (
            <div className="w-72 rounded-lg bg-muted/90 p-3">
              <h3 className="text-sm font-semibold">{activeList.name}</h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          projectId={projectId}
          workspaceId={workspaceId}
          onClose={() => setSelectedCard(null)}
          onUpdateCard={(data) => updateCard.mutateAsync({ ...data, projectId })}
          onDeleteCard={(cardId) => deleteCard.mutateAsync({ cardId, projectId })}
        />
      )}
    </>
  )
}
