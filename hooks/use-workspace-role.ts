"use client"

import { useMemo } from "react"
import { useUser } from "./use-user"
import { useWorkspaceMembers } from "./use-members"

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer"

const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
}

export function useWorkspaceRole(workspaceId: string) {
  const { user, isPending: userLoading } = useUser()
  const { data: members, isLoading: membersLoading } = useWorkspaceMembers(workspaceId)

  const role = useMemo(() => {
    if (!user?.id || !members) return null
    const member = members.find((m) => m.userId === user.id)
    return member?.role ?? null
  }, [user?.id, members])

  return { role, isLoading: userLoading || membersLoading }
}

export function useCanEdit(workspaceId: string): boolean {
  const { role } = useWorkspaceRole(workspaceId)
  return role !== null && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.member
}

export function useCanManage(workspaceId: string): boolean {
  const { role } = useWorkspaceRole(workspaceId)
  return role !== null && ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.admin
}

export function useIsOwner(workspaceId: string): boolean {
  const { role } = useWorkspaceRole(workspaceId)
  return role === "owner"
}
