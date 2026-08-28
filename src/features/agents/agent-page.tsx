"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, Bot, ChevronLeft, ChevronDown, ChevronRight, Coins, Menu, MoreVertical, Plus, Search, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplicationShell } from "@/components/application-shell";
import { agents, formatRequests, formatTokens } from "./data";
import { AIChat } from "./chat-panel";
import { RegionFlag, regionCountryName } from "@/components/region-flag";
import type { Agent, AgentStatus } from "./types";

type AgentSort = "name-asc" | "name-desc";

const agentTableColumns =
  "grid-cols-[minmax(240px,1.6fr)_minmax(130px,.85fr)_minmax(100px,.65fr)_minmax(150px,1fr)_minmax(100px,.65fr)_minmax(90px,.6fr)_40px]";

function StatusChip({ status }: { status: AgentStatus }) {
  const isActive = status === "active";

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
        isActive
          ? "bg-[color-mix(in_srgb,var(--projects-accent)_16%,transparent)] text-[var(--projects-accent)]"
          : "bg-[color-mix(in_srgb,var(--projects-muted)_14%,transparent)] text-[var(--projects-muted)]",
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", isActive ? "bg-[var(--projects-accent)]" : "bg-[var(--projects-muted)]")}
        aria-hidden="true"
      />
      {isActive ? "Active" : "Idle"}
    </span>
  );
}

type StatCardProps = {
  icon: typeof Bot;
  label: string;
  value: string;
  subtext: string;
  percent: number;
};

function StatCard({ icon: Icon, label, value, subtext, percent }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-4 transition-colors hover:border-[var(--projects-border-hover)] sm:p-5">
      <div className="flex items-center gap-2.5">
        <Icon size={15} strokeWidth={1.9} className="shrink-0 text-[var(--projects-accent)]" aria-hidden="true" />
        <span className="truncate text-[13px] font-medium leading-5 text-[var(--projects-muted)]">{label}</span>
      </div>

      <p className="m-0 mt-4 text-[28px] font-semibold leading-9 tracking-[-0.02em] tabular-nums text-[var(--projects-text)]">
        {value}
      </p>

      <div className="mt-auto flex items-baseline justify-between gap-2 pt-4">
        <span className="text-[12px] leading-4 text-[var(--projects-muted)]">{subtext}</span>
        <span className="projects-mono text-[11px] leading-4 text-[var(--projects-muted)]">{Math.round(percent)}%</span>
      </div>

      <div
        className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--projects-progress-track)]"
        role="progressbar"
        aria-label={`${label} usage`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span
          className="block h-full min-w-0 rounded-full bg-[var(--projects-accent)] transition-[width]"
          style={{ width: `${percent > 0 ? Math.max(percent, 2) : 0}%` }}
        />
      </div>
    </div>
  );
}

const stats = [
  { label: "Active agents", subtext: "of 4 deployed", percent: 50 },
  { label: "Requests (24h)", subtext: "of 2,000 quota", percent: 62 },
  { label: "Avg latency", subtext: "target under 600 ms", percent: 58 },
  { label: "Tokens (24h)", subtext: "of 1M quota", percent: 32 },
] as const;

function AgentRow({ agent }: { agent: Agent }) {
  const isIdle = agent.status === "idle";

  return (
    <article className={cn("group relative grid min-w-[1000px] items-center border-t border-[var(--projects-divider)] bg-[var(--projects-card-bg)] px-5 py-3.5 transition-colors hover:bg-[var(--projects-control)]", agentTableColumns)}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border-hover)] bg-[var(--projects-control)] text-[var(--projects-accent)]">
          <Bot size={18} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-semibold leading-5 text-[var(--projects-text)]">{agent.name}</span>
          <span className="mt-0.5 block truncate text-[12px] leading-4 text-[var(--projects-muted)]">{agent.description}</span>
        </span>
      </div>
      <span className="projects-mono truncate text-[12.5px] text-[var(--projects-text)]">{agent.model}</span>
      <span><StatusChip status={agent.status} /></span>
      <span className="flex min-w-0 items-center gap-2 truncate text-[13px] text-[var(--projects-muted)]">
        <RegionFlag country={agent.regionCountry} />
        <span className="truncate" title={`${regionCountryName(agent.regionCountry)} · ${agent.region}`}>
          {agent.region}
        </span>
      </span>
      <span className="projects-mono truncate text-[12.5px] tabular-nums text-[var(--projects-text)]">
        {formatRequests(agent.requests24h)}
      </span>
      <span className="projects-mono truncate text-[12.5px] tabular-nums text-[var(--projects-muted)]">
        {isIdle && agent.requests24h === 0 ? "—" : `${formatRequests(agent.latencyMs)} ms`}
      </span>
      <button
        type="button"
        aria-label={`Agent actions for ${agent.name}`}
        className="inline-flex size-10 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]"
      >
        <MoreVertical size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </article>
  );
}

function SelectField<T extends string>({ value, onChange, label, minWidth, children }: {
  value: T;
  onChange: (value: T) => void;
  label: string;
  minWidth: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("relative inline-flex h-10 items-center rounded-md border border-[var(--projects-border-hover)] bg-[var(--projects-surface)]", minWidth)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-3 pr-8 text-xs font-medium leading-4 text-[var(--projects-text)] outline-none"
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-2.5 text-[var(--projects-muted)]"
        aria-hidden="true"
      />
    </label>
  );
}

export function AgentPage({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const shell = useApplicationShell();
  const openSidebar = onOpenSidebar ?? shell?.openSidebar;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AgentStatus | "all">("all");
  const [sort, setSort] = useState<AgentSort>("name-asc");

  const visibleAgents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return agents
      .filter((agent) => {
        const matchesQuery = [agent.name, agent.description, agent.model, agent.region].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
        const matchesStatus = status === "all" || agent.status === status;
        return matchesQuery && matchesStatus;
      })
      .toSorted((first, second) => {
        const comparison = first.name.localeCompare(second.name);
        return sort === "name-asc" ? comparison : -comparison;
      });
  }, [query, sort, status]);

  const activeCount = agents.filter((agent) => agent.status === "active").length;
  const requestsTotal = agents.reduce((sum, agent) => sum + agent.requests24h, 0);
  const avgLatency = agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.latencyMs, 0) / agents.length) : 0;
  const tokensTotal = agents.reduce((sum, agent) => sum + agent.tokens24h, 0);

  const statValues = [
    `${activeCount}`,
    formatRequests(requestsTotal),
    `${formatRequests(avgLatency)} ms`,
    formatTokens(tokensTotal),
  ];

  return (
    <section className="min-h-dvh bg-[var(--projects-bg)] px-4 pb-12 pt-14 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="relative border-b border-[var(--projects-border)] pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="m-0 text-[28px] font-semibold leading-8 tracking-[-0.035em] text-[var(--projects-text)]">
                  Agents
                </h1>
                <span className="inline-flex h-7 items-center rounded-full bg-[color-mix(in_srgb,var(--projects-accent)_14%,transparent)] px-2.5 text-xs font-medium text-[var(--projects-accent)]">
                  {agents.length} agents
                </span>
              </div>
              <p className="m-0 mt-2 text-[14px] leading-5 text-[var(--projects-muted)]">
                Deploy and monitor your AI agents
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:absolute lg:right-0 lg:top-5">
              {openSidebar && (
                <button
                  type="button"
                  onClick={onOpenSidebar}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--projects-border)] px-3 text-xs font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04] lg:hidden"
                >
                  <Menu size={15} strokeWidth={1.8} aria-hidden="true" />
                  Menu
                </button>
              )}
              <button
                type="button"
                className="inline-flex h-10 min-w-[136px] items-center justify-center gap-2 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-4 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[var(--projects-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--projects-accent)]/70"
              >
                <Plus size={15} strokeWidth={1.8} aria-hidden="true" />
                New agent
              </button>
            </div>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} icon={[Bot, Activity, Timer, Coins][index]} {...stat} value={statValues[index]} />
          ))}
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="flex h-10 min-w-[220px] flex-1 items-center rounded-md border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3 transition-colors focus-within:border-[var(--projects-border-hover)] sm:max-w-[318px]">
              <Search
                size={16}
                strokeWidth={1.8}
                className="mr-2.5 shrink-0 text-[var(--projects-muted)]"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search agents"
                aria-label="Search agents"
                className="min-w-0 flex-1 bg-transparent text-[13px] leading-[18px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)] [&::-webkit-search-cancel-button]:hidden"
              />
            </label>

            <SelectField value={status} onChange={setStatus} label="Filter agents by status" minWidth="min-w-[128px]">
              <option value="all">Status: All</option>
              <option value="active">Status: Active</option>
              <option value="idle">Status: Idle</option>
            </SelectField>

            <SelectField value={sort} onChange={setSort} label="Sort agents by name" minWidth="min-w-[152px]">
              <option value="name-asc">Sort: Name (A–Z)</option>
              <option value="name-desc">Sort: Name (Z–A)</option>
            </SelectField>
          </div>

          {visibleAgents.length > 0 ? (
            <div className="mt-5 overflow-x-auto rounded-md border border-[var(--projects-border)]">
              <div className="min-w-[1000px]">
                <div
                  className={cn(
                    "grid items-center bg-[var(--projects-control)] px-5 py-3 text-[12px] font-medium text-[var(--projects-muted)]",
                    agentTableColumns,
                  )}
                >
                  <span>Agent name</span>
                  <span>Model</span>
                  <span>Status</span>
                  <span>Region</span>
                  <span>Requests (24h)</span>
                  <span>Latency</span>
                  <span aria-hidden="true" />
                </div>
                {visibleAgents.map((agent) => (
                  <AgentRow key={agent.id} agent={agent} />
                ))}
                <footer className="flex items-center justify-between gap-4 border-t border-[var(--projects-divider)] bg-[var(--projects-card-bg)] px-5 py-3">
                  <p className="m-0 text-xs text-[var(--projects-muted)]">
                    Showing {visibleAgents.length} of {visibleAgents.length} {visibleAgents.length === 1 ? "agent" : "agents"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled
                      className="inline-flex size-7 items-center justify-center rounded-md border border-[var(--projects-border)] text-[var(--projects-muted)] opacity-50"
                    >
                      <ChevronLeft size={14} strokeWidth={2} aria-hidden="true" />
                    </button>
                    <span className="projects-mono inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-[var(--projects-control)] px-1.5 text-xs text-[var(--projects-text)]">
                      1
                    </span>
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled
                      className="inline-flex size-7 items-center justify-center rounded-md border border-[var(--projects-border)] text-[var(--projects-muted)] opacity-50"
                    >
                      <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </div>
                </footer>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-[var(--projects-border)] px-4 py-12 text-center">
              <p className="m-0 text-[14px] text-[var(--projects-muted)]">No agents found.</p>
              <p className="m-0 mt-1 text-xs text-[var(--projects-muted)]/75">
                Try another search term or change the status filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <AIChat />
    </section>
  );
}
