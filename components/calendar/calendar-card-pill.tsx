"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CalendarCardItem } from "@/hooks/use-calendar-cards"

const priorityColors: Record<string, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-yellow-400",
  low: "bg-green-400",
  none: "bg-gray-400",
}

export default function CalendarCardPill({ card }: { card: CalendarCardItem }) {
  return (
    <Link
      href={`/dashboard/${card.workspaceId}/${card.projectId}`}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "block truncate rounded px-1 py-0.5 text-[11px] font-medium text-white transition-opacity hover:opacity-80",
        priorityColors[card.priority] ?? priorityColors.none,
      )}
      title={`${card.title} — ${card.projectName}`}
    >
      {card.title}
    </Link>
  )
}
