"use client";

import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";

type Bar = {
  x: number;
  height: number;
  color: "green" | "yellow" | "red";
  width?: number;
};

type ServiceCard = {
  name: string;
  requests: number;
  warnings: number;
  errors: number;
  bars: Bar[];
};

const colors = {
  green: "#3ecf8e",
  yellow: "#f5b942",
  red: "#ff5f57",
};

const cards: ServiceCard[] = [
  {
    name: "POSTGRES",
    requests: 68,
    warnings: 0,
    errors: 11,
    bars: [
      { x: 92, height: 98, color: "green", width: 3 },
      { x: 92, height: 22, color: "red", width: 3 },
      { x: 98, height: 6, color: "yellow", width: 3 },
      { x: 111, height: 24, color: "green", width: 3 },
      { x: 115, height: 5, color: "green", width: 3 },
    ],
  },
  {
    name: "AUTH",
    requests: 54,
    warnings: 6,
    errors: 0,
    bars: [
      { x: 92, height: 110, color: "green", width: 3 },
      { x: 92, height: 14, color: "yellow", width: 3 },
      { x: 97, height: 70, color: "green", width: 3 },
      { x: 98, height: 12, color: "yellow", width: 3 },
    ],
  },
  {
    name: "STORAGE",
    requests: 32,
    warnings: 5,
    errors: 2,
    bars: [
      { x: 91, height: 60, color: "green", width: 3 },
      { x: 92, height: 30, color: "yellow", width: 5 },
      { x: 96, height: 106, color: "green", width: 3 },
      { x: 98, height: 15, color: "red", width: 3 },
      { x: 104, height: 32, color: "green", width: 3 },
      { x: 111, height: 30, color: "green", width: 3 },
      { x: 120, height: 30, color: "green", width: 3 },
      { x: 181, height: 31, color: "green", width: 3 },
      { x: 189, height: 31, color: "green", width: 3 },
      { x: 193, height: 31, color: "green", width: 3 },
      { x: 221, height: 31, color: "green", width: 3 },
      { x: 229, height: 30, color: "green", width: 3 },
      { x: 238, height: 47, color: "green", width: 3 },
      { x: 242, height: 16, color: "green", width: 3 },
    ],
  },
  {
    name: "API GATEWAY",
    requests: 32,
    warnings: 0,
    errors: 10,
    bars: [
      { x: 89, height: 62, color: "red", width: 3 },
      { x: 93, height: 92, color: "red", width: 3 },
      { x: 109, height: 46, color: "green", width: 3 },
      { x: 121, height: 31, color: "green", width: 3 },
      { x: 195, height: 46, color: "green", width: 3 },
      { x: 205, height: 46, color: "green", width: 3 },
      { x: 210, height: 46, color: "green", width: 3 },
      { x: 238, height: 31, color: "green", width: 3 },
      { x: 246, height: 30, color: "green", width: 3 },
      { x: 251, height: 47, color: "green", width: 3 },
    ],
  },
];

function MiniChart({ bars }: { bars: Bar[] }) {
  return (
    <div className="absolute inset-x-4 bottom-[29px] h-[125px]">
      <svg viewBox="0 0 260 125" preserveAspectRatio="none" className="size-full overflow-visible" aria-hidden="true">
        <line x1="0" y1="111.5" x2="260" y2="111.5" stroke="var(--projects-divider)" strokeWidth="1" />
        {bars.map((bar, index) => (
          <rect
            key={`${bar.x}-${index}`}
            x={bar.x}
            y={111 - bar.height}
            width={bar.width ?? 3}
            height={bar.height}
            fill={colors[bar.color]}
          />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-[-20px] flex justify-between font-mono text-[9px] leading-[12px] tracking-[0.02em] text-[var(--projects-muted)]">
        <span>Aug 23, 10:44pm</span>
        <span>Aug 23, 11:44pm</span>
      </div>
    </div>
  );
}

function MetricCard({ card, last }: { card: ServiceCard; last: boolean }) {
  return (
    <article className="relative h-[256px] min-w-0 rounded-[7px] border border-[var(--projects-border)] bg-[var(--projects-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 font-mono text-[10px] font-semibold leading-[14px] tracking-[0.04em] text-[var(--projects-muted)]">{card.name}</p>
          <p className="m-0 mt-[1px] text-[20px] font-medium leading-[24px] text-[var(--projects-text)]">{card.requests}</p>
        </div>

        <div className="flex min-w-[148px] justify-between gap-4">
          <div className="text-right">
            <p className="m-0 flex items-center justify-end gap-[7px] font-mono text-[10px] font-semibold leading-[14px] tracking-[0.04em] text-[var(--projects-muted)]">
              <span className="size-[6px] rounded-full bg-[var(--projects-warning)]" /> WARNINGS
            </p>
            <p className="m-0 mt-[1px] text-[16px] font-medium leading-[20px] text-[var(--projects-text)]">{card.warnings}</p>
          </div>
          <div className="text-right">
            <p className="m-0 flex items-center justify-end gap-[7px] font-mono text-[10px] font-semibold leading-[14px] tracking-[0.04em] text-[var(--projects-muted)]">
              <span className="size-[6px] rounded-full bg-[var(--projects-danger)]" /> ERRORS
            </p>
            <p className="m-0 mt-[1px] text-[16px] font-medium leading-[20px] text-[var(--projects-text)]">{card.errors}</p>
          </div>
        </div>
      </div>

      <MiniChart bars={card.bars} />

      {last && (
        <button
          type="button"
          aria-label="Next metric"
          className="absolute right-[-1px] top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--projects-border-hover)] bg-[var(--projects-surface)] text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]"
        >
          <ChevronRight size={15} strokeWidth={1.8} />
        </button>
      )}
    </article>
  );
}

export function RequestsOverview() {
  return (
    <section className="mt-14">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <GripVertical size={15} strokeWidth={1.8} className="mt-[4px] shrink-0 text-[var(--projects-muted)]" aria-hidden="true" />
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="m-0 text-[20px] font-semibold leading-[26px] text-[var(--projects-text)]">
            204 <span className="ml-1 font-medium text-[var(--projects-muted)]">Total Requests</span>
          </p>
          <p className="m-0 text-[20px] font-semibold leading-[26px] text-[var(--projects-text)]">
            82.8% <span className="ml-1 font-medium text-[var(--projects-muted)]">Success Rate</span>
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-[27px] shrink-0 items-center gap-2 self-start rounded-[6px] border border-[var(--projects-border-hover)] px-[11px] text-[12px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.035] sm:ml-auto"
        >
          Last 60 minutes
          <ChevronDown size={12} strokeWidth={1.8} className="text-[var(--projects-muted)]" />
        </button>
      </div>

      <div className="mt-[10px] grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <MetricCard key={card.name} card={card} last={index === cards.length - 1} />
        ))}
      </div>
    </section>
  );
}
