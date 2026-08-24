import { ArrowDownNarrowWide, ChevronDown, LayoutGrid, List, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectSort, ProjectStatus, ProjectView } from "./types";

type ProjectToolbarProps = {
  query: string;
  status: ProjectStatus | "all";
  sort: ProjectSort;
  view: ProjectView;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | "all") => void;
  onSortChange: () => void;
  onViewChange: (value: ProjectView) => void;
};

function ViewToggle({ view, onViewChange }: Pick<ProjectToolbarProps, "view" | "onViewChange">) {
  return (
    <div className="flex items-center gap-1" aria-label="Project view">
      <button
        type="button"
        aria-label="Grid view"
        aria-pressed={view === "grid"}
        onClick={() => onViewChange("grid")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
          view === "grid" && "bg-[var(--projects-control)] text-[var(--projects-text)]",
        )}
      >
        <LayoutGrid size={14} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="List view"
        aria-pressed={view === "list"}
        onClick={() => onViewChange("list")}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
          view === "list" && "bg-[var(--projects-control)] text-[var(--projects-text)]",
        )}
      >
        <List size={15} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ProjectToolbar({
  query,
  status,
  sort,
  view,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onViewChange,
}: ProjectToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="flex h-8 w-full items-center rounded-md border border-[var(--projects-border)] bg-transparent px-2.5 transition-colors focus-within:border-[var(--projects-border-hover)] sm:w-[285px]">
        <Search
          size={15}
          strokeWidth={1.8}
          className="mr-2 shrink-0 text-[var(--projects-muted)]"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          type="search"
          placeholder="Search for a project"
          aria-label="Search for a project"
          className="min-w-0 flex-1 bg-transparent text-[13px] leading-[18px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <label className="relative inline-flex h-8 min-w-[92px] items-center rounded-md border border-dashed border-[var(--projects-border-hover)]">
        <span className="sr-only">Filter projects by status</span>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as ProjectStatus | "all")}
          className="h-full w-full appearance-none bg-transparent px-2.5 pr-7 text-xs font-medium text-[var(--projects-text)] outline-none"
        >
          <option value="all">Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <ChevronDown
          size={12}
          strokeWidth={1.8}
          className="pointer-events-none absolute right-2 text-[var(--projects-muted)]"
          aria-hidden="true"
        />
      </label>

      <button
        type="button"
        onClick={onSortChange}
        aria-label={`Sort projects by name ${sort === "name-asc" ? "descending" : "ascending"}`}
        className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--projects-border-hover)] px-2.5 text-xs font-semibold leading-4 text-[var(--projects-text)] transition-colors hover:bg-white/[0.035]"
      >
        <ArrowDownNarrowWide size={13} strokeWidth={1.8} className="text-[var(--projects-muted)]" aria-hidden="true" />
        {sort === "name-asc" ? "Name A–Z" : "Name Z–A"}
      </button>

      <div className="ml-auto flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
        <ViewToggle view={view} onViewChange={onViewChange} />
        <button
          type="button"
          className="inline-flex h-8 flex-1 items-center justify-center gap-2 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-3 text-xs font-semibold leading-4 text-white transition-colors hover:bg-[var(--projects-accent-hover)] sm:flex-none"
        >
          <Plus size={14} strokeWidth={1.8} aria-hidden="true" />
          New project
        </button>
      </div>
    </div>
  );
}
