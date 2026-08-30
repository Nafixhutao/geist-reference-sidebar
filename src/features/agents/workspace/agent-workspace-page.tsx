"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadAgents, saveAgents } from "../agent-store";
import type { Agent } from "../types";
import { AgentWorkspace } from "./agent-workspace";

/** Client lookup wrapper: the workspace is a nested route, and agents created
 * from the overview live in localStorage — so resolve the agent client-side
 * (same pattern as ProjectClientLookup). */
export function AgentWorkspacePage({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<Agent | null | undefined>(undefined);

  useEffect(() => {
    setAgent(loadAgents().find((item) => item.id === agentId) ?? null);
  }, [agentId]);

  if (agent === undefined) {
    return <div className="min-h-dvh bg-[var(--projects-bg)]" aria-busy="true" />;
  }

  if (agent === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[var(--projects-bg)] px-4 text-center">
        <p className="m-0 text-[15px] font-semibold text-[var(--projects-text)]">Agent not found</p>
        <p className="m-0 text-[13px] text-[var(--projects-muted)]">This agent does not exist or was deleted.</p>
        <Link
          href="/agent"
          className="mt-1 inline-flex h-10 items-center rounded-[10px] border border-[var(--projects-border)] px-4 text-[13px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]"
        >
          Back to agents
        </Link>
      </div>
    );
  }

  const handleAgentChange = (next: Agent) => {
    setAgent(next);
    const all = loadAgents();
    const updated = all.some((item) => item.id === next.id)
      ? all.map((item) => (item.id === next.id ? next : item))
      : [next, ...all];
    saveAgents(updated);
  };

  return <AgentWorkspace agent={agent} onAgentChange={handleAgentChange} />;
}
