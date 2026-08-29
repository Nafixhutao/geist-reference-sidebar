import { ApplicationShell } from "@/components/application-shell";
import { ProjectsPage } from "@/features/projects/projects-page";

export default function Page() {
  return (
    <ApplicationShell>
      <ProjectsPage />
    </ApplicationShell>
  );
}
