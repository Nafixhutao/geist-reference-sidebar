import { Check, FilePenLine, GitBranch, Play, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAgentActivity } from "../data";
import type { Agent } from "../types";

const ACTIVITY_ICONS = {
  check: Check,
  edit: FilePenLine,
  search: Search,
  branch: GitBranch,
  run: Play,
} as const;

export function AgentActivity({ agent }: { agent: Agent }) {
  const items = getAgentActivity(agent);

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6">
      <ul className="m-0 list-none overflow-hidden rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-0">
        {items.map((item, index) => {
          const Icon = ACTIVITY_ICONS[item.icon];
          return (
            <li
              key={item.id}
              className={cn("flex items-center gap-3 px-4 py-3", index > 0 && "border-t border-[var(--projects-divider)]")}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border)] bg-[var(--projects-control)] text-[var(--projects-muted)]">
                <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="m-0 min-w-0 flex-1 truncate text-[13px] leading-5 text-[var(--projects-text)]">{item.text}</p>
              <span className="projects-mono shrink-0 text-[11px] text-[var(--projects-muted)]">{item.meta}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
