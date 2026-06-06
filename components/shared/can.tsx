"use client"

import type { ReactNode } from "react"
import { useWorkspaceRole, type WorkspaceRole } from "@/hooks/use-workspace-role"

const ROLE_WEIGHTS: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
}

interface CanProps {
  role: WorkspaceRole
  workspaceId: string
  children: ReactNode
  fallback?: ReactNode
}

export function Can({ role, workspaceId, children, fallback = null }: CanProps) {
  const { role: userRole, isLoading } = useWorkspaceRole(workspaceId)

  if (isLoading) return <>{children}</>
  if (!userRole) return <>{fallback}</>
  return ROLE_WEIGHTS[userRole] >= ROLE_WEIGHTS[role] ? <>{children}</> : <>{fallback}</>
}
