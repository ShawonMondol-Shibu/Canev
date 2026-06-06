"use client"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HeaderProps {
  currentMonth: Date
  onPrev: () => void
  onNext: () => void
  cardCount: number
}

export default function CalendarHeader({ currentMonth, onPrev, onNext, cardCount }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={onNext}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{cardCount} cards with due dates</div>
    </div>
  )
}
