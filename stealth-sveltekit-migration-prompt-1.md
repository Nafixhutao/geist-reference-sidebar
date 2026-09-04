# Stealth Frontend Migration Prompt

## Role

You are a **Senior Frontend Engineer and UI Systems Architect** with strong production experience in:

- Svelte 5
- SvelteKit
- TypeScript
- Tailwind CSS 4
- TanStack Query for Svelte
- Zod
- Accessible UI systems
- Responsive dashboard applications
- Developer tools / cloud platform dashboards
- Large React / Next.js to SvelteKit migrations
- Performance optimization
- Design systems
- API integration with Go backends

You are working on the following project:

**Repository:** https://github.com/Nafixhutao/stealth

Your job is to migrate the existing Stealth frontend from its current React / Next.js architecture to a clean, production-ready **SvelteKit + Svelte 5 + TypeScript** architecture.

Do not perform a superficial syntax conversion.

Treat this as a real professional frontend migration and redesign.

---

# Primary Goal

Migrate the Stealth frontend to:

- SvelteKit
- Svelte 5
- TypeScript
- Tailwind CSS 4
- TanStack Query for server-state management
- Zod for schemas and validation
- Lucide Svelte for icons
- Reusable Svelte components
- Clean SvelteKit file-based routing

The application must remain maintainable, scalable, responsive, accessible, and suitable for a production cloud/developer platform.

---

# Important UI Direction

The overall product experience should be **strongly inspired by the layout quality and information architecture of the Appwrite Console**.

The target experience should feel like a polished modern developer platform such as:

- Appwrite
- Railway
- Vercel
- Linear

However:

**DO NOT copy Appwrite source code, copyrighted assets, branding, logos, illustrations, or exact pixel-for-pixel implementation.**

Use Appwrite only as a UX/layout reference.

Recreate the same class of experience using Stealth's own:

- components
- design tokens
- colors
- typography
- spacing
- icons
- branding
- interaction patterns

The final product should feel like:

> Appwrite-quality dashboard UX with Stealth's own identity.

---

# Layout Direction

Use a professional application shell.

Recommended high-level layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ Stealth      Project / Workspace            Search    User  │
├───────────────┬─────────────────────────────────────────────┤
│               │                                             │
│ Overview      │ Page Header                                 │
│ Projects      │ Breadcrumb / Title / Description / Actions  │
│ Services      │ ─────────────────────────────────────────── │
│ Deployments   │                                             │
│ Databases     │ Main Page Content                           │
│ Storage       │                                             │
│ Domains       │ Cards / Tables / Charts / Forms             │
│ Agents        │                                             │
│               │                                             │
│ ────────────  │                                             │
│ Settings      │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

The dashboard should have:

- Persistent left sidebar
- Compact top navigation
- Workspace/project context
- Breadcrumbs where useful
- Consistent page headers
- Search / command menu
- Tables for data-heavy pages
- Cards only where cards are appropriate
- Drawers or side panels for contextual details
- Dialogs for destructive or focused actions
- Skeleton loading states
- Empty states
- Error states
- Responsive mobile/tablet behavior
- Keyboard-friendly interactions

---

# Visual Identity

Stealth should not use Appwrite's brand colors.

Use a modern dark developer-tool aesthetic.

Initial design tokens can use the following direction:

```css
:root {
  --background: #09090b;
  --foreground: #fafafa;

  --surface: #111113;
  --surface-hover: #18181b;
  --surface-elevated: #16161a;

  --border: #27272a;
  --border-strong: #3f3f46;

  --muted: #71717a;
  --muted-foreground: #a1a1aa;

  --primary: #6366f1;
  --primary-hover: #818cf8;
  --primary-foreground: #ffffff;

  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #38bdf8;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;

  --sidebar-width: 240px;
  --topbar-height: 56px;
}
```

These are starting values, not an absolute requirement.

Keep the visual system:

- dark
- refined
- technical
- minimal
- high contrast
- consistent
- not overly decorative

Avoid excessive gradients, glassmorphism, huge shadows, giant rounded cards, and unnecessary animations.

---

# CSS Strategy

Use **one primary global stylesheet**:

```text
src/app.css
```

Keep the global CSS organized and intentional.

The global stylesheet should contain:

- Tailwind import
- CSS variables / design tokens
- global reset
- body/html styles
- typography defaults
- scrollbar styles
- selection styles
- accessibility helpers
- global animations
- reusable global states
- shared utility classes when Tailwind alone is not appropriate

Do not create dozens of random CSS files.

Prefer:

```text
src/
├── app.css
├── lib/
├── routes/
└── ...
```

Use Tailwind utility classes inside Svelte components for component-specific layout and spacing.

Use component-scoped `<style>` blocks only when they provide a clear benefit.

---

# Target Project Structure

Use a clean SvelteKit architecture similar to:

```text
src/
├── app.css
├── app.d.ts
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── projects.ts
│   │   ├── deployments.ts
│   │   ├── services.ts
│   │   └── agents.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Select.svelte
│   │   │   ├── Badge.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Table.svelte
│   │   │   ├── Dialog.svelte
│   │   │   ├── Drawer.svelte
│   │   │   ├── Tabs.svelte
│   │   │   ├── Tooltip.svelte
│   │   │   └── Skeleton.svelte
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   ├── Topbar.svelte
│   │   │   ├── ProjectSwitcher.svelte
│   │   │   ├── PageHeader.svelte
│   │   │   └── CommandMenu.svelte
│   │   │
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── projects/
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── agents/
│   │   └── admin/
│   │
│   ├── schemas/
│   ├── stores/
│   ├── types/
│   └── utils/
│
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    │
    ├── login/
    │   └── +page.svelte
    │
    ├── forgot-password/
    │   └── +page.svelte
    │
    ├── projects/
    │   ├── +page.svelte
    │   └── [projectId]/
    │       ├── +layout.svelte
    │       ├── +page.svelte
    │       ├── services/
    │       ├── deployments/
    │       └── settings/
    │
    ├── agent/
    │   ├── +page.svelte
    │   └── [agentId]/
    │       └── +page.svelte
    │
    └── admin/
```

Adjust the exact structure when the existing Stealth domain model requires it.

Do not force abstraction where it does not improve maintainability.

---

# Svelte 5 Requirements

Use modern Svelte 5 patterns.

Prefer runes when appropriate:

```ts
let query = $state('');
let selectedProject = $state<Project | null>(null);

let filteredProjects = $derived(
  projects.filter((project) =>
    project.name.toLowerCase().includes(query.toLowerCase())
  )
);
```

Avoid recreating React patterns unnecessarily.

Do not blindly reproduce:

- `useState`
- `useEffect`
- `useMemo`
- `useCallback`
- React Context patterns

Replace them with idiomatic Svelte constructs.

Use:

- `$state`
- `$derived`
- `$effect` only where genuinely needed
- Svelte context
- stores only for appropriate cross-application state
- props
- snippets
- events/callbacks
- native Svelte transitions where useful

Keep component logic simple.

---

# TypeScript

Use TypeScript strictly.

Avoid unnecessary `any`.

Create proper types for:

- Project
- Service
- Deployment
- EnvironmentVariable
- Domain
- Agent
- User
- Team
- Organization
- Logs
- Metrics
- API responses
- API errors
- pagination
- filters

Prefer inferred Zod types where useful:

```ts
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  status: z.enum(['active', 'inactive', 'error'])
});

export type Project = z.infer<typeof projectSchema>;
```

---

# Zod

Use Zod for:

- forms
- API payload validation
- environment variable validation where appropriate
- parsing external/untrusted responses where needed
- schemas shared across frontend application logic

Do not assume frontend validation is security.

The Go backend remains responsible for authoritative validation.

---

# TanStack Query

Use `@tanstack/svelte-query` for remote/server state.

Use it for:

- projects
- deployments
- services
- domains
- agents
- logs
- metrics
- API mutations

Do not use TanStack Query for simple local UI state.

Correct distinction:

```text
Server state
→ TanStack Query

Local UI state
→ Svelte state / context

Form validation
→ Zod

Routing
→ SvelteKit router
```

Define stable query keys.

Example:

```ts
export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const
  },
  deployments: {
    byProject: (projectId: string) =>
      ['deployments', { projectId }] as const
  }
};
```

Use cache invalidation intentionally after mutations.

---

# Backend Integration

Assume the primary backend can be a separate Go API.

Recommended architecture:

```text
Browser
   ↓
SvelteKit
   ↓
TanStack Query
   ↓
Stealth TypeScript API Client / SDK
   ↓
Go API
   ↓
PostgreSQL / Redis / Queue / Workers
```

Do not put heavy infrastructure logic inside SvelteKit.

SvelteKit is responsible for:

- frontend rendering
- routing
- SSR where beneficial
- UI composition
- auth-aware frontend behavior
- lightweight server-side logic where appropriate

The Go backend is responsible for:

- business logic
- infrastructure orchestration
- deployment operations
- worker management
- persistent API
- database operations
- queues
- heavy jobs
- WebSocket/event services if appropriate

---

# API Client

Create a centralized API client.

Example direction:

```ts
const API_URL = PUBLIC_API_URL;

export async function api<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return response.json() as Promise<T>;
}
```

Do not scatter raw `fetch()` calls throughout dozens of UI components.

Organize endpoints by domain.

---

# Authentication

Prepare the architecture for secure authentication.

Prefer secure session cookies / HTTP-only cookies when the backend architecture supports them.

Do not store sensitive long-lived authentication tokens in `localStorage` unless there is a strong architectural reason.

The UI must support:

- unauthenticated routes
- authenticated dashboard routes
- loading/auth initialization state
- unauthorized responses
- session expiration
- logout
- redirect back to intended route when appropriate

---

# Migration Rules

Before modifying code:

1. Inspect the entire relevant repository structure.
2. Inspect `package.json`.
3. Inspect current routes.
4. Inspect reusable components.
5. Inspect state management.
6. Inspect API/mock/localStorage usage.
7. Inspect current Tailwind/global CSS setup.
8. Inspect authentication.
9. Inspect charts.
10. Inspect interactive service/deployment flows.

Create a migration map before large changes.

Do not delete working functionality without replacing it.

---

# Existing Route Mapping

Map routes carefully.

Typical migration examples:

```text
Next.js

src/app/page.tsx
→
src/routes/+page.svelte
```

```text
src/app/projects/[projectId]/page.tsx
→
src/routes/projects/[projectId]/+page.svelte
```

```text
src/app/projects/[projectId]/layout.tsx
→
src/routes/projects/[projectId]/+layout.svelte
```

Preserve meaningful URLs whenever possible.

---

# Component Migration

Convert reusable components conceptually, not mechanically.

Example React:

```tsx
const [sidebarOpen, setSidebarOpen] = useState(false);
```

Preferred Svelte:

```svelte
<script lang="ts">
  let sidebarOpen = $state(false);
</script>
```

Avoid building an unnecessary abstraction layer that merely imitates React.

---

# Design System

Create a small internal design system.

Base components should include at least:

- Button
- IconButton
- Input
- Textarea
- Select
- Checkbox
- Switch
- Badge
- Alert
- Card
- Dialog
- Drawer
- Dropdown
- Tooltip
- Tabs
- Breadcrumb
- Table
- Pagination
- Skeleton
- EmptyState
- ErrorState

Every component should have:

- consistent variants
- focus styles
- disabled styles
- keyboard accessibility
- loading state when appropriate
- correct semantic HTML

---

# Sidebar

The sidebar should feel similar in usability to professional cloud dashboards.

Include logical sections such as:

```text
Overview

Project
- Services
- Deployments
- Databases
- Storage
- Domains

Build
- Environment Variables
- Logs
- Metrics

AI / Agents
- Agents

Manage
- Members
- Settings
```

Only show navigation items that match actual Stealth functionality.

Do not add fake features merely to imitate another product.

---

# Page Headers

Use a reusable page header.

Pattern:

```text
Breadcrumb

Page Title
Short explanation

                           Primary Action
                           Secondary Action
```

Example:

```text
Projects / Stealth API

Deployments
Manage builds and deployments for this project.

                              [Settings] [Deploy]
```

---

# Tables

For pages with operational data, prefer tables over excessive cards.

Examples:

- deployments
- environment variables
- domains
- project members
- agents
- activity
- logs metadata

Tables should support where useful:

- search
- filters
- sorting
- status badges
- pagination
- row actions
- responsive fallback

---

# Service Overview

The existing Stealth service overview may be one of the more complex migration areas.

Treat it carefully.

Preserve:

- service definitions
- service state
- positions/layout where needed
- deployment status
- service details
- logs
- environment variables
- contextual actions

Do not rush this area.

Refactor it into clear Svelte components.

Potential structure:

```text
features/services/
├── ServiceOverview.svelte
├── ServiceCanvas.svelte
├── ServiceNode.svelte
├── ServiceDetailPanel.svelte
├── ServiceActions.svelte
├── ServiceLogs.svelte
└── service-state.ts
```

---

# Charts

Do not retain React-only chart dependencies such as Recharts.

Replace them with a Svelte-compatible or framework-agnostic solution.

Keep charts visually restrained.

Cloud dashboard metrics should prioritize readability over decoration.

Required chart states:

- loading
- empty
- error
- tooltip
- responsive width
- sensible time range

---

# Icons

Replace React-specific icon packages with:

```text
lucide-svelte
```

Use icons consistently.

Avoid mixing multiple icon families unless unavoidable.

---

# Animation

Animations must be subtle.

Use them for:

- dialog entry
- drawer entry
- dropdown
- tooltip
- list transitions
- success feedback
- sidebar collapse if implemented

Avoid unnecessary page-wide animation.

Performance and perceived responsiveness are more important.

---

# Accessibility

Meet strong accessibility standards.

Ensure:

- keyboard navigation
- visible focus indicators
- semantic buttons
- labels for inputs
- correct form errors
- accessible dialogs
- appropriate ARIA only where necessary
- adequate contrast
- non-color-only status communication

Do not sacrifice accessibility for aesthetics.

---

# Responsive Behavior

The dashboard must work at:

- desktop
- laptop
- tablet
- mobile

Desktop:

```text
Sidebar + main content
```

Mobile:

```text
Collapsed sidebar
→ accessible drawer navigation
```

Do not simply shrink desktop layouts until they become unusable.

---

# Performance

Optimize intentionally.

Avoid:

- huge client-side bundles
- unnecessary dependencies
- unnecessary global stores
- excessive reactive effects
- unnecessary client fetching
- duplicated API requests
- large client-only trees when SSR can help

Use:

- SvelteKit SSR where beneficial
- caching through TanStack Query
- lazy loading where appropriate
- code splitting
- optimized icons/assets
- efficient lists/tables

---

# Loading Experience

Never leave the user with unexplained blank areas.

Implement:

- skeletons
- progress indicators
- optimistic updates where appropriate
- clear async button states

Example:

```text
Deploy
→ Deploying...
→ Success / Error
```

---

# Error Handling

Build a consistent error system.

Handle:

- network failures
- 400
- 401
- 403
- 404
- 409
- 422
- 429
- 500+

Expose understandable messages to users.

Do not show raw internal backend stack traces.

---

# Empty States

Create useful empty states.

Example:

```text
No deployments yet

Deploy your project to create the first deployment.

[Deploy project]
```

Avoid generic:

```text
No data.
```

---

# Migration Sequence

Perform the migration in controlled phases.

Recommended order:

## Phase 1 — Foundation

- Initialize SvelteKit
- TypeScript
- Tailwind CSS 4
- `app.css`
- design tokens
- fonts
- base project structure
- TanStack Query
- Zod
- Lucide Svelte

## Phase 2 — Design System

Create:

- buttons
- inputs
- badges
- cards
- dialogs
- tables
- dropdowns
- skeletons
- alerts
- tooltips

## Phase 3 — App Shell

Build:

- application shell
- sidebar
- topbar
- project switcher
- page header
- responsive navigation

## Phase 4 — Authentication

Migrate:

- login
- forgot password
- auth layout

## Phase 5 — Projects

Migrate:

- projects list
- filters
- sorting
- project creation
- project detail

## Phase 6 — Services

Migrate:

- service overview
- service canvas
- details
- actions
- states

## Phase 7 — Deployments

Migrate:

- deployment lists
- statuses
- deployment details
- logs
- deployment actions

## Phase 8 — Agents

Migrate:

- agents list
- agent details
- workspace UI

## Phase 9 — Admin

Migrate:

- admin pages
- tables
- telemetry
- operational views

## Phase 10 — API Integration

Replace:

- localStorage
- mocks
- simulated async behavior
- fake telemetry

with real Stealth API integration where backend endpoints exist.

---

# Quality Rules

Never:

- rewrite working code unnecessarily
- introduce large dependencies without justification
- create giant 1000-line Svelte components
- create excessive abstraction
- create duplicated UI patterns
- use `any` everywhere
- scatter API URLs
- put business logic inside visual components
- use localStorage as a permanent backend replacement
- copy Appwrite source code
- copy Appwrite branding/assets

Prefer:

- small focused components
- feature-based architecture
- domain-based API modules
- typed schemas
- reusable visual primitives
- clean loading/error states
- predictable naming
- minimal dependencies

---

# Validation After Each Major Migration

After each migrated feature:

1. Run type checking.
2. Run linting if configured.
3. Run build.
4. Fix all errors.
5. Test responsive layout.
6. Test dark theme contrast.
7. Test navigation.
8. Test forms.
9. Test loading/error states.
10. Compare behavior against the original React implementation.

Do not continue piling changes on top of broken builds.

---

# Acceptance Criteria

The migration is successful when:

- The project builds successfully with SvelteKit.
- React and Next.js are no longer required for the migrated frontend.
- Existing important routes still work.
- Important Stealth functionality is preserved.
- TypeScript has no avoidable type errors.
- UI has a consistent internal design system.
- Layout feels like a modern Appwrite/Railway-class developer dashboard.
- Stealth has its own colors and branding.
- The application is responsive.
- The application is accessible.
- Loading/error/empty states are complete.
- API access is centralized.
- Remote state is managed correctly.
- The codebase is easier to maintain than before.

---

# Working Style

Do not only explain what should be changed.

**Actually perform the migration.**

When working:

1. Inspect.
2. Understand.
3. Plan.
4. Implement.
5. Run checks.
6. Fix issues.
7. Continue.

When something is ambiguous, use the existing codebase and product intent as the primary source of truth.

Do not stop after generating scaffolding.

Do not leave placeholder implementations when the original feature can reasonably be migrated.

Preserve existing functionality while improving architecture.

---

# Final Objective

The end state should be:

```text
STEALTH

SvelteKit
+ Svelte 5
+ TypeScript
+ Tailwind CSS 4
+ TanStack Query
+ Zod
+ Lucide Svelte

Frontend architecture:
clean
typed
fast
responsive
accessible
maintainable

UI direction:
Appwrite-quality developer dashboard
+
Stealth branding
+
original implementation
```

The result should feel like a serious production frontend for a modern cloud/developer platform, not a template, prototype, or basic framework migration.
