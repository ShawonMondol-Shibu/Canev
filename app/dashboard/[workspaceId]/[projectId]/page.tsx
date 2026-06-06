"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Board from "@/components/board/board"
import Navbar from "@/components/dashboard/navbar"

export default function BoardPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const workspaceId = params.workspaceId as string

  return (
    <>
      <Navbar
        title="Board"
        action={
          <button
            onClick={() => router.push(`/dashboard/${workspaceId}`)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to project
          </button>
        }
      />
      <div className="flex-1 overflow-hidden">
        <Board projectId={projectId} workspaceId={workspaceId} />
      </div>
    </>
  )
}
