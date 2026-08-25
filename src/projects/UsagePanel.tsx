import { ArrowDownUp, Database, Folder, Users } from "lucide-react";
import { usageRows } from "./data";

const usageIcons = [ArrowDownUp, Database, Users, Folder] as const;

export function UsagePanel() {
  return (
    <section aria-labelledby="usage-panel-title" className="mt-6">
      <div>
        <h2 id="usage-panel-title" className="m-0 text-[18px] font-semibold leading-6 text-[var(--projects-text)]">
          Free plan usage
        </h2>
        <p className="m-0 mt-1 text-[13px] leading-5 text-[var(--projects-muted)]">Current billing cycle</p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {usageRows.map((row, index) => {
          const Icon = usageIcons[index];

          return (
            <div
              key={row.label}
              className="rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-4 transition-colors hover:border-[var(--projects-border-hover)]"
            >
              <div className="flex items-center gap-2.5">
                <Icon size={17} strokeWidth={1.8} className="shrink-0 text-[var(--projects-accent)]" aria-hidden="true" />
                <span className="truncate text-[14px] font-medium leading-5 text-[var(--projects-text)]">{row.label}</span>
              </div>

              <div
                className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--projects-control)]"
                role="progressbar"
                aria-label={`${row.label} usage`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={row.percent}
              >
                <span
                  className="block h-full min-w-0 rounded-full bg-[var(--projects-accent)] transition-[width]"
                  style={{ width: `${row.percent}%` }}
                />
              </div>

              <p className="m-0 mt-3 font-mono text-[12px] leading-4 text-[var(--projects-muted)]">
                <strong className="font-semibold text-[var(--projects-text)]">{row.value}</strong>
                <span className="px-2">/</span>
                <span>{row.limit}</span>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
