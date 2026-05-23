import { cn } from "@/lib/utils"

interface AvatarProps extends React.ComponentPropsWithoutRef<"div"> {
  name?: string
  src?: string | null
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-12 text-sm",
}

export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??"

  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500",
    "bg-rose-500", "bg-cyan-500", "bg-pink-500", "bg-lime-500",
  ]
  const colorIndex = name
    ? name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length
    : 0

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-medium text-white",
        sizeClasses[size],
        !src && colors[colorIndex],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || ""} className="size-full rounded-full object-cover" />
      ) : (
        initials
      )}
    </div>
  )
}

export function AvatarGroup({ users, size = "sm", max = 3 }: { users: { id: string; name: string; image?: string | null }[]; size?: "sm" | "md"; max?: number }) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user) => (
        <Avatar key={user.id} name={user.name} size={size} className="ring-2 ring-background" />
      ))}
      {remaining > 0 && (
        <div className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background">
          +{remaining}
        </div>
      )}
    </div>
  )
}
