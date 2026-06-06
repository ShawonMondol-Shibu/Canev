"use client"

import { Sun, Moon, Monitor, Check } from "lucide-react"
import Navbar from "@/components/dashboard/navbar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useTheme } from "@/hooks/use-theme"

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <Navbar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Customize your app experience
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-1 font-semibold">Appearance</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Choose how Canev looks for you
            </p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:bg-accent",
                    theme === value && "border-primary bg-primary/5 ring-1 ring-primary",
                  )}
                >
                  <Icon className="size-5" />
                  <span className="text-sm font-medium">{label}</span>
                  {theme === value && <Check className="size-3.5 text-primary" />}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-1 font-semibold">Account</h3>
            <p className="text-sm text-muted-foreground">
              Manage your profile, password, and security in the{" "}
              <a href="/dashboard/profile" className="text-primary underline-offset-2 hover:underline">
                Profile
              </a>{" "}
              section.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
