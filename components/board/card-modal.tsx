"use client"

import { useState } from "react"
import { Calendar, MessageSquare, Paperclip, Trash2, User, AlignLeft, Tag } from "lucide-react"
import type { Card } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPriorityColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { users } from "@/lib/mock-data"

interface CardModalProps {
  card: Card
  onClose: () => void
}

export default function CardModal({ card, onClose }: CardModalProps) {
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description || "")

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-12 pb-12">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl mx-4">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {card.labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-xl font-semibold bg-transparent border-none outline-none"
            />
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>in list</span>
              <span className="font-medium text-foreground">To Do</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
              <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80709 2.99385 3.44302 2.99385 3.21847 3.2184C2.99392 3.44295 2.99392 3.80702 3.21847 4.03157L6.68688 7.49999L3.21847 10.9684C2.99392 11.1929 2.99392 11.557 3.21847 11.7816C3.44302 12.0061 3.80709 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.1929 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-[1fr_180px] gap-6">
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlignLeft className="size-4" />
                Description
              </div>
              {editDescription ? (
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add a more detailed description..."
                  className="w-full min-h-[100px] rounded-md border bg-transparent p-3 text-sm outline-none focus:border-primary"
                  rows={4}
                />
              ) : (
                <button
                  onClick={() => setEditDescription(" ")}
                  className="w-full rounded-md border border-dashed p-3 text-left text-sm text-muted-foreground transition-colors hover:border-solid hover:border-muted-foreground/30"
                >
                  Add a more detailed description...
                </button>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="size-4" />
                Comments
              </div>
              <div className="mb-3 flex gap-3">
                <Avatar name="You" size="sm" />
                <input
                  placeholder="Write a comment..."
                  className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              {card.comments.length > 0 ? (
                <div className="space-y-4">
                  {card.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar name={comment.user.name} size="sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.user.name}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Assigned to</div>
              <div className="flex items-center gap-2">
                <Avatar name={card.assignee?.name || "Unassigned"} size="sm" />
                <span className="text-sm">{card.assignee?.name || "Unassigned"}</span>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Due date</div>
              <button className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted">
                <Calendar className="size-3.5 text-muted-foreground" />
                {card.dueDate
                  ? new Date(card.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Not set"}
              </button>
            </div>

            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Priority</div>
              <span className={cn("inline-block rounded-full border px-2.5 py-1 text-xs font-semibold", getPriorityColor(card.priority))}>
                {card.priority}
              </span>
            </div>

            <Separator />

            <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10">
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
