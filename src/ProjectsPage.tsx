"use client";

import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./projects/ProjectCard";
import { projects } from "./projects/data";
import { ProjectToolbar } from "./projects/ProjectToolbar";
import { UsagePanel } from "./projects/UsagePanel";
import type { ProjectSort, ProjectStatus, ProjectView } from "./projects/types";

export function ProjectsPage({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<ProjectSort>("name-asc");
  const [view, setView] = useState<ProjectView>("grid");

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects
      .filter((project) => {
        const matchesQuery = [project.name, project.provider, project.region].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
        const matchesStatus = status === "all" || project.status === status;

        return matchesQuery && matchesStatus;
      })
      .toSorted((first, second) => {
        const comparison = first.name.localeCompare(second.name);
        return sort === "name-asc" ? comparison : -comparison;
      });
  }, [query, sort, status]);

  return (
    <section className="projects-page min-h-dvh bg-[var(--projects-bg)] px-2 pb-12 pt-14">
      <div className="mx-auto w-full max-w-[1170px]">
        <div className="flex items-center justify-between gap-4">
          <h1 className="m-0 text-[22px] font-medium leading-7 tracking-[-0.025em] text-[var(--projects-text)]">
            Projects
          </h1>
          {onOpenSidebar && (
            <button
              type="button"
              onClick={onOpenSidebar}
              className="inline-flex h-8 items-center gap-2 rounded-md border border-[var(--projects-border)] px-3 text-xs font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04] lg:hidden"
            >
              <Menu size={14} strokeWidth={1.8} aria-hidden="true" />
              Menu
            </button>
          )}
        </div>

        <div className="projects-layout mt-[47px] grid gap-6">
          <div className="min-w-0">
            <ProjectToolbar
              query={query}
              status={status}
              sort={sort}
              view={view}
              onQueryChange={setQuery}
              onStatusChange={setStatus}
              onSortChange={() => setSort((current) => (current === "name-asc" ? "name-desc" : "name-asc"))}
              onViewChange={setView}
            />

            <div
              className={cn(
                "mt-4",
                view === "grid"
                  ? "flex flex-wrap gap-3"
                  : "flex w-full flex-col gap-3",
              )}
            >
              {visibleProjects.length > 0 ? (
                visibleProjects.map((project) => <ProjectCard key={project.id} project={project} view={view} />)
              ) : (
                <div className="rounded-md border border-dashed border-[var(--projects-border)] px-4 py-10 text-center sm:col-span-2 xl:col-span-3">
                  <p className="m-0 text-[13px] text-[var(--projects-muted)]">No projects found.</p>
                  <p className="m-0 mt-1 text-xs text-[var(--projects-muted)]/75">
                    Try another search term or change the status filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          <UsagePanel />
        </div>

      </div>
    </section>
  );
}
