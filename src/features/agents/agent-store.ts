import { SEED_AGENTS } from "./data";
import type { Agent, AgentRole, AgentTool } from "./types";

const STORAGE_KEY = "geist-agents-v1";

/** Load agents from localStorage, falling back to the seed roster. Mirrors the
 * project-store pattern: server render and first client render see the seed,
 * localStorage is merged in after hydration. */
export function loadAgents(): Agent[] {
  if (typeof window === "undefined") return SEED_AGENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_AGENTS;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return SEED_AGENTS;
    return parsed as Agent[];
  } catch {
    return SEED_AGENTS;
  }
}

export function saveAgents(agents: Agent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  } catch {
    // Storage full or unavailable — the mock keeps working in memory only.
  }
}

export interface CreateAgentInput {
  name: string;
  role: AgentRole;
  description: string;
  provider: string;
  model: string;
  project: string;
  branch: string;
  instructions: string;
  tools: AgentTool[];
}

export function buildAgent(input: CreateAgentInput, existingIds: string[]): Agent {
  const base =
    input.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "agent";
  let id = base;
  let counter = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }

  return {
    id,
    name: input.name.trim(),
    description: input.description.trim() || `Coding agent for ${input.project}.`,
    role: input.role,
    status: "idle",
    project: input.project,
    branch: input.branch.trim() || "main",
    provider: input.provider,
    model: input.model,
    lastActiveMinutes: 0,
    tools: input.tools,
    instructions: input.instructions.trim(),
    createdAt: new Date().toISOString(),
  };
}
