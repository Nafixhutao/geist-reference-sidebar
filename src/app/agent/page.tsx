import { ApplicationShell } from "@/components/application-shell";
import { AgentPage } from "@/features/agents/agent-page";

export default function Page() {
  return (
    <ApplicationShell>
      <AgentPage />
    </ApplicationShell>
  );
}
