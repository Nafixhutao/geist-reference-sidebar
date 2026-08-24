import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project, ProjectView } from "./types";

export function ProjectCard({ project, view }: { project: Project; view: ProjectView }) {
  const isList = view === "list";

  return (
    <article
      className={cn(
        "group relative flex border border-[var(--projects-border)] bg-[var(--projects-card-bg)] transition-colors hover:border-[var(--projects-border-hover)]",
        isList
          ? "h-[92px] w-full items-center justify-between rounded-md px-5 py-4"
          : "h-[176px] w-[250px] max-w-full shrink-0 flex-col rounded-md px-5 pb-5 pt-6",
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

      <div className={cn("pointer-events-none relative z-10", isList ? "mr-9" : "mt-5")}>
        <span className="inline-flex h-[18px] items-center rounded-[3px] border border-[var(--projects-border-hover)] px-1.5 font-mono text-[9px] leading-3 tracking-[0.02em] text-[var(--projects-muted)]">
          {project.plan}
        </span>
      </div>
    </article>
  );
}
