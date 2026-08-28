import { ProjectDetailPage } from "@/projects/ProjectDetailPage";
import { ProjectClientLookup } from "@/projects/ProjectClientLookup";
import { projects } from "@/projects/data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = projects.find(({ id }) => id === projectId);

  if (project) return <ProjectDetailPage project={project} />;

  // Proyek yang dibuat lewat tombol "New project" disimpan di localStorage
  // dan tidak ada di data statis — selesaikan di klien.
  return <ProjectClientLookup projectId={projectId} />;
}
