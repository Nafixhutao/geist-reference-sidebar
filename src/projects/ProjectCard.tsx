import { CircleCheck, CirclePause, Info, MoreVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project, ProjectView } from "./types";

export function ProjectCard({ project, view }: { project: Project; view: ProjectView }) {
  const isList = view === "list";
  const isPaused = project.status === "paused";
  const StatusIcon = isPaused ? CirclePause : CircleCheck;

  return (
    <article
      className={cn(
        "group relative flex border border-[var(--projects-border)] bg-[var(--projects-card-bg)] transition-colors hover:border-[var(--projects-border-hover)]",
        isList
          ? "min-h-[92px] w-full items-center justify-between rounded-md px-5 py-4"
          : "min-h-[176px] w-full flex-col rounded-md px-5 pb-5 pt-6 sm:max-w-[264px]",
      )}
    >
      <Link
        href={`/projects/${project.id}`}
        aria-label={`Open project ${project.name}`}
        className="absolute inset-0 z-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--projects-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--projects-bg)]"
      >
        <span className="sr-only">Open project {project.name}</span>
      </Link>

      <div className="pointer-events-none relative z-10 min-w-0">
        <h2 className="m-0 truncate text-sm font-semibold leading-5 text-[var(--projects-text)]">{project.name}</h2>
        <p className="m-0 mt-px truncate text-[13px] leading-[18px] text-[var(--projects-muted)]">
          {project.provider} | {project.region}
        </p>
      </div>

      <button
        type="button"
        aria-label={`Project actions for ${project.name}`}
        className={cn(
          "absolute z-20 inline-flex size-6 items-center justify-center rounded text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]",
          isList ? "right-3 top-2" : "right-4 top-5",
        )}
      >
        <MoreVertical size={15} strokeWidth={2} />
      </button>

      <div
        className={cn(
          "pointer-events-none relative z-10 flex items-center",
          isList ? "mr-9" : "mt-auto",
        )}
      >
        <span className="mr-2 inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border-hover)] text-[var(--projects-muted)]">
          <StatusIcon size={13} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold leading-4 text-[var(--projects-text)]">
          {isPaused ? "Project is paused" : "Project is active"}
        </span>
        <Info
          size={12}
          strokeWidth={1.8}
          className="ml-2 shrink-0 text-[var(--projects-muted)]"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
