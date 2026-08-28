import type { Agent } from "./types";

export const agents: Agent[] = [
  {
    id: "support-agent",
    name: "support-agent",
    description: "Answers customer tickets from the knowledge base",
    model: "claude-3.7-sonnet",
    status: "active",
    region: "ap-southeast-1",
    regionCountry: "singapore",
    requests24h: 1284,
    latencyMs: 420,
    tokens24h: 320000,
  },
  {
    id: "code-reviewer",
    name: "code-reviewer",
    description: "Reviews pull requests and suggests fixes",
    model: "claude-3.5-sonnet",
    status: "active",
    region: "ap-southeast-3",
    regionCountry: "indonesia",
    requests24h: 356,
    latencyMs: 510,
    tokens24h: 91000,
  },
  {
    id: "ops-monitor",
    name: "ops-monitor",
    description: "Alerts on infrastructure anomalies",
    model: "gpt-4o",
    status: "idle",
    region: "ap-southeast-1",
    regionCountry: "singapore",
    requests24h: 0,
    latencyMs: 0,
    tokens24h: 0,
  },
  {
    id: "doc-writer",
    name: "doc-writer",
    description: "Drafts release notes and changelogs",
    model: "claude-3.5-haiku",
    status: "idle",
    region: "ap-southeast-3",
    regionCountry: "indonesia",
    requests24h: 12,
    latencyMs: 1180,
    tokens24h: 4200,
  },
];

export function formatRequests(value: number) {
  return value.toLocaleString("en-US");
}

export function formatTokens(value: number) {
  if (value === 0) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}
