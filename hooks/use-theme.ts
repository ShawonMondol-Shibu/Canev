"use client"

import { useState, useEffect, useCallback } from "react"

type Theme = "light" | "dark" | "system"

function getPreferredTheme(theme: Theme): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return theme
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system")

  useEffect(() => {
    const stored = localStorage.getItem("canev-theme") as Theme | null
    if (stored) setThemeState(stored)
  }, [])

  useEffect(() => {
    const resolved = getPreferredTheme(theme)
    document.documentElement.classList.toggle("dark", resolved === "dark")
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem("canev-theme", t)
  }, [])

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return { theme, setTheme, isDark }
}
