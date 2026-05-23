"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Save } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function WorkspaceSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string

  return (
    <>
      <Navbar
        title="Settings"
        action={
          <button
            onClick={() => router.push(`/dashboard/${workspaceId}`)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold">Workspace Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your workspace preferences
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Workspace Name</label>
              <input
                defaultValue="Product Design"
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <textarea
                defaultValue="Design system and product sprints"
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                rows={3}
              />
            </div>
            <Button>
              <Save className="mr-1.5 size-4" />
              Save Changes
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Once you delete a workspace, there is no going back. Please be certain.
            </p>
            <Button variant="destructive">
              <Trash2 className="mr-1.5 size-4" />
              Delete Workspace
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
