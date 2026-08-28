"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";
type TooltipAlign = "start" | "center" | "end";

type TooltipSettings = {
  openDelay: number;
  closeDelay: number;
  side: TooltipSide;
  sideOffset: number;
  align: TooltipAlign;
  alignOffset: number;
};

const DEFAULTS: TooltipSettings = {
  openDelay: 200,
  closeDelay: 120,
  side: "top",
  sideOffset: 6,
  align: "center",
  alignOffset: 0,
};

const TooltipProviderContext = createContext<TooltipSettings>(DEFAULTS);

export function TooltipProvider({
  children,
  openDelay,
  closeDelay,
  side,
  sideOffset,
  align,
  alignOffset,
}: { children: ReactNode } & Partial<TooltipSettings>) {
  return (
    <TooltipProviderContext.Provider
      value={{
        openDelay: openDelay ?? DEFAULTS.openDelay,
        closeDelay: closeDelay ?? DEFAULTS.closeDelay,
        side: side ?? DEFAULTS.side,
        sideOffset: sideOffset ?? DEFAULTS.sideOffset,
        align: align ?? DEFAULTS.align,
        alignOffset: alignOffset ?? DEFAULTS.alignOffset,
      }}
    >
      {children}
    </TooltipProviderContext.Provider>
  );
}

type TooltipState = {
  open: boolean;
  id: string;
  anchorRef: React.RefObject<HTMLSpanElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  position: { left: number; top: number };
  openLater: () => void;
  closeLater: () => void;
  openNow: () => void;
  closeNow: () => void;
};

const TooltipContext = createContext<TooltipState | null>(null);

export function Tooltip({
  children,
  side,
  sideOffset,
  align,
  alignOffset,
}: { children: ReactNode } & Partial<Pick<TooltipSettings, "side" | "sideOffset" | "align" | "alignOffset">>) {
  const global = useContext(TooltipProviderContext);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const anchorRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const resolved = {
    side: side ?? global.side,
    sideOffset: sideOffset ?? global.sideOffset,
    align: align ?? global.align,
    alignOffset: alignOffset ?? global.alignOffset,
  };
  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const content = contentRef.current;
    if (!anchor || !content) return;

    const { side: targetSide, sideOffset: gap, align: targetAlign, alignOffset } = resolvedRef.current;
    const anchorRect = anchor.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();

    let left = 0;
    let top = 0;
    if (targetSide === "top") top = -contentRect.height - gap;
    else if (targetSide === "bottom") top = anchorRect.height + gap;
    else if (targetSide === "left") left = -contentRect.width - gap;
    else left = anchorRect.width + gap;

    if (targetSide === "left" || targetSide === "right") {
      if (targetAlign === "start") top = alignOffset;
      else if (targetAlign === "end") top = anchorRect.height - contentRect.height - alignOffset;
      else top = (anchorRect.height - contentRect.height) / 2;
    } else {
      if (targetAlign === "start") left = alignOffset;
      else if (targetAlign === "end") left = anchorRect.width - contentRect.width - alignOffset;
      else left = (anchorRect.width - contentRect.width) / 2;
    }

    // Keep the tooltip inside the viewport (positions are relative to the anchor).
    const margin = 8;
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    left = Math.max(margin - anchorRect.left, Math.min(left, viewportWidth - margin - contentRect.width - anchorRect.left));
    top = Math.max(margin - anchorRect.top, Math.min(top, viewportHeight - margin - contentRect.height - anchorRect.top));

    setPosition({ left, top });
  }, [open]);

  const context: TooltipState = {
    open,
    id,
    anchorRef,
    contentRef,
    position,
    openLater: () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setOpen(true), global.openDelay);
    },
    closeLater: () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      closeTimer.current = setTimeout(() => setOpen(false), global.closeDelay);
    },
    openNow: () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOpen(true);
    },
    closeNow: () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setOpen(false);
    },
  };

  return (
    <TooltipContext.Provider value={context}>
      <span ref={anchorRef} className="relative inline-flex">
        {children}
      </span>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children }: { children: ReactNode }) {
  const tooltip = useContext(TooltipContext);
  if (!tooltip) return children;

  return (
    <span
      className="inline-flex"
      onMouseEnter={tooltip.openLater}
      onMouseLeave={tooltip.closeLater}
      onFocus={tooltip.openNow}
      onBlur={tooltip.closeNow}
    >
      {children}
    </span>
  );
}

export function TooltipContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const tooltip = useContext(TooltipContext);
  if (!tooltip) return null;

  return (
    <AnimatePresence>
      {tooltip.open && (
        <motion.div
          ref={tooltip.contentRef}
          id={tooltip.id}
          role="tooltip"
          style={{ left: tooltip.position.left, top: tooltip.position.top }}
          className={cn(
            "pointer-events-none absolute z-50 max-w-[320px] whitespace-nowrap rounded-xl border border-[var(--projects-border-hover)] bg-[var(--projects-card-bg)] px-3 py-2 text-[12px] font-[450] leading-4 text-[oklch(0.95_0.00275_159)] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
            className,
          )}
          initial={{ opacity: 0, scale: 0.95, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 6 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
