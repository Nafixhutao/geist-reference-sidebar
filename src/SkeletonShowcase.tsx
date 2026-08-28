"use client";

import { PixelSkeleton } from "./PixelSkeleton";

/** Contoh penggunaan PixelSkeleton: dasar, kartu, dan layout. */
export function SkeletonShowcase() {
  return (
    <div className="min-h-dvh space-y-10 p-6">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[#EEEAF0]">Dasar</h2>
        <PixelSkeleton className="h-5 w-24" />
        <PixelSkeleton className="h-10 w-40" />
        <PixelSkeleton className="h-10 w-full rounded-md" />
        <PixelSkeleton className="h-4 w-3/4 max-w-full" />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[#EEEAF0]">Skeleton card</h2>
        <div className="max-w-sm rounded-xl border border-[#322F37] bg-[#232127] p-4">
          <div className="flex items-center gap-3">
            <PixelSkeleton circular className="h-10 w-10" />
            <div className="flex-1 space-y-2">
              <PixelSkeleton className="h-4 w-1/2" />
              <PixelSkeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <PixelSkeleton className="h-3 w-full" />
            <PixelSkeleton className="h-3 w-5/6" />
            <PixelSkeleton className="h-3 w-2/3" />
          </div>
          <PixelSkeleton className="mt-4 h-8 w-full rounded-md" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-[#EEEAF0]">Skeleton layout</h2>
        <div className="flex gap-4">
          <div className="hidden w-40 shrink-0 space-y-2 sm:block">
            <PixelSkeleton className="h-8 w-full" />
            <PixelSkeleton className="h-3 w-full" />
            <PixelSkeleton className="h-3 w-full" />
            <PixelSkeleton className="h-3 w-4/5" />
            <PixelSkeleton className="h-3 w-full" />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <PixelSkeleton className="h-6 w-1/3" />
            <PixelSkeleton className="h-40 w-full rounded-md" />
            <PixelSkeleton className="h-3 w-full" />
            <PixelSkeleton className="h-3 w-2/3" />
          </div>
        </div>
      </section>
    </div>
  );
}
