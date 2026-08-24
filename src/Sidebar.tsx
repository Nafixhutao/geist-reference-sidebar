"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DesktopSidebar } from "./sidebar/desktop-sidebar";
import { MobileSheet } from "./sidebar/mobile-sheet";
import type { SidebarProps } from "./sidebar/types";

function subscribeMediaQuery(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Same shape as the beui useIsMobile: server assumes the desktop branch. */
function useMediaQuery(query: string) {
  const subscribe = useCallback((callback: () => void) => subscribeMediaQuery(query, callback), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
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

export type { SidebarProps } from "./sidebar/types";
