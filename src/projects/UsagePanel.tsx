import { usageRows } from "./data";

export function UsagePanel() {
  return (
    <aside
      aria-labelledby="usage-panel-title"
      className="w-full rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-4 min-[1400px]:w-[320px]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="usage-panel-title" className="m-0 text-[13px] font-semibold leading-[18px] text-[var(--projects-text)]">
            Free plan usage
          </h2>
          <p className="m-0 text-xs leading-4 text-[var(--projects-muted)]">Current billing cycle</p>
        </div>
        <button
          type="button"
          className="h-7 shrink-0 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-3 text-xs font-medium leading-4 text-white transition-colors hover:bg-[var(--projects-accent-hover)]"
        >
          Upgrade to Pro
        </button>
      </div>

      <div className="mt-4 divide-y divide-dashed divide-[var(--projects-divider)]">
        {usageRows.map((row) => (
          <div key={row.label} className="flex min-h-[34px] items-center">
            <span
              className="mr-2.5 size-3.5 shrink-0 rounded-full border-2 border-[var(--projects-ring)]"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate font-mono text-[10px] leading-[14px] tracking-[0.02em] text-[var(--projects-text)]">
              {row.label}
            </span>
            <span className="ml-3 shrink-0 font-mono text-[10px] leading-[14px]">
              <strong className="font-semibold text-[var(--projects-text)]">{row.value}</strong>
              <span className="px-2 text-[var(--projects-muted)]">/</span>
              <span className="text-[var(--projects-muted)]">{row.limit}</span>
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
