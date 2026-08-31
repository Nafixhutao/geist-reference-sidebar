# Stealth Console

The web console for **Stealth**, a developer cloud platform. Deploy services,
watch them on a live service canvas, follow pre-deploy flows, inspect usage
and requests, and run AI agents against your projects.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS 4 with a token-based theme in `src/styles/`
- motion/react for interaction animation, recharts for admin telemetry charts
- Geist, Inter Variable, and Source Code Pro as the font stack

## Architecture target

```
Stealth Console (Next.js)
        ↓
Stealth JavaScript SDK / API client
        ↓
Stealth API
        ↓
Stealth backend
```

The console is being wired to the Stealth API. Until each surface is
connected, some views still run on browser-local state; every such location is
inventoried in [docs/api-migration-audit.md](docs/api-migration-audit.md).

## Structure

- `src/app/` — routes (`/`, `/projects/[projectId]`, `/agent`, `/agent/[agentId]`, `/login`, `/forgot-password`, `/admin/*`)
- `src/components/` — cross-feature shell (`application-shell.tsx`, `top-bar.tsx`) and primitives
- `src/features/` — feature-first modules: `projects/` (list, detail, service-overview, pre-deploy), `agents/`, `navigation/`, `auth/`, `admin/`
- `src/lib/`, `src/styles/` — shared utilities and stylesheets

## Development

```bash
npm install
npm run dev        # start dev server
npm run typecheck  # tsc --noEmit
npm run build      # production build
npm run check      # typecheck + build
```
