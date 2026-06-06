"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus, MoreHorizontal, GripVertical } from "lucide-react"
import type { List, Card } from "@/lib/types"
import BoardCard from "./board-card"
import { useCreateCard } from "@/hooks/use-board"
import { cn } from "@/lib/utils"

interface BoardColumnProps {
  list: List
  projectId: string
  workspaceId: string
  canEdit: boolean
  onCardClick: (card: Card) => void
}

export default function BoardColumn({ list, projectId, workspaceId, canEdit, onCardClick }: BoardColumnProps) {
  const [showAddCard, setShowAddCard] = useState(false)
  const [cardTitle, setCardTitle] = useState("")
  const createCard = useCreateCard()

  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: { type: "list", list },
  })

  async function handleAddCard() {
    if (!cardTitle.trim()) return
    await createCard.mutateAsync({ listId: list.id, title: cardTitle.trim(), projectId })
    setCardTitle("")
    setShowAddCard(false)
  }

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-muted/50">
      <div className="flex items-center gap-2 px-3 py-3" ref={setNodeRef}>
        {canEdit && <GripVertical className="size-3.5 shrink-0 text-muted-foreground/30 cursor-grab" />}
        <h3 className="text-sm font-semibold">{list.name}</h3>
        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
          {list.cards.length}
        </span>
        {canEdit && (
          <button className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted-foreground/10">
            <MoreHorizontal className="size-4" />
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-col gap-2 px-2 pb-2 min-h-[60px] transition-colors",
          isOver && "bg-primary/5 rounded-md"
        )}
      >
        <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {list.cards
            .sort((a, b) => a.position - b.position)
            .map((card) => (
              <BoardCard key={card.id} card={card} onClick={() => onCardClick(card)} />
            ))}
        </SortableContext>

        {showAddCard ? (
          <div className="rounded-lg border bg-card p-2">
            <textarea
              autoFocus
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Enter card title..."
              className="w-full resize-none rounded border-0 bg-transparent p-1 text-sm outline-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddCard()
                }
                if (e.key === "Escape") {
                  setShowAddCard(false)
                  setCardTitle("")
                }
              }}
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleAddCard}
                disabled={!cardTitle.trim() || createCard.isPending}
                className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {createCard.isPending ? "Adding..." : "Add"}
              </button>
              <button
                onClick={() => { setShowAddCard(false); setCardTitle("") }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : canEdit ? (
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted-foreground/5 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add card
          </button>
        ) : null}
      </div>
    </div>
  )
}
