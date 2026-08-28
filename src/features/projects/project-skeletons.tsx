import { PixelSkeleton } from "@/components/pixel-skeleton";
import { cn } from "@/lib/utils";
import { ProjectTableHeader, projectTableColumns } from "./project-card";
import type { ProjectView } from "./types";

function ProjectRowSkeleton() {
  return (
    <div
      className={cn(
        "grid min-w-[900px] items-center border-t border-[var(--projects-divider)] bg-[var(--projects-card-bg)] px-5 py-3.5",
        projectTableColumns,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <PixelSkeleton className="size-10 shrink-0 rounded-md" />
        <span className="min-w-0 flex-1 space-y-2">
          <PixelSkeleton className="h-3.5 w-4/5" />
          <PixelSkeleton className="h-3 w-3/5" />
        </span>
      </div>
      <PixelSkeleton className="h-3 w-16" />
      <span className="flex min-w-0 items-center gap-2">
        <PixelSkeleton circular className="size-4 shrink-0" />
        <PixelSkeleton className="h-3 w-20" />
      </span>
      <PixelSkeleton className="h-7 w-16 rounded-md" />
      <PixelSkeleton className="h-6 w-10 rounded" />
      <PixelSkeleton className="h-3 w-24" />
      <PixelSkeleton className="size-10 rounded-md" />
    </div>
  );
}

function ProjectGridCardSkeleton() {
  return (
    <div className="flex min-h-[178px] w-full flex-col rounded-md border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-5">
      <div className="flex items-center gap-3 pr-9">
        <PixelSkeleton className="size-11 shrink-0 rounded-md" />
        <span className="min-w-0 flex-1 space-y-2">
          <PixelSkeleton className="h-3.5 w-3/4" />
          <PixelSkeleton className="h-3 w-1/2" />
        </span>
      </div>
      <div className="mt-auto flex items-center gap-2">
        <PixelSkeleton className="h-7 w-16 rounded-md" />
        <PixelSkeleton className="h-7 w-20 rounded-md" />
        <PixelSkeleton className="ml-auto h-3 w-24" />
      </div>
    </div>
  );
}

export function ProjectsSkeleton({ view }: { view: ProjectView }) {
  if (view === "list") {
    return (
      <div className="mt-5 overflow-x-auto rounded-md border border-[var(--projects-border)]" aria-hidden="true">
        <div className="min-w-[900px]">
          <ProjectTableHeader />
          {Array.from({ length: 6 }, (_, index) => (
            <ProjectRowSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <ProjectGridCardSkeleton key={index} />
      ))}
    </div>
  );
}
