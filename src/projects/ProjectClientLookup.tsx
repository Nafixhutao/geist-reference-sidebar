"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProjectDetailPage } from "./ProjectDetailPage";
import { loadProjects } from "./projectStore";
import type { Project } from "./types";

export function ProjectClientLookup({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    setProject(loadProjects().find((item) => item.id === projectId) ?? null);
  }, [projectId]);

  if (project === undefined) return null;

  if (project === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="m-0 text-[15px] font-semibold text-[var(--projects-text)]">Project not found</p>
        <p className="m-0 text-[13px] text-[var(--projects-muted)]">This project does not exist or was removed.</p>
        <Link
          href="/"
          className="mt-1 inline-flex h-10 items-center rounded-[10px] border border-[var(--projects-border)] px-4 text-[13px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]"
        >
          Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailPage project={project} />;
}
