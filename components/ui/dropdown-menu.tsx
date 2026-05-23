"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownContextType {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownContext = React.createContext<DropdownContextType | null>(null)

function useDropdown() {
  const ctx = React.useContext(DropdownContext)
  if (!ctx) throw new Error("Dropdown components must be used within DropdownMenu")
  return ctx
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  return (
    <DropdownContext.Provider value={{ open, setOpen, triggerRef }}>
      {children}
    </DropdownContext.Provider>
  )
}

export function DropdownMenuTrigger({ children, className, ...props }: React.ComponentProps<"button">) {
  const { open, setOpen, triggerRef } = useDropdown()

  return (
    <button
      ref={triggerRef}
      onClick={() => setOpen(!open)}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({ children, className, align = "end", ...props }: React.ComponentProps<"div"> & { align?: "start" | "end" }) {
  const { open, setOpen, triggerRef } = useDropdown()

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, setOpen, triggerRef])

  if (!open) return null

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[180px] rounded-md border bg-popover p-1 shadow-md",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("my-1 h-px bg-border", className)} {...props} />
}
