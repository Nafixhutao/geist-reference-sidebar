import { Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "./types";

export function ProjectStatusBadge({
  status,
  variant,
}: {
  status: Project["status"];
  variant: "chip" | "dot";
}) {
  const isPaused = status === "paused";

  if (variant === "chip") {
    return (
      <span
        className={cn(
          "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium",
          isPaused
            ? "bg-[color-mix(in_srgb,var(--projects-warning)_18%,transparent)] text-[var(--projects-warning)]"
            : "bg-[color-mix(in_srgb,var(--projects-accent)_16%,transparent)] text-[var(--projects-accent)]",
        )}
      >
        {isPaused ? (
          <Pause size={10} strokeWidth={3} aria-hidden="true" />
        ) : (
          <span className="size-1.5 rounded-full bg-[var(--projects-accent)]" aria-hidden="true" />
        )}
        {isPaused ? "Paused" : "Active"}
      </span>
    );
  }

  return (
    <dd
      className={cn(
        "m-0 inline-flex items-center gap-1.5 text-[12px] font-medium",
        isPaused ? "text-[var(--projects-warning)]" : "text-[var(--projects-accent)]",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isPaused ? "bg-[var(--projects-warning)]" : "bg-[var(--projects-accent)]",
        )}
      />
      {isPaused ? "Paused" : "Active"}
    </dd>
  );
}
