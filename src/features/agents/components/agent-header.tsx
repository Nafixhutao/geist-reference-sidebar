import { Plus } from "lucide-react";

export function AgentHeader({ count, onNewAgent }: { count: number; onNewAgent: () => void }) {
  return (
    <header className="relative border-b border-[var(--projects-border)] pb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="m-0 text-[28px] font-semibold leading-8 tracking-[-0.035em] text-[var(--projects-text)]">
              Agents
            </h1>
            <span className="inline-flex h-7 items-center rounded-full bg-[color-mix(in_srgb,var(--projects-accent)_14%,transparent)] px-2.5 text-xs font-medium text-[var(--projects-accent)]">
              {count} {count === 1 ? "agent" : "agents"}
            </span>
          </div>
          <p className="m-0 mt-2 text-[14px] leading-5 text-[var(--projects-muted)]">
            Build, run, and manage coding agents for your projects.
          </p>
        </div>

        <div className="flex w-full shrink-0 items-center gap-2 lg:absolute lg:right-0 lg:top-5 lg:w-auto">
          <button
            type="button"
            onClick={onNewAgent}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-4 text-[13px] font-semibold leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-colors hover:bg-[var(--projects-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--projects-accent)]/70 lg:w-auto"
          >
            <Plus size={15} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
            New Agent
          </button>
        </div>
      </div>
    </header>
  );
}
