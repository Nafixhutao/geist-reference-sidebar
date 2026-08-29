import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Check, ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/animate-ui/tooltip";
import { cn } from "@/lib/utils";
import type { ProjectSort, ProjectStatus, ProjectView } from "./types";

type ProjectToolbarProps = {
  query: string;
  status: ProjectStatus | "all";
  sort: ProjectSort;
  view: ProjectView;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ProjectStatus | "all") => void;
  onSortChange: (value: ProjectSort) => void;
  onViewChange: (value: ProjectView) => void;
};

function ViewToggle({ view, onViewChange }: Pick<ProjectToolbarProps, "view" | "onViewChange">) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1" aria-label="Project view">
        <Tooltip side="top">
          <TooltipTrigger>
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => onViewChange("grid")}
              className={cn(
                "relative inline-flex size-9 items-center justify-center rounded-lg text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
                view === "grid" && "text-[var(--projects-text)]",
              )}
            >
              {view === "grid" && (
                <motion.span
                  layoutId="view-toggle-active"
                  className="absolute inset-0 rounded-lg bg-[var(--projects-control)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  aria-hidden="true"
                />
              )}
              <LayoutGrid size={15} strokeWidth={1.8} className="relative z-10" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle grid view</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip side="top">
          <TooltipTrigger>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => onViewChange("list")}
              className={cn(
                "relative inline-flex size-9 items-center justify-center rounded-lg text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]",
                view === "list" && "text-[var(--projects-text)]",
              )}
            >
              {view === "list" && (
                <motion.span
                  layoutId="view-toggle-active"
                  className="absolute inset-0 rounded-lg bg-[var(--projects-control)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  aria-hidden="true"
                />
              )}
              <List size={16} strokeWidth={1.8} className="relative z-10" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle list view</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

type DropdownOption<T extends string> = { value: T; label: string };

function Dropdown<T extends string>({
  value,
  onChange,
  label,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  label: ReactNode;
  options: DropdownOption<T>[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-[10px] px-3.5 text-xs font-medium leading-4 text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]",
          className,
        )}
      >
        {label}
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className={cn(
            "text-[var(--projects-muted)] transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="status-menu"
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-0 top-full z-20 mt-1.5 min-w-full rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-1 shadow-xl shadow-black/30"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-xs leading-4 text-[var(--projects-text)] transition-colors hover:bg-[var(--projects-control)]"
              >
                {option.label}
                {option.value === value && (
                  <Check
                    size={13}
                    strokeWidth={2}
                    className="shrink-0 text-[var(--projects-accent)]"
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SortButton({ sort, onChange }: { sort: ProjectSort; onChange: (value: ProjectSort) => void }) {
  const descending = sort === "name-desc";
  const reduceMotion = useReducedMotion();
  const shift = { type: "spring", stiffness: 500, damping: 28 } as const;
  // One consistent travel direction per toggle: descending content rolls up,
  // ascending content rolls down — matching the arrow icons.
  const from = descending ? 1 : -1;
  const rollLabels = [
    { text: "(A–Z)", active: !descending, tone: "text-[var(--projects-muted)]" },
    { text: "(Z–A)", active: descending, tone: "text-[var(--projects-accent)]" },
  ] as const;

  return (
    <motion.button
      type="button"
      aria-label="Sort projects by name"
      aria-pressed={descending}
      onClick={() => onChange(descending ? "name-asc" : "name-desc")}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
      className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3.5 text-xs font-medium leading-4 text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]"
    >
      <span className="relative inline-flex size-4 shrink-0 overflow-hidden" aria-hidden="true">
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-[var(--projects-muted)]"
          initial={false}
          animate={descending ? { y: "-110%", opacity: 0, filter: "blur(3px)" } : { y: "0%", opacity: 1, filter: "blur(0px)" }}
          transition={reduceMotion ? { duration: 0 } : shift}
        >
          <ArrowUpNarrowWide size={14} strokeWidth={1.8} />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-[var(--projects-muted)]"
          initial={false}
          animate={descending ? { y: "0%", opacity: 1, filter: "blur(0px)" } : { y: "110%", opacity: 0, filter: "blur(3px)" }}
          transition={reduceMotion ? { duration: 0 } : shift}
        >
          <ArrowDownWideNarrow size={14} strokeWidth={1.8} />
        </motion.span>
      </span>
      Sorted by name
      {/* Constant-width slot: both direction labels stay mounted and roll over
          each other, so the button never resizes — animated width made
          mid-animation clicks land outside the button. */}
      <span className="relative inline-block overflow-hidden whitespace-nowrap" aria-hidden="true">
        <span className="invisible block">(Z–A)</span>
        {rollLabels.map(({ text, active, tone }) => (
          <motion.span
            key={text}
            className={`absolute inset-0 flex ${tone}`}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            {text.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block"
                initial={false}
                animate={active ? { y: 0, filter: "blur(0px)" } : { y: -12 * from, filter: "blur(2px)" }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { ...shift, delay: active ? 0.02 + i * 0.024 : i * 0.014 }
                }
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        ))}
      </span>
    </motion.button>
  );
}

export function ProjectToolbar({
  query,
  status,
  sort,
  view,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onViewChange,
}: ProjectToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <label className="flex h-10 min-w-[220px] flex-1 items-center rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3 transition-colors focus-within:border-[var(--projects-border-hover)] sm:max-w-[318px]">
        <Search
          size={15}
          strokeWidth={1.8}
          className="mr-2.5 shrink-0 text-[var(--projects-muted)]"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          type="search"
          placeholder="Search for a project"
          aria-label="Search projects"
          className="min-w-0 flex-1 bg-transparent text-[13px] leading-[18px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <Dropdown
        value={status}
        onChange={onStatusChange}
        label="Status"
        options={[
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
          { value: "paused", label: "Paused" },
        ]}
        className="border border-dashed border-[var(--projects-border)]"
      />

      <SortButton sort={sort} onChange={onSortChange} />

      <div className="ml-auto flex items-center gap-1">
        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
}
