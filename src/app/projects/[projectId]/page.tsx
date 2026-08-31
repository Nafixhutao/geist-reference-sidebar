import { ApplicationShell } from "@/components/application-shell";
import { ProjectDetailPage } from "@/features/projects/project-detail-page";
import { ProjectClientLookup } from "@/features/projects/project-client-lookup";
import { projects } from "@/features/projects/data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = projects.find(({ id }) => id === projectId);

  if (project) {
    return (
      <ApplicationShell desktopSidebar={false} hasTopBar>
        <ProjectDetailPage project={project} />
      </ApplicationShell>
    );
  }

  // Proyek yang dibuat lewat tombol "New project" disimpan di localStorage
  // dan tidak ada di data statis — selesaikan di klien.
  return (
    <ApplicationShell desktopSidebar={false} hasTopBar>
      <ProjectClientLookup projectId={projectId} />
    </ApplicationShell>
  );
}
