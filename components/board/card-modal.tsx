"use client"

import { useState } from "react"
import { Calendar, MessageSquare, Paperclip, Trash2, User, AlignLeft, Tag, Plus, X } from "lucide-react"
import type { Card } from "@/lib/types"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getPriorityColor } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useComments, useCreateComment, useDeleteComment } from "@/hooks/use-comments"
import { useAttachments } from "@/hooks/use-attachments"
import { useCardLabels } from "@/hooks/use-card-labels"

interface CardModalProps {
  card: Card
  projectId: string
  onClose: () => void
  onUpdateCard: (data: Partial<Card> & { id: string }) => Promise<unknown>
  onDeleteCard: (cardId: string) => Promise<unknown>
}

export default function CardModal({ card, projectId: _projectId, onClose, onUpdateCard, onDeleteCard }: CardModalProps) {
  const [editTitle, setEditTitle] = useState(card.title)
  const [editDescription, setEditDescription] = useState(card.description || "")
  const [newComment, setNewComment] = useState("")

  const { data: comments, isLoading: commentsLoading } = useComments(card.id)
  const { data: attachments } = useAttachments(card.id)
  const { data: cardLabels } = useCardLabels(card.id)
  const createComment = useCreateComment()
  const deleteComment = useDeleteComment()

  async function handleSaveTitle() {
    if (editTitle.trim() && editTitle !== card.title) {
      await onUpdateCard({ id: card.id, title: editTitle.trim() })
    }
  }

  async function handleSaveDescription() {
    const desc = editDescription.trim() || null
    if (desc !== card.description) {
      await onUpdateCard({ id: card.id, description: desc })
    }
  }

  async function handleAddComment() {
    if (!newComment.trim()) return
    await createComment.mutateAsync({ cardId: card.id, content: newComment.trim() })
    setNewComment("")
  }

  async function handleDelete() {
    if (confirm("Delete this card?")) {
      await onDeleteCard(card.id)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-12 pb-12">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-2xl rounded-lg bg-background p-6 shadow-xl mx-4">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {(cardLabels || []).length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="size-3" />
                  {cardLabels?.length} labels
                </span>
              )}
            </div>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              className="w-full text-xl font-semibold bg-transparent border-none outline-none"
            />
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>in list</span>
              <span className="font-medium text-foreground">{card.title}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-[1fr_180px] gap-6">
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <AlignLeft className="size-4" />
                Description
              </div>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onBlur={handleSaveDescription}
                placeholder="Add a more detailed description..."
                className="w-full min-h-[100px] rounded-md border bg-transparent p-3 text-sm outline-none focus:border-primary"
                rows={4}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MessageSquare className="size-4" />
                Comments
              </div>
              <div className="mb-3 flex gap-3">
                <Avatar name="You" size="sm" />
                <div className="flex flex-1 gap-2">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim() || createComment.isPending}>
                    Send
                  </Button>
                </div>
              </div>
              {commentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading comments...</p>
              ) : comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar name={comment.userId} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.userId.slice(0, 8)}</span>
                          <span className="text-[11px] text-muted-foreground">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">{comment.content}</p>
                      </div>
                      <button
                        onClick={() => deleteComment.mutate({ commentId: comment.id, cardId: card.id })}
                        className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>

            {attachments && attachments.length > 0 && (
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Paperclip className="size-4" />
                  Attachments ({attachments.length})
                </div>
                <div className="space-y-2">
                  {attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm">
                      <Paperclip className="size-4 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate">{att.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {att.size ? `${(att.size / 1024).toFixed(0)} KB` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

            <button
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
