export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: WorkspaceMember[];
  projects: Project[];
  _count?: { projects: number; members: number };
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  lists: List[];
  _count?: { lists: number; cards: number };
}

export interface List {
  id: string;
  name: string;
  position: number;
  projectId: string;
  createdAt: Date;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  position: number;
  listId: string;
  assigneeId: string | null;
  dueDate: Date | null;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  version?: number;
  createdAt: Date;
  updatedAt: Date;
  assignee: User | null;
  comments: Comment[];
  attachments: Attachment[];
  labels: Label[];
}

export interface Comment {
  id: string;
  content: string;
  cardId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: string | null;
}

export interface Attachment {
  id: string;
  url: string;
  publicId: string;
  name: string;
  cardId: string;
  userId: string;
  mimeType: string | null;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: string | null;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CardLabel {
  cardId: string;
  labelId: string;
  label?: Label;
}

export interface ActivityLog {
  id: string;
  action: "created" | "updated" | "deleted" | "moved" | "assigned" | "unassigned" | "renamed" | "commented" | "uploaded";
  entityType: "workspace" | "project" | "list" | "card" | "comment" | "attachment";
  entityId: string;
  workspaceId: string;
  userId: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface Checklist {
  id: string;
  cardId: string;
  title: string;
  position: number;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  content: string;
  isCompleted: number;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}
