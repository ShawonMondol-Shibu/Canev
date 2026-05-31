git "use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { User, Mail, Lock, Camera, Save, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navbar from "@/components/dashboard/navbar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useUser } from "@/hooks/use-user"
import { authClient } from "@/lib/auth-client"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const router = useRouter()
  const { user, isPending } = useUser()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "" },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onUpdateProfile(data: ProfileFormData) {
    setProfileError(null)
    setProfileSuccess(null)
    setSaving(true)

    const { error } = await authClient.updateUser({ name: data.name })
    if (error) {
      setProfileError(error.message ?? error.statusText ?? "Failed to update profile")
    } else {
      setProfileSuccess("Profile updated successfully")
    }
    setSaving(false)
  }

  async function onChangePassword(data: PasswordFormData) {
    setPasswordError(null)
    setPasswordSuccess(null)
    setChangingPassword(true)

    const { error } = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    if (error) {
      setPasswordError(error.message ?? error.statusText ?? "Failed to change password")
    } else {
      setPasswordSuccess("Password changed successfully")
      passwordForm.reset({ currentPassword: "", newPassword: "", confirmPassword: "" })
    }
    setChangingPassword(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setProfileError(null)
    setProfileSuccess(null)

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      const { error } = await authClient.updateUser({ image: base64 })
      if (error) {
        setProfileError(error.message ?? "Failed to update image")
      } else {
        setProfileSuccess("Profile picture updated")
      }
    }
    reader.readAsDataURL(file)
  }

  if (isPending) {
    return (
      <>
        <Navbar title="Profile" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar title="Profile" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">You need to sign in to view this page.</p>
          <Button onClick={() => router.push("/auth/login")}>Sign in</Button>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar title="Profile" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold">Profile</h2>
            <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="flex items-center gap-6 rounded-lg border bg-card p-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="size-20 rounded-full object-cover"
                />
              ) : (
                <Avatar name={user.name} size="lg" className="size-20 text-lg" />
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Joined {new Date(user.createdAt ?? Date.now()).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold">Personal Information</h3>
            {profileSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" />
                {profileSuccess}
              </div>
            )}
            {profileError && (
              <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {profileError}
              </div>
            )}
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <input
                    {...profileForm.register("name")}
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                {profileForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <input
                    value={user.email}
                    disabled
                    className="flex-1 rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Save className="mr-1.5 size-4" />}
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 font-semibold">Change Password</h3>
            {passwordSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" />
                {passwordSuccess}
              </div>
            )}
            {passwordError && (
              <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {passwordError}
              </div>
            )}
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Current Password</label>
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">New Password</label>
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    type="password"
                    {...passwordForm.register("newPassword")}
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-muted-foreground" />
                  <input
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    className="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" disabled={changingPassword}>
                {changingPassword ? <Loader2 className="mr-1.5 size-4 animate-spin" /> : <Lock className="mr-1.5 size-4" />}
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </form>
          </div>

          <div className="rounded-lg border border-destructive/20 bg-card p-6">
            <h3 className="mb-2 font-semibold text-destructive">Danger Zone</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
    </>
  )
}
