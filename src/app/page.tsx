"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../Sidebar";
import { ProjectsPage } from "../ProjectsPage";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") void import("react-grab");
  }, []);

  return (
    <div className="min-h-dvh bg-[#1A181D]">
      <div className="min-h-dvh lg:flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="relative min-h-dvh min-w-0 flex-1">
          <ProjectsPage onOpenSidebar={() => setSidebarOpen(true)} />
        </main>
      </div>
    </div>
  );
}
