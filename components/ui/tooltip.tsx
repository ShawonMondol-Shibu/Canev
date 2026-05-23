"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipContextType {
  show: boolean
  setShow: (show: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextType | null>(null)

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [show, setShow] = React.useState(false)
  return <TooltipContext.Provider value={{ show, setShow }}>{children}</TooltipContext.Provider>
}

export function TooltipTrigger({ children, className, ...props }: React.ComponentProps<"span">) {
  const { setShow } = React.useContext(TooltipContext)!

  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      className={cn("inline-flex", className)}
      {...props}
    >
      {children}
    </span>
  )
}

export function TooltipContent({ children, className, ...props }: React.ComponentProps<"div">) {
  const { show } = React.useContext(TooltipContext)!
  if (!show) return null

  return (
    <div
      className={cn(
        "absolute z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md",
        "top-full mt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
