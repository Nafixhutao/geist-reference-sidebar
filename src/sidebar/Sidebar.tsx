"use client";

import { useEffect, useState } from "react";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSheet } from "./mobile-sheet";
import type { SidebarProps } from "./types";

/** Keep the first render identical on the server and browser, then resolve the viewport. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const update = () => setMatches(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** A reference-accurate, responsive navigation drawer. */
export function Sidebar({ open, onClose, hasTopBar = false }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  return isMobile ? (
    <MobileSheet open={open} onClose={onClose} hasTopBar={hasTopBar} />
  ) : (
    <DesktopSidebar hasTopBar={hasTopBar} />
  );
}

export type { SidebarProps } from "./types";
