"use client";

import { useEffect, useMemo, useState } from "react";
import { AgentHeader } from "./components/agent-header";
import { AgentList } from "./components/agent-list";
import { AgentSummary } from "./components/agent-summary";
import { AgentToolbar, type AgentSort, type RoleFilter, type StatusFilter } from "./components/agent-toolbar";
import { CreateAgentDialog } from "./components/create-agent-dialog";
import { SEED_AGENTS } from "./data";
import { loadAgents, saveAgents } from "./agent-store";
import type { Agent } from "./types";

/**
 * Agents overview — the landing page for coding agents.
 * Data is mock/local-state only: seed roster for the first render, then
 * localStorage merges in after hydration (same pattern as projects).
 */
export function AgentPage() {
  const [agentList, setAgentList] = useState<Agent[]>(SEED_AGENTS);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sort, setSort] = useState<AgentSort>("recent");
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    setAgentList(loadAgents());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveAgents(agentList);
  }, [agentList, ready]);

  const visibleAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = agentList.filter((agent) => {
      const matchesQuery =
        !normalizedQuery ||
        [agent.name, agent.description, agent.role, agent.project, agent.model].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
      const matchesRole = roleFilter === "all" || agent.role === roleFilter;
      return matchesQuery && matchesStatus && matchesRole;
    });

    return filtered.toSorted((first, second) =>
      sort === "name"
        ? first.name.localeCompare(second.name)
        : first.lastActiveMinutes - second.lastActiveMinutes,
    );
  }, [agentList, query, statusFilter, roleFilter, sort]);

  const handleDelete = (id: string) => {
    setAgentList((prev) => prev.filter((agent) => agent.id !== id));
  };

  return (
    <section className="min-h-dvh bg-[var(--projects-bg)] px-4 pb-12 pt-14 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1440px]">
        <AgentHeader count={agentList.length} onNewAgent={() => setCreateOpen(true)} />

        <AgentSummary agents={agentList} />

        <AgentToolbar
          query={query}
          status={statusFilter}
          role={roleFilter}
          sort={sort}
          onQueryChange={setQuery}
          onStatusChange={setStatusFilter}
          onRoleChange={setRoleFilter}
          onSortChange={setSort}
        />

        <AgentList agents={visibleAgents} onDelete={handleDelete} />
      </div>

      <CreateAgentDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        existingIds={agentList.map((agent) => agent.id)}
        onCreate={(agent) => {
          setAgentList((prev) => [agent, ...prev]);
          setCreateOpen(false);
        }}
      />
    </section>
  );
}
