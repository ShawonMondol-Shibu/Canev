"use client"

import { useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns"
import CalendarDayCell from "./calendar-day-cell"
import type { CalendarCardItem } from "@/hooks/use-calendar-cards"

interface GridProps {
  currentMonth: Date
  selectedDate: Date | null
  cardsByDate: Map<string, CalendarCardItem[]>
  onSelectDate: (day: Date) => void
}

const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function CalendarGrid({ currentMonth, selectedDate, cardsByDate, onSelectDate }: GridProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  return (
    <div className="grid grid-cols-7 gap-px rounded-lg border bg-muted">
      {dayHeaders.map((day) => (
        <div
          key={day}
          className="bg-background px-3 py-2 text-center text-xs font-semibold uppercase text-muted-foreground"
        >
          {day}
        </div>
      ))}
      {days.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd")
        return (
          <CalendarDayCell
            key={dateKey}
            day={day}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            cards={cardsByDate.get(dateKey) ?? []}
            onSelect={onSelectDate}
          />
        )
      })}
    </div>
  )
}
