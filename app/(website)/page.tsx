import Link from "next/link"
import { ArrowRight, Kanban, Users, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center border-b bg-background/80 backdrop-blur-sm px-6">
        <Link href="/" className="font-heading text-xl font-bold tracking-wider">
          CANEV
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Link href="/auth/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Sign in
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.08),transparent)]" />
        <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-xs font-medium">
          Project management, reimagined
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Move work{" "}
          <span className="text-primary">forward</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Canev helps teams organize, track, and manage their projects with
          intuitive Kanban boards. From ideas to done — all in one place.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg">
              Start for free
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Everything you need to ship faster</h2>
            <p className="mt-2 text-muted-foreground">
              Powerful features that help your team stay in sync
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Kanban,
                title: "Kanban Boards",
                description: "Visualize your workflow with drag-and-drop boards. Customize columns to match your process.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Invite members, assign tasks, leave comments, and keep everyone aligned.",
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                description: "See changes as they happen. No more stale status updates or missed notifications.",
              },
              {
                icon: Layers,
                title: "Workspaces",
                description: "Organize projects into workspaces. Keep personal and professional work separate.",
              },
              {
                icon: Kanban,
                title: "Drag & Drop",
                description: "Move cards between lists with intuitive drag and drop. Reorder and prioritize effortlessly.",
              },
              {
                icon: Users,
                title: "Role-based Access",
                description: "Granular permissions from owner to viewer. Control who can edit and who can just watch.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm text-muted-foreground">&copy; 2026 Canev. All rights reserved.</span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
