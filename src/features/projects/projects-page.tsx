"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Menu, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useApplicationShell } from "@/components/application-shell";
import { ProjectCard, ProjectTableHeader } from "./project-card";
import { ProjectsSkeleton } from "./project-skeletons";
import { ProjectToolbar } from "./project-toolbar";
import { NewProjectDialog } from "./new-project-dialog";
import { projects } from "./data";
import { loadProjects, saveProjects } from "./project-store";
import type { Project, ProjectSort, ProjectStatus, ProjectView } from "./types";

export function ProjectsPage({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const shell = useApplicationShell();
  const openSidebar = onOpenSidebar ?? shell?.openSidebar;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [sort, setSort] = useState<ProjectSort>("name-asc");
  const [view, setView] = useState<ProjectView>("grid");
  const [isLoading, setIsLoading] = useState(true);
  // Use the same deterministic seed for the server and the first browser render.
  // localStorage is merged in after hydration to avoid a server/client tree mismatch.
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [projectsReady, setProjectsReady] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Simulasi fetch awal; ganti dengan loading state nyata saat data diambil dari API.
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setProjectList(loadProjects());
    setProjectsReady(true);
  }, []);

  useEffect(() => {
    if (projectsReady) saveProjects(projectList);
  }, [projectList, projectsReady]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projectList
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
  }, [projectList, query, sort, status]);

  // Stable identity keeps NewProjectDialog from re-rendering on every page render.
  const existingIds = useMemo(() => projectList.map((project) => project.id), [projectList]);

  return (
    <section className="projects-page min-h-dvh bg-[var(--projects-bg)] px-4 pb-12 pt-14 sm:px-6 lg:px-7">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="relative border-b border-[var(--projects-border)] pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="m-0 text-[28px] font-semibold leading-8 tracking-[-0.035em] text-[var(--projects-text)]">
                  Projects
                </h1>
                <span className="inline-flex h-7 items-center rounded-full bg-[color-mix(in_srgb,var(--projects-accent)_14%,transparent)] px-2.5 text-xs font-medium text-[var(--projects-accent)]">
                  {projectList.length} {projectList.length === 1 ? "project" : "projects"}
                </span>
              </div>
              <p className="m-0 mt-2 text-[14px] leading-5 text-[var(--projects-muted)]">Manage your infrastructure</p>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:absolute lg:right-0 lg:top-5">
              {openSidebar && (
                <button
                  type="button"
                  onClick={openSidebar}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--projects-border)] px-3 text-xs font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04] lg:hidden"
                >
                  <Menu size={15} strokeWidth={1.8} aria-hidden="true" />
                  Menu
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-4 text-[13px] font-semibold leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-colors hover:bg-[var(--projects-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--projects-accent)]/70"
              >
                <Plus size={15} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                New project
              </button>
            </div>
          </div>
        </header>

        <div className="mt-8" aria-busy={isLoading}>
          <ProjectToolbar
            query={query}
            status={status}
            sort={sort}
            view={view}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onSortChange={setSort}
            onViewChange={setView}
          />

          {isLoading ? (
            <ProjectsSkeleton view={view} />
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleProjects.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-5 rounded-md border border-dashed border-[var(--projects-border)] px-4 py-12 text-center"
              >
                <p className="m-0 text-[14px] text-[var(--projects-muted)]">No projects found.</p>
                <p className="m-0 mt-1 text-xs text-[var(--projects-muted)]/75">
                  Try another search term or change the status filter.
                </p>
              </motion.div>
            ) : view === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-5 overflow-x-auto rounded-md border border-[var(--projects-border)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="min-w-[760px]">
                  <ProjectTableHeader />
                  {visibleProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} view={view} />
                  ))}
                  <footer className="flex items-center justify-between gap-4 border-t border-[var(--projects-divider)] bg-[var(--projects-card-bg)] px-5 py-3">
                    <p className="m-0 text-xs text-[var(--projects-muted)]">
                      Showing {visibleProjects.length} of {visibleProjects.length}{" "}
                      {visibleProjects.length === 1 ? "project" : "projects"}
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
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -10, scale: reduceMotion ? 1 : 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
              >
                {visibleProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} view={view} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>

      <NewProjectDialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        existingIds={existingIds}
        onCreate={(project) => {
          setProjectList((prev) => [project, ...prev]);
          setIsCreateOpen(false);
        }}
      />
    </section>
  );
}
