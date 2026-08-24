"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  REDUCED_TRANSITION,
  SIDEBAR_COLLAPSE_TRANSITION,
  SIDEBAR_EXPAND_TRANSITION,
} from "@/lib/ease";
import { cn } from "@/lib/utils";
import { SidebarContent } from "./navigation";

/** Desktop rail width when collapsed to icons only — measured from the
 * reference rail capture: 51px content + 1px border. */
const RAIL_WIDTH = 52;
/** Expanded desktop sidebar width. */
const PANEL_WIDTH = 268;

export function DesktopSidebar({ hasTopBar = false }: { hasTopBar?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const toggle = () => setCollapsed((value) => !value);
    window.addEventListener("toggle-desktop-sidebar", toggle);
    return () => window.removeEventListener("toggle-desktop-sidebar", toggle);
  }, []);

  return (
    // in-flow so the page content rides along while the width eases
    // between the icon rail and the full panel (beui collapsible="icon")
    <motion.aside
      aria-label="Main navigation"
      data-state={collapsed ? "collapsed" : "expanded"}
      initial={false}
      animate={{ width: collapsed ? RAIL_WIDTH : PANEL_WIDTH }}
      transition={
        reduce
          ? REDUCED_TRANSITION
          : collapsed
            ? SIDEBAR_COLLAPSE_TRANSITION
            : SIDEBAR_EXPAND_TRANSITION
      }
      className="relative z-50 hidden shrink-0 lg:block"
    >
      <div
        className={cn(
          "sticky flex w-full flex-col overflow-hidden border-r border-[#322F37] bg-[#121014]",
          hasTopBar ? "top-12 h-[calc(100dvh-48px)]" : "top-0 h-dvh",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      </div>
    </motion.aside>
  );
}
