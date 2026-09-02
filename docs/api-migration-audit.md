# Stealth Console — API Migration Audit

The long-term architecture is:

```
Stealth Console (Next.js)
        ↓
Stealth JavaScript SDK / API client
        ↓
Stealth API
        ↓
Stealth backend
```

The browser must eventually **not** use `localStorage` as the source of truth
for projects, deployments, agents, usage, or any other product data. This
document inventories every location where the current UI still runs on
in-browser data so each can be migrated to the Stealth API when its surface is
ready. Nothing here is wired to a backend yet — no fake backend was added.

Legend: **[LS]** = localStorage is the authoritative datastore, **[H]** =
hardcoded constant data, **[M]** = generated/simulated mock data, **[S]** =
simulated async behavior (timers standing in for network calls).

---

## Projects & deployments

### `src/features/projects/project-store.ts` — [LS][H]
- Storage key: `"projects-list-v1"`.
- Authoritative datastore for the project list. Creating a project via the
  "New project" dialog writes here; the Projects page reads it and merges it
  with the hardcoded seed list from `data.ts`.
- Migration: project CRUD → Stealth API (`projects` resource). Seeded entries
  become real projects owned by the authenticated account.

### `src/features/projects/data.ts` — [H]
- Hardcoded seed project (`app_ig`) and hardcoded `usageRows` (egress,
  database size, MAU, file storage) shown in the project usage panel.
- Migration: projects from the API; usage metrics from the usage/billing
  endpoints.

### `src/app/projects/[projectId]/page.tsx` — [H][LS]
- Server component resolves the project from the static `data.ts` list; if not
  found it falls back to `ProjectClientLookup`, which reads the localStorage
  store — proof the browser store is treated as authoritative.
- Migration: single API fetch by project ID; drop the client-lookup fallback.

### `src/features/projects/service-overview/use-service-overview.ts` — [LS][M][S]
- Storage keys: `app-ig-service-canvas-v1` (per-project service canvas: node
  positions, service definitions, statuses) and the pre-deploy workflow key
  (see below).
- Simulated deployment transitions (queued → building → deploying → live),
  simulated logs, timers for status changes.
- Migration: service/canvas state from the API; deployment lifecycle via real
  deployment + streaming log endpoints.

### `src/features/projects/pre-deploy/` — [S][LS]
- `pre-deploy-model.ts` + `pre-deploy-flow.tsx`: simulated source/connect
  steps; deployment config and progress are persisted by
  `use-service-overview.ts` under the per-project workflow storage key so the
  flow survives reloads.
- Migration: real deploy creation from a git source; workflow state server-side.

### `src/features/projects/projects-page.tsx` — [LS][H]
- Reads the localStorage project list and merges it with `data.ts` seeds;
  project deletion mutates the localStorage store.
- Migration: list/delete via API.

### `src/features/projects/usage-panel.tsx` — [H]
- Renders `usageRows` from `data.ts` (hardcoded usage numbers).
- Migration: usage endpoints.

## Agents

### `src/features/agents/agent-store.ts` — [LS]
- Storage key: `"stealth-agents-v1"` (formerly `"geist-agents-v1"`).
- Authoritative datastore for agents: seeded on first run from `SEED_AGENTS`,
  create/persist via localStorage.
- Migration: agent CRUD → Stealth API agents resource; hydrate from API.

### `src/features/agents/data.ts` — [H][M][S]
- `SEED_AGENTS` (3 fake agents bound to project `stealth-console`),
  `SEED_CHANGES` (fake file diffs), `buildSeedMessages()` (fake conversation),
  `buildRunSteps()` / `buildRunChanges()` (simulated run steps the workspace
  plays back with timers), `getAgentTasks()` / `getAgentActivity()` (fake
  per-agent task and activity feeds).
- Migration: agents, runs, messages, changes, tasks, and activity from the
  API; run playback replaced by real run events/streaming.

### `src/features/agents/workspace/agent-workspace-page.tsx` — [LS]
- Reads the agent store from localStorage by ID.
- Migration: API fetch by agent ID.

### `src/features/agents/components/create-agent-dialog.tsx` — [H]
- Hardcoded `PROJECTS` list, providers (`OpenAI`, `Anthropic`), and model
  catalogs.
- Migration: project list from API; providers/models from platform catalog.

### `src/features/agents/agent-page.tsx` — [LS]
- Loads/hydrates the agent store from localStorage for the overview list.
- Migration: API list.

## Auth

### `src/features/auth/login-form.tsx` / `forgot-password-form.tsx` — [S]
- Mock sign-in / reset (1.2s timer then redirect). Comments already mark them
  for replacement.
- Migration: real auth endpoints + session handling.

## Admin (`src/features/admin/`)

The entire admin area runs on deterministic generated mock data with a live
tick simulated after hydration. It is already labeled as mock in comments;
migration is wholesale.

### `src/features/admin/data/admin-mock-data.ts` — [M][H]
- Seeded-PRNG generators (mulberry32) for telemetry series, hosts, workers,
  logs, traces, errors, incidents, runs, users, providers, model usage.
- Repository names (`stealth-console`, `stealth-docs-site`,
  `stealth-admin-ui`) and `@stealth.dev` user emails are mock values.
- Migration: replace with admin/observability endpoints.

### `src/features/admin/hooks/use-live-updates.ts` — [M]
- Simulated "live" value drift on an interval. Migration: realtime feed
  (SSE/WebSocket) from the API.

### `src/features/admin/settings/settings-page.tsx` — [S]
- Local state only, nothing persists; save shows a transient confirmation.
- Migration: platform settings API.

### Other admin pages — [M][S]
- `logs-page.tsx` (rotating fake log tail), `incidents/`
  (`create-incident-dialog.tsx` appends a local-only incident),
  `runs-page.tsx` (mock cost field), overview tiles/charts — all consume the
  generators above.
- Migration: real telemetry/logging/incident/run endpoints.

## Navigation chrome

### `src/features/navigation/sidebar-content.tsx` / `profile-menu.tsx` — [H]
- Hardcoded signed-in user identity ("Nafixhutao" / "@nafixhutao", plan badge
  "Pro Plus" with a fake 1.5s load timer), avatar URL pointing at a GitHub
  avatar, hardcoded plan labels.
- Migration: current account/workspace from the API.

### `src/components/top-bar.tsx` — [H]
- Hardcoded avatar image URL.
- Migration: account profile from the API.

## Dev tooling (not product UI)

### `ai-token-usage.html` — [LS][H]
- Standalone AI token-usage tracker used during development of this repo.
  Seed entries are estimates; its own storage keys (`ai-token-usage-*-v1`).
  Not part of the Stealth product — candidate for extraction from the repo,
  but harmless (not shipped by Next.js).
