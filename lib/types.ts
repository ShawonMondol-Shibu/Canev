export interface User {
  id: string
  name: string
  email: string
  image: string | null
}

export interface Workspace {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
  members: WorkspaceMember[]
  projects: Project[]
  _count?: { projects: number; members: number }
}

export interface WorkspaceMember {
  id: string
  userId: string
  workspaceId: string
  role: "owner" | "admin" | "member" | "viewer"
  user: User
}

export interface Project {
  id: string
  name: string
  description: string | null
  workspaceId: string
  createdAt: Date
  updatedAt: Date
  lists: List[]
  _count?: { lists: number; cards: number }
}

export interface List {
  id: string
  name: string
  position: number
  projectId: string
  createdAt: Date
  cards: Card[]
}

export interface Card {
  id: string
  title: string
  description: string | null
  position: number
  listId: string
  assigneeId: string | null
  dueDate: Date | null
  priority: "none" | "low" | "medium" | "high" | "urgent"
  createdAt: Date
  updatedAt: Date
  assignee: User | null
  comments: Comment[]
  attachments: Attachment[]
  labels: Label[]
}

export interface Comment {
  id: string
  content: string
  cardId: string
  userId: string
  createdAt: Date
  user: User
}

export interface Attachment {
  id: string
  url: string
  name: string
  cardId: string
  userId: string
  createdAt: Date
}

export interface Label {
  id: string
  name: string
  color: string
  cardId: string
}
