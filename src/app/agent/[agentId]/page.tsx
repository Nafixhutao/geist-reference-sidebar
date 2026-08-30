import { ApplicationShell } from "@/components/application-shell";
import { AgentWorkspacePage } from "@/features/agents/workspace/agent-workspace-page";

export default async function AgentWorkspaceRoute({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  return (
    <ApplicationShell>
      <AgentWorkspacePage agentId={agentId} />
    </ApplicationShell>
  );
}
