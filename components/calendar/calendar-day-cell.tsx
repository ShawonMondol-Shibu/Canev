"use client"

import { format, isSameMonth, isSameDay, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import CalendarCardPill from "./calendar-card-pill"
import type { CalendarCardItem } from "@/hooks/use-calendar-cards"

interface DayCellProps {
  day: Date
  currentMonth: Date
  selectedDate: Date | null
  cards: CalendarCardItem[]
  onSelect: (day: Date) => void
}

export default function CalendarDayCell({ day, currentMonth, selectedDate, cards, onSelect }: DayCellProps) {
  return (
    <div
      onClick={() => onSelect(day)}
      className={cn(
        "min-h-28 bg-background p-2 transition-colors hover:bg-accent/30",
        !isSameMonth(day, currentMonth) && "opacity-40",
        selectedDate && isSameDay(day, selectedDate) && "ring-2 ring-inset ring-primary",
      )}
    >
      <div className="mb-1 flex items-center justify-between">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-full text-xs font-medium",
            isToday(day) && "bg-primary text-primary-foreground",
          )}
        >
          {format(day, "d")}
        </span>
        {cards.length > 0 && (
          <span className="text-[10px] text-muted-foreground">{cards.length}</span>
        )}
      </div>
      <div className="space-y-0.5">
        {cards.slice(0, 4).map((card) => (
          <CalendarCardPill key={card.id} card={card} />
        ))}
        {cards.length > 4 && (
          <div className="text-[10px] text-muted-foreground">+{cards.length - 4} more</div>
        )}
      </div>
    </div>
  )
}
