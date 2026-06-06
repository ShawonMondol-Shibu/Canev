"use client"

import { useState, useMemo } from "react"
import { format, subMonths, addMonths, parseISO } from "date-fns"
import Navbar from "@/components/dashboard/navbar"
import CalendarHeader from "@/components/calendar/calendar-header"
import CalendarGrid from "@/components/calendar/calendar-grid"
import { Skeleton } from "@/components/ui/skeleton"
import { useCalendarCards } from "@/hooks/use-calendar-cards"

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { data: cards, isLoading } = useCalendarCards()

  const cardsByDate = useMemo(() => {
    const map = new Map<string, NonNullable<typeof cards>>()
    if (!cards) return map
    for (const card of cards) {
      const dateKey = format(parseISO(card.dueDate), "yyyy-MM-dd")
      const existing = map.get(dateKey)
      if (existing) existing.push(card)
      else map.set(dateKey, [card])
    }
    return map
  }, [cards])

  function goToToday() { setCurrentMonth(new Date()) }
  function prevMonth() { setCurrentMonth((m) => subMonths(m, 1)) }
  function nextMonth() { setCurrentMonth((m) => addMonths(m, 1)) }

  return (
    <>
      <Navbar
        title="Calendar"
        action={
          <button
            onClick={goToToday}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Today
          </button>
        }
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CalendarHeader
          currentMonth={currentMonth}
          onPrev={prevMonth}
          onNext={nextMonth}
          cardCount={cards?.length ?? 0}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="grid h-full grid-cols-7 gap-px rounded-lg border bg-muted">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="bg-background p-2">
                  <Skeleton className="mb-1 h-4 w-6" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <CalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              cardsByDate={cardsByDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </div>
      </div>
    </>
  )
}
