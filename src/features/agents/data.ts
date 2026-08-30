import type {
  Agent,
  AgentStep,
  AgentTool,
  FileChange,
  WorkspaceMessage,
} from "./types";

export const ALL_TOOLS: AgentTool[] = [
  "Read files",
  "Search code",
  "Edit files",
  "Terminal",
  "Run tests",
  "Git diff",
];

export const AGENT_ROLES: Agent["role"][] = ["General", "Frontend", "Reviewer", "Documentation"];

export const DEFAULT_INSTRUCTIONS = `You are a senior frontend engineer.

Inspect the repository before making changes.
Read project instructions before editing.
Follow the existing design system and project conventions.
Prefer small, focused changes.
Run typecheck after editing.
Do not commit or push changes without approval.`;

export const SEED_AGENTS: Agent[] = [
  {
    id: "frontend-engineer",
    name: "Frontend Engineer",
    description: "Build UI, fix React issues, and refactor frontend components.",
    role: "Frontend",
    status: "active",
    project: "geist-reference-sidebar",
    branch: "main",
    provider: "OpenAI",
    model: "GPT-5.6",
    currentTask: "Improve Agent page",
    lastActiveMinutes: 2,
    tools: [...ALL_TOOLS],
    instructions: DEFAULT_INSTRUCTIONS,
    createdAt: "2026-08-28T09:00:00.000Z",
  },
  {
    id: "code-reviewer",
    name: "Code Reviewer",
    description: "Review changes, identify bugs, and suggest safer implementations.",
    role: "Reviewer",
    status: "idle",
    project: "geist-reference-sidebar",
    branch: "main",
    provider: "OpenAI",
    model: "GPT-5.6 mini",
    lastActiveMinutes: 18,
    tools: ["Read files", "Search code", "Git diff"],
    createdAt: "2026-08-27T14:20:00.000Z",
  },
  {
    id: "documentation-agent",
    name: "Documentation Agent",
    description: "Keep documentation aligned with project changes.",
    role: "Documentation",
    status: "idle",
    project: "geist-reference-sidebar",
    branch: "main",
    provider: "OpenAI",
    model: "GPT-5.6 mini",
    lastActiveMinutes: 65,
    tools: ["Read files", "Search code", "Edit files"],
    createdAt: "2026-08-26T11:45:00.000Z",
  },
];

/** Files touched by the seeded run — +142 / −38 across the three paths. */
export const SEED_CHANGES: FileChange[] = [
  { path: "src/features/agents/agent-page.tsx", additions: 98, deletions: 21, status: "modified" },
  { path: "src/features/agents/components/agent-card.tsx", additions: 31, deletions: 10, status: "added" },
  { path: "src/features/agents/data.ts", additions: 13, deletions: 7, status: "modified" },
];

export function formatLastActive(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

export function createId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

/** Conversation the agent opens with — one finished run, per the reference flow. */
export function buildSeedMessages(): WorkspaceMessage[] {
  return [
    { id: createId("msg"), role: "user", text: "Make the Agent page responsive and improve the mobile layout.", time: "10:30 AM" },
    {
      id: createId("msg"),
      role: "agent",
      text: "I'll inspect the current implementation first.",
      time: "10:31 AM",
      status: "completed",
      steps: [
        { id: createId("step"), type: "read", label: "Read", target: "AGENTS.md", status: "done" },
        { id: createId("step"), type: "read", label: "Read", target: "src/features/agents/agent-page.tsx", status: "done" },
        { id: createId("step"), type: "read", label: "Read", target: "src/components/application-shell.tsx", status: "done" },
        { id: createId("step"), type: "edit", label: "Updated", target: "src/features/agents/agent-page.tsx", status: "done" },
        { id: createId("step"), type: "check", label: "Typecheck passed", target: "npm run typecheck", status: "done" },
      ],
      changes: SEED_CHANGES.map((change) => ({ ...change })),
    },
  ] as WorkspaceMessage[];
}

/** Steps a fresh mock run walks through, in order. */
export function buildRunSteps(): AgentStep[] {
  return [
    { id: createId("step"), type: "search", label: "Search", target: "features/agents", status: "pending" },
    { id: createId("step"), type: "read", label: "Read", target: "src/features/agents/agent-page.tsx", status: "pending" },
    { id: createId("step"), type: "edit", label: "Updated", target: "src/features/agents/agent-page.tsx", status: "pending" },
    { id: createId("step"), type: "command", label: "Typecheck passed", target: "npm run typecheck", status: "pending" },
    { id: createId("step"), type: "command", label: "Build passed", target: "npm run build", status: "pending" },
  ];
}

export function buildRunChanges(): FileChange[] {
  return SEED_CHANGES.map((change) => ({ ...change }));
}

export function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export interface AgentTaskItem {
  id: string;
  title: string;
  detail: string;
  status: "in-progress" | "queued" | "completed";
  meta?: string;
}

export function getAgentTasks(agent: Agent): AgentTaskItem[] {
  const items: AgentTaskItem[] = [];
  if (agent.currentTask) {
    items.push({
      id: "current",
      title: agent.currentTask,
      detail: "Improving the responsive layout and mobile stacking for the agents overview.",
      status: "in-progress",
      meta: "started 2m ago",
    });
    items.push({ id: "queued", title: "Polish empty states", detail: "Add friendly empty states for filtered-out lists.", status: "queued" });
  }
  items.push(
    { id: "t1", title: "Fix sidebar toggle on mobile", detail: "Toggle overlapped the page title on narrow screens.", status: "completed", meta: "2h ago" },
    { id: "t2", title: "Refactor project cards", detail: "Extract shared row primitives into components.", status: "completed", meta: "yesterday" },
    { id: "t3", title: "Write tests for the project store", detail: "Cover load/save and id collisions.", status: "completed", meta: "2d ago" },
  );
  return items;
}

export interface AgentActivityItem {
  id: string;
  icon: "check" | "edit" | "search" | "branch" | "run";
  text: string;
  meta: string;
}

export function getAgentActivity(agent: Agent): AgentActivityItem[] {
  return [
    { id: "a1", icon: "check", text: "Typecheck passed", meta: "npm run typecheck · 2m ago" },
    { id: "a2", icon: "edit", text: "Updated 3 files in src/features/agents", meta: "+142 −38 · 6m ago" },
    { id: "a3", icon: "search", text: "Inspected project structure", meta: "features/agents · 8m ago" },
    { id: "a4", icon: "branch", text: `Synced branch ${agent.branch}`, meta: `${agent.project} · 12m ago` },
    { id: "a5", icon: "run", text: "Agent run started", meta: "run #a3f21c · 14m ago" },
  ];
}
