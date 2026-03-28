# QART — Digital Restaurant Platform

## Overview
QART is a full-stack digital restaurant platform built as a Bun monorepo. It features a React/Vite frontend and an Express/Bun backend with a PostgreSQL database managed via Prisma.

## Architecture

### Monorepo Structure
- `apps/frontend` — React 19 + Vite 8 + Tailwind CSS v4 frontend
- `apps/backend` — Bun + Express 5 backend using Prisma ORM
- `packages/sdk` — Shared business logic, type-safe API client/server factory
- `packages/contracts` — Zod-based API contracts and data schemas

### Key Technologies
- **Runtime**: Bun 1.3.6
- **Frontend**: React 19, Vite 8, Tailwind CSS v4, TanStack Query, Zustand, Framer Motion
- **Backend**: Express 5, Prisma 7 with PostgreSQL adapter-pg
- **Auth**: JWT-based dual-token (CupCake access + Cake refresh) via HttpOnly cookies
- **Database**: PostgreSQL (Replit built-in)

## Development Workflows

### Start Frontend (port 5000)
```
bun --cwd apps/frontend dev
```

### Start Backend (port 3000)
```
bun --cwd apps/backend dev
```

### Run Both (via Replit workflows)
- **Start application** — Frontend on port 5000 (webview)
- **Backend API** — Backend on port 3000 (console)

## Environment Variables
All set as Replit secrets/env vars:
- `BUN_MODE` — "dev" or "prod"
- `BACKEND_PORT` — 3000
- `BACKEND_HOST` — localhost
- `FRONTEND_PORT` — 5000
- `FRONTEND_HOST` — 0.0.0.0
- `VITE_MODE` — "dev" or "prod"
- `VITE_BACKEND_HOST` — localhost
- `VITE_BACKEND_PORT` — 3000
- `DATABASE_URL` — PostgreSQL connection string (Replit managed)
- `SESSION_SECRET` — JWT access token secret (Replit secret)
- `REFRESH_SECRET` — JWT refresh token secret (Replit secret)

## Database
- Managed by Prisma with migrations in `apps/backend/prisma/migrations/`
- Generated client at `apps/backend/prisma/generated/`
- Run migrations: `cd apps/backend && bunx prisma migrate dev`
- Generate client: `cd apps/backend && bunx prisma generate`

## API Endpoints
- `GET /` — Health check
- `POST /iam/login` — User login
- `POST /iam/register` — User registration
- `POST /iam/logout` — Session termination
- `GET /iam/me` — Current session info
- `GET /customers/plates` — Fetch plate catalog

## Theme System
QART uses a dynamic CSS variable theming system:
- **Theme files**: `apps/frontend/public/themes/light.css` and `dark.css` — define all `--qart-*` CSS variables
- **Loading**: `App.tsx` injects a `<link id="qart-theme">` pointing to the active theme file at runtime
- **Tailwind bridge**: `index.css` `@theme` block forwards all `--qart-*` vars to Tailwind color tokens (`--color-qart-*`) and shadow tokens (`--shadow-*`)
- **Dark class**: `main.tsx` toggles `.dark` on `<html>` for any `dark:` Tailwind variants
- **Theme store**: Zustand `useAppStore` holds `mode: 'light' | 'dark'`, persisted in localStorage

### Color Palette Design
**Light mode** — Architectural warm cream:
- Backgrounds: `#F7F3EC` (cream), `#EDE6D8` (sand), `#FFFFFF` (surface)
- Border: `#1A1410` (bold warm black)
- Text: `#1A1410` primary, `#60524A` muted
- Accent: `#C2410C` terracotta

**Dark mode** — Warm charcoal night (NOT an invert of light):
- Backgrounds: `#0D0B09`, `#181410`, `#1E1A16` (three clearly distinct dark warm layers)
- Border: `#3D3530` (warm brown — visible on all dark surfaces)
- Text: `#F0E8E0` (warm off-white), `#8A7E76` muted
- Accent: `#E8621A` (vivid terracotta orange)
- Shadows use accent color `#E8621A` instead of black-on-black

### CSS Token Conventions
- `--qart-text-on-primary` — text color for elements with `bg-qart-primary` background
- `--qart-text-on-accent` — text color for elements with `bg-qart-accent` background (always white)
- Never hardcode shadow colors like `shadow-[*px_#000]` — use `shadow-sharp`, `shadow-hover`, `shadow-accent`, `shadow-warm` classes
- Never use `text-white` on `bg-qart-primary` backgrounds — use `style={{ color: 'var(--qart-text-on-primary)' }}`

## CSS Notes
- Tailwind v4 does not support `@apply` with custom classes defined in `@layer utilities`
- Custom utility classes that need to be applied with `@apply` must have their styles inlined instead
- The `glass-header` styles are inlined in `.auth-navbar` as a workaround for this Tailwind v4 limitation

## Deployment
- Target: autoscale
- Build: `bun install && bun --cwd apps/backend run build && bun --cwd apps/frontend run build`
- Run: backend (port 3000) + frontend preview (port 5000) concurrently
