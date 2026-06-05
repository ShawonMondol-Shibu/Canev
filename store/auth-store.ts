"use client"

import { create } from "zustand"
import { authClient } from "@/lib/auth-client"
import type { User, Session } from "better-auth"

interface AuthState {
  user: User | null
  session: Session | null
  isPending: boolean
  hydrate: () => Promise<void>
  setUser: (user: User | null, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isPending: true,
  hydrate: async () => {
    try {
      const { data } = await authClient.getSession()
      set({ user: data?.user ?? null, session: data?.session ?? null, isPending: false })
    } catch {
      set({ user: null, session: null, isPending: false })
    }
  },
  setUser: (user, session) => set({ user, session, isPending: false }),
}))
