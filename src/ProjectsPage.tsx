"use client";

import { useMemo, useState } from "react";
import { Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./projects/ProjectCard";
import { projects } from "./projects/data";
import { ProjectToolbar } from "./projects/ProjectToolbar";
import { UsagePanel } from "./projects/UsagePanel";
import type { ProjectSort, ProjectStatus, ProjectView } from "./projects/types";

const projectTableColumns =
  "grid-cols-[minmax(250px,1.7fr)_minmax(110px,.75fr)_minmax(160px,1fr)_minmax(112px,.7fr)_minmax(92px,.55fr)_40px]";

export function ProjectsPage({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<ProjectSort>("name-asc");
  const [view, setView] = useState<ProjectView>("list");

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
    <section className="projects-page min-h-dvh bg-[var(--projects-bg)] px-4 pb-12 pt-14 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="border-b border-[var(--projects-border)] pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="m-0 text-[28px] font-semibold leading-8 tracking-[-0.035em] text-[var(--projects-text)]">
                  Projects
                </h1>
                <span className="inline-flex h-7 items-center rounded-full bg-[var(--projects-control)] px-2.5 text-xs font-medium text-[var(--projects-muted)]">
                  {projects.length} {projects.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <p className="m-0 mt-2 text-[14px] leading-5 text-[var(--projects-muted)]">Manage your infrastructure</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {onOpenSidebar && (
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
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-3.5 text-xs font-semibold leading-4 text-white transition-colors hover:bg-[var(--projects-accent-hover)]"
              >
                <Plus size={15} strokeWidth={1.8} aria-hidden="true" />
                New project
              </button>
            </div>
          </div>
        </header>

        <UsagePanel />

        <div className="mt-10">
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

          {visibleProjects.length > 0 ? (
            view === "list" ? (
              <div className="mt-5 overflow-x-auto rounded-md border border-[var(--projects-border)]">
                <div className="min-w-[760px]">
                  <div
                    className={cn(
                      "grid items-center bg-[var(--projects-control)] px-5 py-3 text-[12px] font-medium text-[var(--projects-muted)]",
                      projectTableColumns,
                    )}
                  >
                    <span>Project</span>
                    <span>Provider</span>
                    <span>Region</span>
                    <span>Status</span>
                    <span>Plan</span>
                    <span aria-hidden="true" />
                  </div>
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} view={view} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} view={view} />
                ))}
              </div>
            )
          ) : (
            <div className="mt-5 rounded-md border border-dashed border-[var(--projects-border)] px-4 py-12 text-center">
              <p className="m-0 text-[14px] text-[var(--projects-muted)]">No projects found.</p>
              <p className="m-0 mt-1 text-xs text-[var(--projects-muted)]/75">
                Try another search term or change the status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
