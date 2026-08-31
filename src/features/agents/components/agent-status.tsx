import { cn } from "@/lib/utils";
import type { AgentStatus } from "../types";

const STATUS_CONFIG: Record<AgentStatus, { label: string; dotClass: string; pulse?: boolean }> = {
  active: { label: "Active", dotClass: "bg-[#34d399]" },
  running: { label: "Running", dotClass: "bg-[var(--projects-accent)]", pulse: true },
  idle: { label: "Idle", dotClass: "bg-[var(--projects-ring)]" },
};

/** Small status indicator — a 6px dot, pulsing only while running. */
export function AgentStatusDot({
  status,
  withLabel = false,
  className,
}: {
  status: AgentStatus;
  withLabel?: boolean;
  className?: string;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex size-2">
        {config.pulse && (
          <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", config.dotClass)} />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", config.dotClass)} />
      </span>
      {withLabel && <span className="text-[12px] text-[var(--projects-muted)]">{config.label}</span>}
    </span>
  );
}
