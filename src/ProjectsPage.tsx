"use client";

import { useState } from "react";
import {
  ArrowDownNarrowWide,
  ChevronDown,
  CirclePause,
  Info,
  LayoutGrid,
  List,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RequestsOverview } from "./RequestsOverview";

const usageRows = [
  { label: "EGRESS", value: "0 GB", limit: "5 GB" },
  { label: "DATABASE SIZE", value: "0 GB", limit: "500 MB" },
  { label: "MONTHLY ACTIVE USERS", value: "0", limit: "50,000" },
  { label: "FILE STORAGE", value: "0 GB", limit: "1 GB" },
];

function UsagePanel() {
  return (
    <aside className="h-[210px] w-full rounded-[6px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-[15px] xl:w-[320px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="m-0 text-[13px] font-semibold leading-[18px] text-[var(--projects-text)]">Free plan usage</h2>
          <p className="m-0 text-[12px] leading-[16px] text-[var(--projects-muted)]">Current billing cycle</p>
        </div>
        <button
          type="button"
          className="h-[26px] shrink-0 rounded-[6px] border border-[#078153] bg-[#006d46] px-[11px] text-[12px] font-medium leading-[16px] text-white transition-colors hover:bg-[#087b52]"
        >
          Upgrade to Pro
        </button>
      </div>

      <div className="mt-[17px]">
        {usageRows.map((row) => (
          <div
            key={row.label}
            className="flex h-[34px] items-center border-b border-dashed border-[var(--projects-divider)] last:border-b-0"
          >
            <span className="mr-[10px] size-[14px] shrink-0 rounded-full border-2 border-[var(--projects-ring)]" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-mono text-[10px] font-normal leading-[14px] tracking-[0.02em] text-[var(--projects-text)]">
              {row.label}
            </span>
            <span className="ml-3 shrink-0 font-mono text-[10px] leading-[14px]">
              <strong className="font-semibold text-[var(--projects-text)]">{row.value}</strong>
              <span className="px-[7px] text-[var(--projects-muted)]">/</span>
              <span className="text-[var(--projects-muted)]">{row.limit}</span>
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ProjectCard({ listView }: { listView: boolean }) {
  return (
    <article
      className={cn(
        "relative flex border border-[var(--projects-border)] bg-[var(--projects-card-bg)] transition-colors hover:border-[var(--projects-border-hover)]",
        listView
          ? "h-[92px] w-full items-center justify-between rounded-[6px] px-5"
          : "h-[176px] w-[264px] flex-col rounded-[6px] px-5 pb-5 pt-[25px]",
      )}
    >
      <div className="min-w-0">
        <h2 className="m-0 truncate text-[14px] font-semibold leading-[20px] text-[var(--projects-text)]">app_ig</h2>
        <p className="m-0 mt-[1px] truncate text-[13px] font-normal leading-[18px] text-[var(--projects-muted)]">AWS | ap-southeast-1</p>
      </div>

      <button
        type="button"
        aria-label="Project actions"
        className={cn(
          "absolute inline-flex size-6 items-center justify-center rounded text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]",
          listView ? "right-3 top-2" : "right-[19px] top-[20px]",
        )}
      >
        <MoreVertical size={15} strokeWidth={2} />
      </button>

      <div className={cn("flex items-center", listView ? "mr-9" : "mt-auto")}>
        <span className="mr-2 inline-flex size-6 items-center justify-center rounded-[6px] border border-[var(--projects-border-hover)] text-[var(--projects-muted)]">
          <CirclePause size={13} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-[12px] font-semibold leading-[16px] text-[var(--projects-text)]">Project is paused</span>
        <Info size={12} strokeWidth={1.8} className="ml-2 text-[var(--projects-muted)]" aria-hidden="true" />
      </div>
    </article>
  );
}

export function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const projectVisible = "app_ig".includes(query.trim().toLowerCase());

  return (
    <section className="min-h-[calc(100dvh-48px)] bg-[var(--projects-bg)] px-5 pb-12 pt-10 sm:px-8 lg:px-10 lg:pt-[46px]">
      <div className="mx-auto w-full max-w-[1170px]">
        <h1 className="m-0 text-[22px] font-medium leading-[28px] tracking-[-0.025em] text-[var(--projects-text)]">Projects</h1>

        <div className="mt-[47px] grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="flex min-h-[27px] flex-wrap items-center gap-2">
              <label className="flex h-[27px] w-full max-w-[285px] items-center rounded-[6px] border border-[var(--projects-border)] bg-transparent px-[9px] transition-colors focus-within:border-[var(--projects-border-hover)]">
                <Search size={15} strokeWidth={1.8} className="mr-2 shrink-0 text-[var(--projects-muted)]" aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  type="search"
                  placeholder="Search for a project"
                  aria-label="Search for a project"
                  className="min-w-0 flex-1 bg-transparent text-[13px] font-normal leading-[18px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)] [&::-webkit-search-cancel-button]:hidden"
                />
              </label>

              <button
                type="button"
                className="inline-flex h-[27px] items-center gap-[7px] rounded-[6px] border border-dashed border-[var(--projects-border-hover)] px-[10px] text-[12px] font-medium leading-[16px] text-[var(--projects-text)] transition-colors hover:bg-white/[0.035]"
              >
                Status
                <ChevronDown size={12} strokeWidth={1.8} className="text-[var(--projects-muted)]" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="inline-flex h-[27px] items-center gap-[8px] rounded-[6px] border border-[var(--projects-border-hover)] px-[10px] text-[12px] font-semibold leading-[16px] text-[var(--projects-text)] transition-colors hover:bg-white/[0.035]"
              >
                <ArrowDownNarrowWide size={13} strokeWidth={1.8} className="text-[var(--projects-muted)]" aria-hidden="true" />
                Sorted by name
              </button>

              <div className="ml-auto flex items-center gap-[7px]">
                <button
                  type="button"
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className={cn(
                    "inline-flex size-[27px] items-center justify-center rounded-[6px] text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
                    view === "grid" && "bg-[var(--projects-control)] text-[var(--projects-text)]",
                  )}
                >
                  <LayoutGrid size={14} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  aria-label="List view"
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className={cn(
                    "inline-flex size-[27px] items-center justify-center rounded-[6px] text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
                    view === "list" && "bg-[var(--projects-control)] text-[var(--projects-text)]",
                  )}
                >
                  <List size={15} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className="ml-[1px] inline-flex h-[27px] items-center gap-[8px] rounded-[6px] border border-[#078153] bg-[#006d46] px-[11px] text-[12px] font-semibold leading-[16px] text-white transition-colors hover:bg-[#087b52]"
                >
                  <Plus size={14} strokeWidth={1.8} aria-hidden="true" />
                  New project
                </button>
              </div>
            </div>

            <div className={cn("mt-4", view === "list" && "w-full")}>
              {projectVisible ? (
                <ProjectCard listView={view === "list"} />
              ) : (
                <p className="m-0 py-8 text-[13px] text-[var(--projects-muted)]">No projects found.</p>
              )}
            </div>
          </div>

          <UsagePanel />
        </div>

        <RequestsOverview />
      </div>
    </section>
  );
}
