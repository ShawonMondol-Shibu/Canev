import type { User, Workspace, Project, List, Card } from "./types"

const currentUser: User = {
  id: "user-1",
  name: "Alex Chen",
  email: "alex@example.com",
  image: null,
}

const users: User[] = [
  currentUser,
  { id: "user-2", name: "Sarah Kim", email: "sarah@example.com", image: null },
  { id: "user-3", name: "James Wilson", email: "james@example.com", image: null },
  { id: "user-4", name: "Priya Patel", email: "priya@example.com", image: null },
  { id: "user-5", name: "Marcus Lee", email: "marcus@example.com", image: null },
]

const now = new Date()

export const mockWorkspaces: Workspace[] = [
  {
    id: "ws-1",
    name: "Product Design",
    description: "Design system and product sprints",
    ownerId: "user-1",
    createdAt: new Date(now.getTime() - 30 * 86400000),
    updatedAt: new Date(now.getTime() - 1 * 86400000),
    members: [
      { id: "wm-1", userId: "user-1", workspaceId: "ws-1", role: "owner", user: users[0] },
      { id: "wm-2", userId: "user-2", workspaceId: "ws-1", role: "admin", user: users[1] },
      { id: "wm-3", userId: "user-3", workspaceId: "ws-1", role: "member", user: users[2] },
    ],
    projects: [],
    _count: { projects: 3, members: 3 },
  },
  {
    id: "ws-2",
    name: "Engineering",
    description: "Frontend and backend development",
    ownerId: "user-1",
    createdAt: new Date(now.getTime() - 20 * 86400000),
    updatedAt: new Date(now.getTime() - 2 * 86400000),
    members: [
      { id: "wm-4", userId: "user-1", workspaceId: "ws-2", role: "owner", user: users[0] },
      { id: "wm-5", userId: "user-4", workspaceId: "ws-2", role: "member", user: users[3] },
      { id: "wm-6", userId: "user-5", workspaceId: "ws-2", role: "member", user: users[4] },
    ],
    projects: [],
    _count: { projects: 2, members: 3 },
  },
  {
    id: "ws-3",
    name: "Marketing",
    description: "Campaigns and content strategy",
    ownerId: "user-1",
    createdAt: new Date(now.getTime() - 15 * 86400000),
    updatedAt: new Date(now.getTime() - 3 * 86400000),
    members: [
      { id: "wm-7", userId: "user-1", workspaceId: "ws-3", role: "owner", user: users[0] },
      { id: "wm-8", userId: "user-3", workspaceId: "ws-3", role: "admin", user: users[2] },
    ],
    projects: [],
    _count: { projects: 1, members: 2 },
  },
]

export function getMockProjects(workspaceId: string): Project[] {
  const allProjects: Record<string, Project[]> = {
    "ws-1": [
      {
        id: "proj-1",
        name: "Landing Page Redesign",
        description: "Redesign the marketing landing page",
        workspaceId: "ws-1",
        createdAt: new Date(now.getTime() - 14 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
        lists: [],
        _count: { lists: 4, cards: 12 },
      },
      {
        id: "proj-2",
        name: "Design System v2",
        description: "Component library and design tokens",
        workspaceId: "ws-1",
        createdAt: new Date(now.getTime() - 10 * 86400000),
        updatedAt: new Date(now.getTime() - 2 * 86400000),
        lists: [],
        _count: { lists: 3, cards: 8 },
      },
      {
        id: "proj-3",
        name: "User Research Sprint",
        description: "Q2 user interviews and testing",
        workspaceId: "ws-1",
        createdAt: new Date(now.getTime() - 7 * 86400000),
        updatedAt: new Date(now.getTime() - 4 * 86400000),
        lists: [],
        _count: { lists: 3, cards: 5 },
      },
    ],
    "ws-2": [
      {
        id: "proj-4",
        name: "API Integration",
        description: "Third-party API connections",
        workspaceId: "ws-2",
        createdAt: new Date(now.getTime() - 12 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
        lists: [],
        _count: { lists: 4, cards: 15 },
      },
      {
        id: "proj-5",
        name: "Performance Optimization",
        description: "Improve app load times and bundle size",
        workspaceId: "ws-2",
        createdAt: new Date(now.getTime() - 5 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
        lists: [],
        _count: { lists: 3, cards: 7 },
      },
    ],
    "ws-3": [
      {
        id: "proj-6",
        name: "Social Media Campaign",
        description: "Summer launch campaign",
        workspaceId: "ws-3",
        createdAt: new Date(now.getTime() - 8 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
        lists: [],
        _count: { lists: 4, cards: 9 },
      },
    ],
  }
  return allProjects[workspaceId] || []
}

export function getMockLists(projectId: string): List[] {
  const allLists: Record<string, List[]> = {
    "proj-1": [
      {
        id: "list-1", name: "To Do", position: 0, projectId: "proj-1",
        createdAt: new Date(now.getTime() - 14 * 86400000), cards: [],
      },
      {
        id: "list-2", name: "In Progress", position: 1, projectId: "proj-1",
        createdAt: new Date(now.getTime() - 14 * 86400000), cards: [],
      },
      {
        id: "list-3", name: "Review", position: 2, projectId: "proj-1",
        createdAt: new Date(now.getTime() - 14 * 86400000), cards: [],
      },
      {
        id: "list-4", name: "Done", position: 3, projectId: "proj-1",
        createdAt: new Date(now.getTime() - 14 * 86400000), cards: [],
      },
    ],
    "proj-2": [
      {
        id: "list-5", name: "Backlog", position: 0, projectId: "proj-2",
        createdAt: new Date(now.getTime() - 10 * 86400000), cards: [],
      },
      {
        id: "list-6", name: "In Progress", position: 1, projectId: "proj-2",
        createdAt: new Date(now.getTime() - 10 * 86400000), cards: [],
      },
      {
        id: "list-7", name: "Completed", position: 2, projectId: "proj-2",
        createdAt: new Date(now.getTime() - 10 * 86400000), cards: [],
      },
    ],
  }

  const cardsByList: Record<string, Card[]> = {
    "list-1": [
      { id: "card-1", title: "Design hero section mockups", description: "Create 3 variants for the hero section", position: 0, listId: "list-1", assigneeId: "user-2", dueDate: new Date(now.getTime() + 3 * 86400000), priority: "high", createdAt: new Date(now.getTime() - 5 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: users[1], comments: [], attachments: [], labels: [{ id: "label-1", name: "design", color: "#6366f1", workspaceId: "ws-1" }] },
      { id: "card-2", title: "Write copy for all sections", description: null, position: 1, listId: "list-1", assigneeId: null, dueDate: null, priority: "medium", createdAt: new Date(now.getTime() - 4 * 86400000), updatedAt: new Date(now.getTime() - 2 * 86400000), assignee: null, comments: [], attachments: [], labels: [] },
      { id: "card-3", title: "Gather competitor references", description: "Screenshot and organize 10 competitor landing pages", position: 2, listId: "list-1", assigneeId: "user-3", dueDate: new Date(now.getTime() + 1 * 86400000), priority: "low", createdAt: new Date(now.getTime() - 6 * 86400000), updatedAt: new Date(now.getTime() - 3 * 86400000), assignee: users[2], comments: [], attachments: [], labels: [{ id: "label-2", name: "research", color: "#10b981", workspaceId: "ws-1" }] },
    ],
    "list-2": [
      { id: "card-4", title: "Build navigation component", description: "Responsive nav with mobile hamburger", position: 0, listId: "list-2", assigneeId: "user-1", dueDate: new Date(now.getTime() + 2 * 86400000), priority: "high", createdAt: new Date(now.getTime() - 3 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: currentUser, comments: [{ id: "cmt-1", content: "Remember to add active state styles", cardId: "card-4", userId: "user-2", createdAt: new Date(now.getTime() - 1 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000) }], attachments: [], labels: [{ id: "label-3", name: "dev", color: "#f59e0b", workspaceId: "ws-1" }] },
      { id: "card-5", title: "Implement footer section", description: null, position: 1, listId: "list-2", assigneeId: "user-4", dueDate: new Date(now.getTime() + 5 * 86400000), priority: "medium", createdAt: new Date(now.getTime() - 2 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: users[3], comments: [], attachments: [], labels: [] },
    ],
    "list-3": [
      { id: "card-6", title: "Review color palette", description: "Check contrast ratios and accessibility", position: 0, listId: "list-3", assigneeId: "user-2", dueDate: new Date(now.getTime() + 1 * 86400000), priority: "medium", createdAt: new Date(now.getTime() - 4 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: users[1], comments: [{ id: "cmt-2", content: "Colors look good! Just need to fix the green contrast.", cardId: "card-6", userId: "user-1", createdAt: new Date(now.getTime() - 12 * 3600000), updatedAt: new Date(now.getTime() - 12 * 3600000) }], attachments: [], labels: [{ id: "label-4", name: "design", color: "#6366f1", workspaceId: "ws-1" }] },
      { id: "card-7", title: "Test mobile responsiveness", description: null, position: 1, listId: "list-3", assigneeId: "user-3", dueDate: null, priority: "high", createdAt: new Date(now.getTime() - 3 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: users[2], comments: [], attachments: [], labels: [] },
    ],
    "list-4": [
      { id: "card-8", title: "Set up project repository", description: null, position: 0, listId: "list-4", assigneeId: "user-1", dueDate: null, priority: "low", createdAt: new Date(now.getTime() - 10 * 86400000), updatedAt: new Date(now.getTime() - 7 * 86400000), assignee: currentUser, comments: [], attachments: [], labels: [] },
    ],
    "list-5": [
      { id: "card-9", title: "Design button component", description: "Primary, secondary, ghost variants", position: 0, listId: "list-5", assigneeId: "user-2", dueDate: new Date(now.getTime() + 7 * 86400000), priority: "high", createdAt: new Date(now.getTime() - 8 * 86400000), updatedAt: new Date(now.getTime() - 2 * 86400000), assignee: users[1], comments: [], attachments: [], labels: [{ id: "label-5", name: "design", color: "#6366f1", workspaceId: "ws-1" }] },
    ],
    "list-6": [
      { id: "card-10", title: "Create color tokens", description: "Define all design tokens in CSS", position: 0, listId: "list-6", assigneeId: "user-1", dueDate: new Date(now.getTime() + 4 * 86400000), priority: "medium", createdAt: new Date(now.getTime() - 5 * 86400000), updatedAt: new Date(now.getTime() - 1 * 86400000), assignee: currentUser, comments: [], attachments: [], labels: [] },
    ],
    "list-7": [
      { id: "card-11", title: "Typography scale", description: "Establish type scale and font families", position: 0, listId: "list-7", assigneeId: null, dueDate: null, priority: "low", createdAt: new Date(now.getTime() - 12 * 86400000), updatedAt: new Date(now.getTime() - 6 * 86400000), assignee: null, comments: [], attachments: [], labels: [] },
    ],
  }

  const lists = allLists[projectId] || []
  return lists.map((list) => ({
    ...list,
    cards: cardsByList[list.id] || [],
  }))
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
  "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-lime-500",
]

export function getUserInitials(name: string) {
  return initials(name)
}

export function getAvatarColor(userId: string) {
  const index = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return avatarColors[index % avatarColors.length]
}

export function getPriorityColor(priority: "none" | "low" | "medium" | "high" | "urgent") {
  switch (priority) {
    case "urgent": return "bg-rose-500/10 text-rose-600 border-rose-200 dark:text-rose-400 dark:border-rose-500/30"
    case "high": return "bg-amber-500/10 text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-500/30"
    case "medium": return "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-500/30"
    case "low": return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-500/30"
    case "none": return "bg-muted text-muted-foreground border-border"
  }
}

export const labelColors: Record<string, string> = {
  design: "#6366f1",
  dev: "#f59e0b",
  research: "#10b981",
  bug: "#f43f5e",
  docs: "#06b6d4",
}

export { currentUser, users }
