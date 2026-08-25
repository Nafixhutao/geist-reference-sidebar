import { Box, MoreVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project, ProjectView } from "./types";

function StatusChip({ status }: { status: Project["status"] }) {
  const isPaused = status === "paused";

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
        isPaused
          ? "bg-[color-mix(in_srgb,var(--projects-warning)_18%,transparent)] text-[var(--projects-warning)]"
          : "bg-[color-mix(in_srgb,var(--projects-accent)_16%,transparent)] text-[var(--projects-accent)]",
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", isPaused ? "bg-[var(--projects-warning)]" : "bg-[var(--projects-accent)]")}
        aria-hidden="true"
      />
      {isPaused ? "Paused" : "Active"}
    </span>
  );
}

function ProjectIcon({ size = "default" }: { size?: "default" | "compact" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-[var(--projects-border-hover)] bg-[var(--projects-control)] text-[var(--projects-accent)]",
        size === "compact" ? "size-9" : "size-11",
      )}
    >
      <Box size={size === "compact" ? 17 : 21} strokeWidth={1.7} aria-hidden="true" />
    </span>
  );
}

export function ProjectCard({ project, view }: { project: Project; view: ProjectView }) {
  const isList = view === "list";

  if (isList) {
    return (
      <article className="group relative grid min-w-[760px] grid-cols-[minmax(250px,1.7fr)_minmax(110px,.75fr)_minmax(160px,1fr)_minmax(112px,.7fr)_minmax(92px,.55fr)_40px] items-center border-t border-[var(--projects-divider)] bg-[var(--projects-card-bg)] px-5 py-3.5 transition-colors hover:bg-[var(--projects-control)]">
        <Link
          href={`/projects/${project.id}`}
          aria-label={`Open project ${project.name}`}
          className="absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--projects-accent)] focus-visible:ring-inset"
        >
          <span className="sr-only">Open project {project.name}</span>
        </Link>

        <div className="pointer-events-none relative z-10 flex min-w-0 items-center gap-3">
          <ProjectIcon size="compact" />
          <span className="min-w-0 truncate text-[14px] font-semibold leading-5 text-[var(--projects-text)]">{project.name}</span>
        </div>
        <span className="pointer-events-none relative z-10 truncate text-[13px] text-[var(--projects-text)]">{project.provider}</span>
        <span className="pointer-events-none relative z-10 truncate text-[13px] text-[var(--projects-muted)]">{project.region}</span>
        <span className="pointer-events-none relative z-10"><StatusChip status={project.status} /></span>
        <span className="pointer-events-none relative z-10 inline-flex h-6 w-fit items-center rounded border border-[var(--projects-border-hover)] px-2 font-mono text-[10px] tracking-[0.02em] text-[var(--projects-muted)]">
          {project.plan}
        </span>
        <button
          type="button"
          aria-label={`Project actions for ${project.name}`}
          className="relative z-20 inline-flex size-9 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]"
        >
          <MoreVertical size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </article>
    );
  }

  return (
    <article className="group relative flex min-h-[178px] w-full flex-col rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-5 transition-colors hover:border-[var(--projects-border-hover)] hover:bg-[var(--projects-control)]">
      <Link
        href={`/projects/${project.id}`}
        aria-label={`Open project ${project.name}`}
        className="absolute inset-0 z-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--projects-accent)] focus-visible:ring-inset"
      >
        <span className="sr-only">Open project {project.name}</span>
      </Link>

      <button
        type="button"
        aria-label={`Project actions for ${project.name}`}
        className="absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]"
      >
        <MoreVertical size={16} strokeWidth={2} aria-hidden="true" />
      </button>

      <div className="pointer-events-none relative z-10 flex items-center gap-3 pr-9">
        <ProjectIcon />
        <div className="min-w-0">
          <h2 className="m-0 truncate text-[15px] font-semibold leading-5 text-[var(--projects-text)]">{project.name}</h2>
          <p className="m-0 mt-1 truncate text-[13px] leading-[18px] text-[var(--projects-muted)]">
            {project.provider} <span className="px-1">·</span> {project.region}
          </p>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 mt-auto flex items-center gap-2">
        <StatusChip status={project.status} />
        <span className="inline-flex h-7 items-center rounded border border-[var(--projects-border-hover)] px-2.5 font-mono text-[10px] tracking-[0.02em] text-[var(--projects-muted)]">
          {project.plan}
        </span>
      </div>
    </article>
  );
}
