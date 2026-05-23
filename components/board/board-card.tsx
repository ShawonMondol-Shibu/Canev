"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Calendar, MessageSquare, Paperclip, GripVertical } from "lucide-react"
import type { Card as CardType } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getPriorityColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface BoardCardProps {
  card: CardType
  onClick: () => void
}

export default function BoardCard({ card, onClick }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { type: "card", card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const hasDueDate = card.dueDate
  const dueDateStr = hasDueDate
    ? new Date(card.dueDate!).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "group relative rounded-lg border bg-card p-3 shadow-sm transition-all",
        isDragging ? "z-10 opacity-50 shadow-lg ring-2 ring-primary" : "hover:shadow-md hover:border-primary/30",
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-muted-foreground/30 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" />
        </button>
        <div className="flex-1 min-w-0" onClick={onClick}>
          {card.labels.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-block h-2 w-8 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
              ))}
            </div>
          )}
          <h4 className="text-sm font-medium leading-snug">{card.title}</h4>
          {card.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{card.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {card.priority && (
              <span className={cn("rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase", getPriorityColor(card.priority))}>
                {card.priority}
              </span>
            )}
            {dueDateStr && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="size-3" />
                {dueDateStr}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            {card.comments.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3" />
                {card.comments.length}
              </span>
            )}
            {card.attachments.length > 0 && (
              <span className="flex items-center gap-1">
                <Paperclip className="size-3" />
                {card.attachments.length}
              </span>
            )}
          </div>
        </div>
        {card.assignee && (
          <Avatar name={card.assignee.name} size="sm" className="mt-0.5 shrink-0" />
        )}
      </div>
    </div>
  )
}
