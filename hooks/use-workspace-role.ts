"use client"

import { useMemo } from "react"
import { useUser } from "./use-user"
import { useWorkspace } from "./use-workspaces"

export type WorkspaceRole = "owner" | "admin" | "member" | "viewer"

const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
}

export function useWorkspaceRole(workspaceId: string) {
  const { user, isPending: userLoading } = useUser()
  const { data: workspace, isLoading: wsLoading } = useWorkspace(workspaceId)

  const role = useMemo(() => {
    if (!user?.id || !workspace) return null

    const member = workspace.members.find((m) => m.userId === user.id)
    if (member?.role) return member.role

    if (workspace.ownerId === user.id) return "owner"

    return null
  }, [user?.id, workspace])

  return { role, isLoading: userLoading || wsLoading }
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
