"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Sidebar } from "@/features/navigation/sidebar";

type ApplicationShellValue = {
  openSidebar: () => void;
};

const ApplicationContext = createContext<ApplicationShellValue | null>(null);

/** Pages inside the shell use this to open the mobile navigation sheet. */
export function useApplicationShell() {
  return useContext(ApplicationContext);
}

/**
 * Shared chrome for every route: responsive sidebar plus the content area.
 * Page content is passed as children so each page keeps its own client
 * boundary instead of the whole tree being one.
 */
export function ApplicationShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Stable identity: consumers (pages with heavy tables) must not re-render
  // just because the shell re-rendered.
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const shellValue = useMemo(() => ({ openSidebar }), [openSidebar]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") void import("react-grab");
  }, []);

  return (
    <ApplicationContext.Provider value={shellValue}>
      <div className="min-h-dvh bg-[var(--projects-bg)]">
        <div className="min-h-dvh lg:flex">
          <Sidebar open={sidebarOpen} onClose={closeSidebar} />
          <main className="relative min-h-dvh min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </ApplicationContext.Provider>
  );
}
