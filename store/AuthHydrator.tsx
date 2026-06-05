"use client"

import { useEffect } from "react"
import { useAuthStore } from "./auth-store"
import { authClient } from "@/lib/auth-client"

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending) {
      setUser(session?.user ?? null, session?.session ?? null)
    }
  }, [session, isPending, setUser])

  return <>{children}</>
}
