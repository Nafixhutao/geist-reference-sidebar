"use client";

import { useState } from "react";
import { Activity, Database, HardDrive, LockKeyhole, Server } from "lucide-react";
import { TopBar } from "@/TopBar";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Overview", Icon: Activity },
  { label: "Database", Icon: Database },
  { label: "Auth", Icon: LockKeyhole },
] as const;

type ProjectTab = (typeof tabs)[number]["label"];
type SecondaryProjectTab = Exclude<ProjectTab, "Overview">;

const metrics = [
  { label: "DATABASE SIZE", value: "0 GB", limit: "500 MB", Icon: Database },
  { label: "FILE STORAGE", value: "0 GB", limit: "1 GB", Icon: HardDrive },
  { label: "MONTHLY ACTIVE USERS", value: "0", limit: "50,000", Icon: Server },
] as const;

function MetricCard({
  label,
  value,
  limit,
  Icon,
}: (typeof metrics)[number]) {
  return (
    <article className="rounded-[8px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] font-medium tracking-[0.06em] text-[var(--projects-muted)]">{label}</span>
        <span className="inline-flex size-7 items-center justify-center rounded-[6px] border border-[var(--projects-border)] text-[var(--projects-muted)]">
          <Icon size={14} strokeWidth={1.7} aria-hidden="true" />
        </span>
      </div>
      <p className="m-0 mt-5 text-[22px] font-medium leading-[28px] tracking-[-0.02em] text-[var(--projects-text)]">{value}</p>
      <p className="m-0 mt-1 text-[12px] leading-[16px] text-[var(--projects-muted)]">of {limit} included</p>
    </article>
  );
}

function OverviewPanel() {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))]">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}

      <article className="min-h-[260px] rounded-[8px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-4 xl:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-[14px] font-semibold leading-[20px] text-[var(--projects-text)]">Project activity</h2>
            <p className="m-0 mt-1 text-[12px] leading-[16px] text-[var(--projects-muted)]">Requests and events in the current period</p>
          </div>
          <span className="rounded-[5px] border border-[var(--projects-border)] px-2 py-1 text-[11px] text-[var(--projects-muted)]">Last 30 days</span>
        </div>
        <div className="relative mt-8 h-[145px] overflow-hidden rounded-[6px] border border-dashed border-[var(--projects-divider)] bg-[#121014]/40">
          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[var(--projects-divider)]" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--projects-divider)]" />
          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[var(--projects-divider)]" />
          <svg viewBox="0 0 720 145" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M0 126 C80 126 90 90 160 103 S245 116 300 76 S385 98 440 72 S515 80 565 42 S650 67 720 30" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.85" />
          </svg>
          <p className="absolute inset-x-0 bottom-3 m-0 text-center text-[11px] text-[var(--projects-muted)]">No requests recorded yet</p>
        </div>
      </article>

      <article className="min-h-[260px] rounded-[8px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-4">
        <h2 className="m-0 text-[14px] font-semibold leading-[20px] text-[var(--projects-text)]">Environment</h2>
        <p className="m-0 mt-1 text-[12px] leading-[16px] text-[var(--projects-muted)]">Production configuration</p>
        <dl className="mt-7 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--projects-divider)] pb-3">
            <dt className="text-[12px] text-[var(--projects-muted)]">Region</dt>
            <dd className="m-0 text-[12px] font-medium text-[var(--projects-text)]">ap-southeast-1</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--projects-divider)] pb-3">
            <dt className="text-[12px] text-[var(--projects-muted)]">Status</dt>
            <dd className="m-0 inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400" />Active</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-[12px] text-[var(--projects-muted)]">Runtime</dt>
            <dd className="m-0 text-[12px] font-medium text-[var(--projects-text)]">AWS</dd>
          </div>
        </dl>
      </article>
    </div>
  );
}

function DetailPlaceholder({ tab }: { tab: SecondaryProjectTab }) {
  const copy = {
    Database: "Manage tables, migrations, and database connections for app_ig.",
    Auth: "Configure authentication providers and user access for app_ig.",
  }[tab];

  return (
    <div className="mt-6 rounded-[8px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-6">
      <h2 className="m-0 text-[16px] font-semibold text-[var(--projects-text)]">{tab}</h2>
      <p className="m-0 mt-2 max-w-[520px] text-[13px] leading-[20px] text-[var(--projects-muted)]">{copy}</p>
      <button type="button" className="mt-6 h-8 rounded-[6px] border border-[var(--projects-border-hover)] px-3 text-[12px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]">
        Open {tab.toLowerCase()} settings
      </button>
    </div>
  );
}

function ProjectDetailContent() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["label"]>("Overview");

  return (
    <section className="min-h-[calc(100dvh-48px)] bg-[var(--projects-bg)] px-5 pb-12 pt-10 sm:px-8 lg:px-10 lg:pt-[46px]">
      <div className="mx-auto w-full max-w-[1170px]">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="m-0 text-[12px] leading-[16px] text-[var(--projects-muted)]">Project</p>
            <h1 className="m-0 mt-1 text-[24px] font-medium leading-[30px] tracking-[-0.03em] text-[var(--projects-text)]">app_ig</h1>
            <p className="m-0 mt-1 text-[13px] leading-[18px] text-[var(--projects-muted)]">AWS | ap-southeast-1</p>
          </div>
          <span className="inline-flex h-7 items-center rounded-[6px] border border-emerald-500/30 bg-emerald-500/[0.08] px-2.5 text-[11px] font-semibold tracking-[0.08em] text-emerald-400">PRODUCTION</span>
        </div>

        <div role="tablist" aria-label="Project sections" className="mt-9 flex gap-5 border-b border-[var(--projects-divider)]">
          {tabs.map(({ label, Icon }) => {
            const selected = activeTab === label;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(label)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 border-b-2 px-1 text-[13px] font-medium transition-colors",
                  selected ? "border-emerald-400 text-emerald-400" : "border-transparent text-[var(--projects-muted)] hover:text-[var(--projects-text)]",
                )}
              >
                <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === "Overview" ? <OverviewPanel /> : <DetailPlaceholder tab={activeTab} />}
      </div>
    </section>
  );
}

export default function ProjectDetailPage() {
  return (
    <div className="min-h-dvh bg-[#1A181D]">
      <TopBar showSidebarToggle={false} />
      <div className="min-h-[calc(100dvh-48px)]">
        <main className="relative min-h-[calc(100dvh-48px)] min-w-0">
          <ProjectDetailContent />
        </main>
      </div>
    </div>
  );
}
