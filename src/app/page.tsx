"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../Sidebar";
import { ProjectsPage } from "../ProjectsPage";
import { TopBar } from "../TopBar";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") void import("react-grab");
  }, []);

  return (
    <div className="min-h-dvh bg-[#1A181D]">
      <TopBar onMenuClick={() => setSidebarOpen(true)} />
      <div className="min-h-[calc(100dvh-48px)] lg:flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="relative min-h-[calc(100dvh-48px)] min-w-0 flex-1">
          <ProjectsPage />
        </main>
      </div>
    </div>
  );
}
