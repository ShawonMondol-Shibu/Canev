# Canev - CollabBoard Frontend

Kanban-style project management frontend built with **Next.js 16**, **React 19**, **@tanstack/react-query**, and **better-auth**.

## Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** TypeScript (strict)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **State / Server Cache:** [@tanstack/react-query](https://tanstack.com/query) v5
- **Drag & Drop:** [@dnd-kit](https://dndkit.com)
- **Forms:** react-hook-form + zod
- **Auth:** [better-auth](https://better-auth.com) (client SDK)
- **Charts:** recharts
- **Icons:** lucide-react
- **Package Manager:** [Bun](https://bun.sh)

## Getting Started

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

> The backend API runs on `http://localhost:3000`. Make sure it's running as well.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Backend API base URL |

## Project Structure

```
app/
├── (website)/                      # Landing / marketing page
├── auth/
│   ├── login/page.tsx              # Sign-in form
│   └── signup/page.tsx             # Sign-up form
└── dashboard/
    ├── page.tsx                    # Workspace grid
    ├── profile/page.tsx            # User profile
    ├── [workspaceId]/
    │   ├── page.tsx                # Project list
    │   ├── settings/page.tsx       # Workspace settings
    │   └── [projectId]/
    │       └── page.tsx            # Kanban board
components/
├── board/                          # Board, columns, cards, card modal
├── dashboard/                      # Navbar, sidebar, workspace card
└── ui/                             # shadcn/ui components
hooks/
├── use-user.ts                     # Auth session
├── use-workspaces.ts               # Workspace CRUD via API
├── use-projects.ts                 # Project CRUD via API
└── use-board.ts                    # Board (lists + cards) via API
lib/
├── auth-client.ts                  # better-auth client config
├── api.ts                          # Fetch wrapper for backend API
├── types.ts                        # Shared TypeScript types
├── mock-data.ts                    # Mock data (fallback/legacy)
└── utils.ts                        # Utility functions
provider/
└── QueryProvider.tsx               # React Query provider
```

## Features

- **Auth:** Email/password sign-up, sign-in, session management via better-auth
- **Workspaces:** Create, list, view workspaces
- **Projects:** Create, list, view projects within workspaces
- **Board:** Kanban board with drag-and-drop lists and cards
- **Cards:** Create, move between lists, update, delete

## API Endpoints

The frontend connects to `http://localhost:3000` — see the backend README for the full API reference.

| Method | Path | Hook |
|--------|------|------|
| `POST` | `/workspaces` | `useCreateWorkspace` |
| `GET` | `/workspaces?userId=` | `useWorkspaces` |
| `GET` | `/workspaces/:id?userId=` | `useWorkspace` |
| `DELETE` | `/workspaces/:id?userId=` | `useDeleteWorkspace` |
| `POST` | `/projects` | `useCreateProject` |
| `GET` | `/projects?workspaceId=` | `useProjects` |
| `DELETE` | `/projects/:id?workspaceId=` | `useDeleteProject` |
| `POST` | `/lists` | `useCreateList` |
| `GET` | `/lists?projectId=` | `useBoard` |
| `PUT` | `/lists/:id?projectId=` | `useReorderLists` |
| `POST` | `/cards` | `useCreateCard` |
| `GET` | `/cards?listId=` | `useBoard` |
| `PUT` | `/cards/:id` | `useMoveCard`, `useUpdateCard` |
| `DELETE` | `/cards/:id` | `useDeleteCard` |
| `POST` | `/workspace-members` | via `useWorkspace` |
| `GET` | `/workspace-members?workspaceId=` | via `useWorkspace` |

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Next.js dev server |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
