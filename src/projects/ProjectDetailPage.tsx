"use client";

import { ServiceOverview } from "./ServiceOverview";
import type { Project } from "./types";

export function ProjectDetailPage({ project }: { project: Project }) {
  return <ServiceOverview project={project} />;
}
