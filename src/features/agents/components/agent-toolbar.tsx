import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AGENT_ROLES } from "../data";
import type { AgentRole, AgentStatus } from "../types";

export type StatusFilter = "all" | AgentStatus;
export type RoleFilter = "all" | AgentRole;
export type AgentSort = "recent" | "name";

function ToolbarDropdown<T extends string>({
  value,
  options,
  onChange,
  align = "left",
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  align?: "left" | "right";
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

  const current = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-[10px] border border-[var(--projects-border)] px-3.5 text-xs font-medium leading-4 text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]",
          open && "border-[var(--projects-border-hover)]",
        )}
      >
        {current?.label ?? value}
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className={cn("text-[var(--projects-muted)] transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full z-30 mt-1.5 min-w-[160px] rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-1 shadow-xl shadow-black/30",
            align === "right" ? "right-0" : "left-0",
          )}
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
                <Check size={13} strokeWidth={2} className="shrink-0 text-[var(--projects-accent)]" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AgentToolbar({
  query,
  status,
  role,
  sort,
  onQueryChange,
  onStatusChange,
  onRoleChange,
  onSortChange,
}: {
  query: string;
  status: StatusFilter;
  role: RoleFilter;
  sort: AgentSort;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onRoleChange: (value: RoleFilter) => void;
  onSortChange: (value: AgentSort) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <label className="flex h-10 min-w-[200px] flex-1 items-center rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3 transition-colors focus-within:border-[var(--projects-border-hover)] sm:max-w-[300px]">
        <Search size={15} strokeWidth={1.8} className="mr-2.5 shrink-0 text-[var(--projects-muted)]" aria-hidden="true" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          type="search"
          placeholder="Search agents..."
          aria-label="Search agents"
          className="min-w-0 flex-1 bg-transparent text-[13px] leading-[18px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)] [&::-webkit-search-cancel-button]:hidden"
        />
      </label>

      <ToolbarDropdown
        value={status}
        onChange={onStatusChange}
        options={[
          { value: "all", label: "All status" },
          { value: "active", label: "Active" },
          { value: "running", label: "Running" },
          { value: "idle", label: "Idle" },
        ]}
      />

      <ToolbarDropdown
        value={role}
        onChange={onRoleChange}
        options={[
          { value: "all", label: "All roles" },
          ...AGENT_ROLES.map((item) => ({ value: item, label: item })),
        ]}
      />

      <div className="ml-auto">
        <ToolbarDropdown
          align="right"
          value={sort}
          onChange={onSortChange}
          options={[
            { value: "recent", label: "Recently active" },
            { value: "name", label: "Name" },
          ]}
        />
      </div>
    </div>
  );
}
