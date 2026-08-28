"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "../../sidebar/Sidebar";
import { AgentPage } from "../../agents/AgentPage";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") void import("react-grab");
  }, []);

  return (
    <div className="min-h-dvh bg-[var(--projects-bg)]">
      <div className="min-h-dvh lg:flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="relative min-h-dvh min-w-0 flex-1">
          <AgentPage onOpenSidebar={() => setSidebarOpen(true)} />
        </main>
      </div>
    </div>
  );
}
