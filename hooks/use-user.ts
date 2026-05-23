"use client"

import { authClient } from "@/lib/auth-client"

export function useUser() {
  const { data: session, isPending, error } = authClient.useSession()

  return {
    user: session?.user ?? null,
    session: session?.session ?? null,
    isPending,
    error,
  }
}
