"use client";

import { ServiceOverview } from "./service-overview/service-overview";
import type { Project } from "./types";

export function ProjectDetailPage({ project }: { project: Project }) {
  return <ServiceOverview project={project} />;
}
