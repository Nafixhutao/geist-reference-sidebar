"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../Sidebar";
import { SkeletonDemo } from "../SkeletonDemo";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") import("react-grab");
  }, []);

  return (
    // lg:flex puts the desktop sidebar in flow, so the main content rides
    // along while the sidebar springs between panel and icon rail
    <div className="min-h-dvh bg-[#1A181D] lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-dvh min-w-0 flex-1">
        <SkeletonDemo />
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="m-4 inline-flex items-center gap-2 rounded-md border border-[#38343d] bg-[#232127] px-3 py-2 text-sm text-[#C5C1C9] transition-colors hover:bg-white/[0.04] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={16} />
          Menu
        </button>
      </main>
    </div>
  );
}
