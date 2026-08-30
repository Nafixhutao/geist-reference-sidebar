import { Check, CircleDashed, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAgentTasks } from "../data";
import type { Agent } from "../types";

export function AgentTasks({ agent }: { agent: Agent }) {
  const tasks = getAgentTasks(agent);
  const inProgress = tasks.filter((task) => task.status === "in-progress");
  const queued = tasks.filter((task) => task.status === "queued");
  const completed = tasks.filter((task) => task.status === "completed");

  const sections = [
    { label: "In progress", items: inProgress, Icon: LoaderCircle, iconClass: "text-[var(--projects-accent)] animate-spin" },
    { label: "Queued", items: queued, Icon: CircleDashed, iconClass: "text-[var(--projects-muted)]" },
    { label: "Completed", items: completed, Icon: Check, iconClass: "text-[var(--projects-accent)]" },
  ].filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6">
      {sections.map((section) => (
        <section key={section.label} className="mt-5 first:mt-0">
          <h2 className="m-0 text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--projects-muted)]">
            {section.label}
          </h2>
          <ul className="m-0 mt-2.5 list-none divide-y divide-[var(--projects-divider)] overflow-hidden rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-0">
            {section.items.map((task) => (
              <li key={task.id} className="flex items-start gap-3 px-4 py-3">
                <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center", section.iconClass)} aria-hidden="true">
                  <section.Icon size={14} strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[13.5px] font-medium leading-5 text-[var(--projects-text)]">{task.title}</p>
                  <p className="m-0 mt-0.5 text-[12.5px] leading-[18px] text-[var(--projects-muted)]">{task.detail}</p>
                </div>
                {task.meta && (
                  <span className="shrink-0 pt-0.5 text-[11.5px] leading-4 text-[var(--projects-muted)]">{task.meta}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
