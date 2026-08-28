import { usageRows } from "./data";

/*
 * Layout "Free plan usage" versi kartu (grid 4 kolom dengan ikon + progress bar)
 * — dikomentari sementara agar tidak tampil di halaman projects.
 *
 * import { ArrowDownUp, Database, FolderOpen, Users } from "lucide-react";
 *
 * const usageIcons = [ArrowDownUp, Database, Users, FolderOpen] as const;
 *
 * export function UsagePanel() {
 *   return (
 *     <section aria-labelledby="usage-panel-title" className="mt-6">
 *       <div className="flex flex-wrap items-baseline justify-between gap-2 px-0.5 sm:px-1">
 *         <div>
 *           <h2 id="usage-panel-title" className="m-0 text-[18px] font-semibold leading-6 text-[var(--projects-text)]">
 *             Free plan usage
 *           </h2>
 *           <p className="projects-mono m-0 mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--projects-muted)]">
 *             Current billing cycle
 *           </p>
 *         </div>
 *         <span className="inline-flex h-6 items-center rounded-full border border-[var(--projects-border)] px-2.5 text-[11px] font-medium text-[var(--projects-muted)]">
 *           4 resources
 *         </span>
 *       </div>
 *
 *       <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
 *         {usageRows.map((row, index) => {
 *           const Icon = usageIcons[index];
 *
 *           return (
 *             <div
 *               key={row.label}
 *               className="flex min-w-0 flex-col rounded-lg border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-4 transition-colors hover:border-[var(--projects-border-hover)] sm:p-5"
 *             >
 *               <div className="flex items-center gap-2.5">
 *                 <Icon size={15} strokeWidth={1.9} className="shrink-0 text-[var(--projects-accent)]" aria-hidden="true" />
 *                 <span className="truncate text-[13px] font-medium leading-5 text-[var(--projects-muted)]">{row.label}</span>
 *               </div>
 *
 *               <p className="m-0 mt-4 text-[28px] font-semibold leading-9 tracking-[-0.02em] tabular-nums text-[var(--projects-text)]">
 *                 {row.value}
 *               </p>
 *
 *               <div className="mt-auto flex items-baseline justify-between gap-2 pt-4">
 *                 <span className="text-[12px] leading-4 text-[var(--projects-muted)]">of {row.limit} limit</span>
 *                 <span className="projects-mono text-[11px] leading-4 text-[var(--projects-muted)]">
 *                   {Math.round(row.percent)}%
 *                 </span>
 *               </div>
 *
 *               <div
 *                 className="mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--projects-progress-track)]"
 *                 role="progressbar"
 *                 aria-label={`${row.label} usage`}
 *                 aria-valuemin={0}
 *                 aria-valuemax={100}
 *                 aria-valuenow={row.percent}
 *               >
 *                 <span
 *                   className="block h-full min-w-0 rounded-full bg-[var(--projects-accent)] transition-[width]"
 *                   style={{ width: `${row.percent > 0 ? Math.max(row.percent, 2) : 0}%` }}
 *                 />
 *               </div>
 *             </div>
 *           );
 *         })}
 *       </div>
 *     </section>
 *   );
 * }
 */

export function UsagePanel() {
  return (
    <aside
      aria-labelledby="usage-panel-title"
      className="mt-6 h-[210px] w-full rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-[15px]"
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
          className="h-[27px] shrink-0 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-[11px] text-xs font-medium leading-4 text-white transition-colors hover:bg-[var(--projects-accent-hover)]"
        >
          Upgrade to Pro
        </button>
      </div>

      <div className="mt-[17px] divide-y divide-dashed divide-[var(--projects-divider)]">
        {usageRows.map((row) => (
          <div key={row.label} className="flex h-[34px] items-center">
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
