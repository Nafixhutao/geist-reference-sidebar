"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { PixelSkeleton } from "./PixelSkeleton";
import {
  EASE_DRAWER,
  EASE_OUT,
  LABEL_ENTER_TRANSITION,
  LABEL_EXIT_TRANSITION,
  PANEL_TRANSITION,
  POWER2_INOUT,
  POWER2_OUT,
  REDUCED_TRANSITION,
  SIDEBAR_MORPH_TRANSITION,
  SPRING_LAYOUT,
  SPRING_PRESS,
  SUBMENU_TRANSITION,
} from "@/lib/ease";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  FileText,
  Headphones,
  House,
  LogOut,
  Monitor,
  Moon,
  PieChart,
  ReceiptText,
  Search,
  ShieldCheck,
  Sun,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

/** Desktop rail width when collapsed to icons only — measured from the
 * reference rail capture: 51px content + 1px border. */
const RAIL_WIDTH = 52;
/** Expanded desktop sidebar width. */
const PANEL_WIDTH = 268;

// Open keeps the original morph: clip-path reveal with a staggered blur-up.
// The close is GSAP-style — the measured height tweens to 0 while fading, so
// the rows below ride up with the collapsing box instead of waiting out an
// empty reserved gap. The object-form exit matters: the label-exit path
// never visibly rendered the container's own values in this setup.
const SUBMENU_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    clipPath: "inset(0px 0px 100% 0)",
  },
  open: {
    opacity: 1,
    clipPath: "inset(0px 0px 0% 0)",
    transition: { duration: 0.2, delayChildren: 0.05, ease: EASE_OUT, staggerChildren: 0.035 },
  },
};

const SUBMENU_ITEM_VARIANTS: Variants = {
  closed: { opacity: 0, y: 4, filter: "blur(3px)" },
  open: { opacity: 1, y: 0, filter: "blur(0px)", transition: SUBMENU_TRANSITION },
};

// Original entrance: nav rows stagger in from y:8.
const NAV_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const NAV_ITEM_VARIANTS: Variants = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: POWER2_OUT } },
};

const tap = (reduce: boolean) => (reduce ? undefined : { scale: 0.98 });

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

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

export interface SidebarProps {
  /** Controls the slide-in mobile drawer. Desktop is always visible. */
  open: boolean;
  onClose: () => void;
}

type BadgeKind = "Beta" | "New";

type NavRowProps = {
  icon: ReactNode;
  label: string;
  badge?: BadgeKind;
  expandable?: boolean;
  labelClassName?: string;
  /** Renders the shared layoutId pill behind the row when selected. */
  isActive?: boolean;
  /** Shared layoutId — every row in a sidebar passes the same one so the
   * active pill morphs between rows instead of remounting. */
  layoutId?: string;
  onSelect?: () => void;
  /** Desktop rail mode: labels fade out and the row keeps its icon only. */
  collapsed?: boolean;
};

const NavIcon = (Icon: LucideIcon) => (
  <Icon size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
);

// `relative isolate` turns the row into its own stacking context so the
// active pill (-z-10) paints above the row background but below the content.
const rowClass =
  "relative isolate flex h-[34px] w-full items-center gap-[10px] px-4 text-left text-[13px] font-normal text-[#C5C1C9] transition-colors hover:bg-white/[0.035] lg:h-[38px] lg:text-[14px]";

/** Rail-only separator between nav groups: folds away while the panel is
 * expanded (reference rail shows the two dividers at 8px/12px gutters). */
function RailDivider({ collapsed }: { collapsed: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{
        opacity: collapsed ? 1 : 0,
        height: collapsed ? 1 : 0,
        marginTop: collapsed ? 5 : 0,
        marginBottom: collapsed ? 5 : 0,
      }}
      transition={collapsed ? LABEL_ENTER_TRANSITION : LABEL_EXIT_TRANSITION}
      className="pointer-events-none ml-2 mr-3 overflow-hidden bg-[#322F37]"
    />
  );
}

/** The active-row pill from the beui animated-sidebar: one motion.span per
 * sidebar sharing a layoutId, so switching rows morphs the box across. */
function ActiveRowPill({ layoutId, reduce }: { layoutId?: string; reduce: boolean }) {
  if (!layoutId) return null;
  return (
    <motion.span
      aria-hidden="true"
      layoutId={layoutId}
      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
      className="absolute inset-0 -z-10 bg-white/[0.06]"
    />
  );
}

/** Crossfades a label while the rail collapses/expands (beui label
 * transitions): leaves fast so the shrinking width never clips mid-word,
 * returns slightly delayed once the panel has opened around it. */
function RailLabel({ collapsed, className, children }: { collapsed: boolean; className?: string; children: ReactNode }) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: collapsed ? 0 : 1, x: collapsed ? -6 : 0 }}
      transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
      aria-hidden={collapsed}
      className={cn("min-w-0", collapsed && "pointer-events-none", className)}
    >
      {children}
    </motion.span>
  );
}

function Badge({ kind }: { kind: BadgeKind }) {
  return kind === "New" ? (
    <span className="ml-auto rounded-[6px] bg-[#331E0B] px-[7px] py-[2px] text-[12px] font-medium leading-[16px] text-[rgb(255,160,87)]">
      New
    </span>
  ) : (
    <span className="ml-auto mr-2 rounded-[5px] bg-[#201E22] px-[6px] py-[2px] text-[10px] font-medium leading-none text-[#C9C5CD]">
      Beta
    </span>
  );
}

// Dual chevron that pinches toward its resting position while a submenu is
// open — the expandable affordance reacts to state instead of sitting still.
function ChevronToggle({
  className = "",
  open = false,
  reduce = false,
}: {
  className?: string;
  open?: boolean;
  reduce?: boolean;
}) {
  const transition = reduce ? { duration: 0 } : SPRING_LAYOUT;
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        initial={false}
        animate={{ y: open ? 0 : -0.6 }}
        transition={transition}
        d="M10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
      />
      <motion.path
        fillRule="evenodd"
        clipRule="evenodd"
        initial={false}
        animate={{ y: open ? 0 : 0.6 }}
        transition={transition}
        d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06Z"
      />
    </svg>
  );
}

function BrandIcon({ brand }: { brand: "slack" | "discord" }) {
  if (brand === "slack") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[14px] w-[14px] shrink-0 fill-current text-[#AAA6AE] lg:h-[15px] lg:w-[15px]">
        <path d="M6.2 14.5a2.2 2.2 0 1 1-2.2-2.2h2.2v2.2ZM7.3 14.5a2.2 2.2 0 1 1 4.4 0V20a2.2 2.2 0 1 1-4.4 0v-5.5Z" />
        <path d="M9.5 6.2a2.2 2.2 0 1 1 2.2-2.2v2.2H9.5ZM9.5 7.3a2.2 2.2 0 1 1 0 4.4H4a2.2 2.2 0 1 1 0-4.4h5.5Z" />
        <path d="M17.8 9.5A2.2 2.2 0 1 1 20 11.7h-2.2V9.5ZM16.7 9.5a2.2 2.2 0 1 1-4.4 0V4a2.2 2.2 0 1 1 4.4 0v5.5Z" />
        <path d="M14.5 17.8a2.2 2.2 0 1 1-2.2 2.2v-2.2h2.2ZM14.5 16.7a2.2 2.2 0 1 1 0-4.4H20a2.2 2.2 0 1 1 0 4.4h-5.5Z" />
      </svg>
    );
  }

  return (
    <span className="flex size-4 shrink-0 items-center justify-center text-[#AAA6AE] [&>svg]:size-4">
      <svg viewBox="-32 -60.5 320 320" fill="currentColor" aria-hidden="true" preserveAspectRatio="xMidYMid">
        <path
          fillRule="nonzero"
          d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.666201 245.831087,59.8662432 216.856339,16.5966031 ZM85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145857 85.4738752,82.7145857 C98.3405064,82.7145857 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 ZM170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145857 170.525237,82.7145857 C183.391518,82.7145857 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        />
      </svg>
    </span>
  );
}

function NavRow({
  icon,
  label,
  badge,
  expandable = false,
  labelClassName = "",
  isActive = false,
  layoutId,
  onSelect,
  collapsed = false,
}: NavRowProps) {
  const reduce = useReducedMotion() ?? false;
  return (
    // layout wrapper lets rows below an opening/closing submenu glide
    <motion.div layout="position" transition={SPRING_LAYOUT} variants={NAV_ITEM_VARIANTS}>
      <motion.button
        type="button"
        className={rowClass}
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
      >
        {isActive && <ActiveRowPill layoutId={layoutId} reduce={reduce} />}
        {icon}
        <RailLabel collapsed={collapsed} className={`flex-1 origin-left truncate ${labelClassName}`}>
          {label}
        </RailLabel>
        {badge && (
          <motion.span
            initial={false}
            aria-hidden={collapsed}
            animate={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 80 }}
            transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
            className="overflow-hidden"
          >
            <Badge kind={badge} />
          </motion.span>
        )}
        {expandable && (
          <motion.span
            initial={false}
            aria-hidden={collapsed}
            animate={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 20 }}
            transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
            className="overflow-hidden"
          >
            <ChevronToggle className="size-[13px] shrink-0 text-[#737078]" />
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
}

function Header({
  onClose,
  collapsed = false,
  onToggleCollapse,
}: {
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [planLoading, setPlanLoading] = useState(true);
  const reduce = useReducedMotion() ?? false;
  useEffect(() => {
    const timer = setTimeout(() => setPlanLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="flex h-[44px] shrink-0 items-center px-4 lg:h-[48px]">
      {/* the identity slot folds away entirely in the rail — it must not
       * reserve space, or it pushes the collapse toggle out of the rail */}
      <motion.div
        initial={false}
        animate={{ maxWidth: collapsed ? 0 : 220 }}
        transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
        className="flex min-w-0 items-center overflow-hidden"
      >
        <motion.img
          alt="Nafixhutao avatar"
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1 }}
          transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
          className="shrink-0 object-cover size-5 rounded-md"
          src="https://avatars.githubusercontent.com/u/135522402?s=80&v=4"
        />
        <RailLabel collapsed={collapsed} className="flex items-center">
          <span className="ml-2 text-[14px] font-medium tracking-[-0.01em] leading-[20px] text-[oklch(0.949_0.0035_305)]">Nafixhutao</span>
          {planLoading ? (
            <PixelSkeleton className="ml-2 h-5 w-14" />
          ) : (
            <span className="ml-2 rounded-[5px] bg-[#201E22] px-[6px] py-[2px] text-[12px] font-medium leading-[16px] text-[oklch(0.767_0.0105_305)]">Pro Plus</span>
          )}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="ml-2 size-[13px] shrink-0 text-[#737078]" aria-hidden="true">
            <path d="m7 8 5-5 5 5" />
            <path d="m7 16 5 5 5-5" />
          </svg>
        </RailLabel>
      </motion.div>
      <motion.button
        type="button"
        onClick={onClose}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
        className="ml-auto inline-flex h-6 w-6 items-center justify-center text-[#AAA6AE] transition-colors hover:text-[#EEEAF0] lg:hidden"
        aria-label="Close sidebar"
      >
        <X size={14} strokeWidth={1.8} />
      </motion.button>
      <motion.button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
        className="group/btn ml-auto hidden shrink-0 text-[#AAA6AE] transition-colors hover:text-[#EEEAF0] lg:block"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="5" height="6" rx="0.75" fill="currentColor" className="transition-[width] duration-300 ease-cui-out-expo [width:4px] group-hover/btn:[width:2.5px]" />
        </svg>
      </motion.button>
    </header>
  );
}

function ReviewSection({
  open,
  onToggle,
  isActive = false,
  layoutId,
  onActivate,
  collapsed = false,
}: {
  open: boolean;
  onToggle: () => void;
  isActive?: boolean;
  layoutId?: string;
  onActivate?: () => void;
  collapsed?: boolean;
}) {
  const reduce = useReducedMotion() ?? false;
  const submenuRef = useRef<HTMLDivElement>(null);
  // beui pattern: choosing a child highlights it statically and moves the
  // shared pill onto the parent group row.
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const submenu = ["Triage", "Repositories", "Integrations", "Learnings", "Caches", "Organization Settings"];

  // A resting filter forces a compositing layer and flips the submenu text
  // from subpixel to grayscale antialiasing. The clip-path stays: the exit
  // reveal needs an interpolable origin, and inset(0 0 0% 0) does not composite.
  const clearSubmenuArtifacts = () => {
    submenuRef.current
      ?.querySelectorAll("button")
      .forEach((b) => b.style.removeProperty("filter"));
  };

  return (
    // joins the nav entrance stagger like every other row; layout keeps the
    // rows below gliding when the submenu opens/closes
    <motion.section layout="position" transition={SPRING_LAYOUT} variants={NAV_ITEM_VARIANTS}>
      <motion.button
        type="button"
        className={rowClass}
        onClick={onToggle}
        aria-expanded={open}
        aria-current={isActive ? "page" : undefined}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
      >
        {isActive && <ActiveRowPill layoutId={layoutId} reduce={reduce} />}
        <FileText size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
        <RailLabel collapsed={collapsed} className="flex-1">
          Review
        </RailLabel>
        <motion.span
          initial={false}
          aria-hidden={collapsed}
          animate={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 20 }}
          transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
          className="overflow-hidden"
        >
          <ChevronToggle className="size-[13px] shrink-0 text-[#737078]" open={open} reduce={reduce} />
        </motion.span>
      </motion.button>
      {/* a submenu cannot render inside the icon rail (beui: !panel.collapsed) */}
      <AnimatePresence>
        {open && !collapsed && (
          <motion.div
            key="review-submenu"
            ref={submenuRef}
            className="ml-[22px] overflow-hidden border-l border-[#3A373F] pl-[20px]"
            variants={reduce ? undefined : SUBMENU_VARIANTS}
            initial={reduce ? false : "closed"}
            animate={reduce ? { opacity: 1 } : "open"}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.12 } }
                : { opacity: 0, height: 0, transition: { duration: 0.28, ease: POWER2_INOUT } }
            }
            onAnimationComplete={() => {
              if (!open) return;
              clearSubmenuArtifacts();
              // the item stagger settles after the container's own tween —
              // strip the filters again once it has finished writing them
              setTimeout(clearSubmenuArtifacts, 500);
            }}
          >
            {submenu.map((item) => (
              <motion.button
                type="button"
                key={item}
                variants={reduce ? undefined : SUBMENU_ITEM_VARIANTS}
                onClick={() => {
                  setActiveItem(item);
                  onActivate?.();
                }}
                aria-current={activeItem === item ? "page" : undefined}
                whileTap={tap(reduce)}
                transition={SPRING_PRESS}
                className={`flex h-[30px] w-full items-center text-left text-[12px] font-normal transition-colors lg:h-[34px] lg:text-[14px] ${
                  activeItem === item ? "bg-white/[0.03] text-[#EEEAF0]" : "text-[#C5C1C9] hover:text-[#EEEAF0]"
                }`}
              >
                <span>{item}</span>
                {item === "Triage" && <Badge kind="Beta" />}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

const menuRowClass =
  "flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-[13px] text-[#b3b0ba] transition-colors hover:bg-[#26262e] hover:text-[#edecf1] [&>svg]:shrink-0";

function Divider() {
  return <div aria-hidden="true" className="mx-2 my-1 h-px bg-[#2d2d35]" />;
}

const themeOptions = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
] as const;

type ThemeId = (typeof themeOptions)[number]["id"];

function ProfileMenu({ onClose }: { onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeId>("dark");
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      role="menu"
      aria-label="Account menu"
      // ponytail: anchored inside the overflow-hidden aside; portal it if it ever clips on short viewports
      className="absolute bottom-[calc(100%+10px)] left-3 right-3 z-50 rounded-[12px] border border-[#2d2d35] bg-[#232127] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
      style={{ transformOrigin: "bottom left" }}
      initial={reduce ? false : { y: 8, scale: 0.98, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: POWER2_OUT }}
    >
      <div aria-hidden="true" className="absolute -bottom-[5px] left-4 size-2.5 rotate-45 border-b border-r border-[#2d2d35] bg-[#232127]" />

      <div className="flex items-center gap-2.5 px-2.5 py-2.5">
        <img alt="" className="size-9 shrink-0 rounded-full object-cover" src="https://avatars.githubusercontent.com/u/135522402?v=4" />
        <div className="min-w-0 leading-tight">
          <p className="m-0 truncate text-[13px] font-semibold text-[#edecf1]">Nafixhutao</p>
          <p className="m-0 mt-[2px] truncate text-[12px] text-[#8a8791]">@nafixhutao</p>
        </div>
      </div>

      <Divider />

      <div className="flex items-center justify-between px-2.5 py-2">
        <span className="text-[13px] text-[#b3b0ba]">Theme</span>
        <div className="flex items-center gap-0.5 rounded-full bg-[#26262e] p-0.5">
          {themeOptions.map(({ id, label, Icon }) => (
            <motion.button
              type="button"
              key={id}
              aria-label={label}
              aria-pressed={theme === id}
              onClick={() => setTheme(id)}
              whileTap={tap(reduce)}
              transition={SPRING_PRESS}
              className={`flex size-6 items-center justify-center rounded-full transition-colors ${
                theme === id ? "bg-[#edecf1] text-[#1a1a1a]" : "text-[#b3b0ba] hover:text-[#edecf1]"
              }`}
            >
              <Icon size={13} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>

      <Divider />

      <motion.button type="button" role="menuitem" className={menuRowClass} whileTap={tap(reduce)} transition={SPRING_PRESS}>
        <User size={15} strokeWidth={1.8} aria-hidden="true" />
        Profile Settings
      </motion.button>
      <motion.button type="button" role="menuitem" className={menuRowClass} whileTap={tap(reduce)} transition={SPRING_PRESS}>
        <ExternalLink size={15} strokeWidth={1.8} aria-hidden="true" />
        Refer and Earn
      </motion.button>
      <motion.button type="button" role="menuitem" className={`${menuRowClass} text-[#f2708a] hover:text-[#f2708a]`} whileTap={tap(reduce)} transition={SPRING_PRESS}>
        <LogOut size={15} strokeWidth={1.8} aria-hidden="true" />
        Log out
      </motion.button>
    </motion.div>
  );
}

function BottomProfile({
  collapsed = false,
  onToggleCollapse,
}: {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion() ?? false;
  const close = useCallback(() => setOpen(false), []);

  return (
    <footer className="relative shrink-0">
      <motion.button
        type="button"
        onClick={() => {
          // the profile menu cannot live in the rail either — unfold first
          if (collapsed) onToggleCollapse?.();
          else setOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
        className="flex w-full items-center px-[14px] py-[10px] text-left transition-colors hover:bg-white/[0.035]"
      >
        {/* rail shows a small 20px avatar, the panel wraps it in the full row */}
        <motion.img
          alt="Nafixhutao avatar"
          initial={false}
          animate={{ width: collapsed ? 20 : 32, height: collapsed ? 20 : 32 }}
          transition={collapsed ? LABEL_EXIT_TRANSITION : LABEL_ENTER_TRANSITION}
          className="shrink-0 object-cover rounded-full"
          src="https://avatars.githubusercontent.com/u/135522402?v=4"
        />
        <RailLabel collapsed={collapsed} className="flex min-w-0 flex-1 items-center">
          <div className="ml-2 min-w-0 leading-tight">
            <p className="m-0 truncate text-[14px] leading-[20px] text-[oklch(0.767_0.0105_305)]">Nafixhutao</p>
            <p className="m-0 mt-[2px] text-[12px] leading-[16px] text-[oklch(0.585_0.0161_305)]">Admin</p>
          </div>
          <ChevronsUpDown size={12} strokeWidth={1.7} className="ml-auto shrink-0 text-[#737078]" aria-hidden="true" />
        </RailLabel>
      </motion.button>
      {open && <ProfileMenu onClose={close} />}
    </footer>
  );
}

/** Everything inside the panel, shared by the desktop rail and mobile sheet. */
function SidebarContent({
  onMobileClose,
  collapsed = false,
  onToggleCollapse,
}: {
  onMobileClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const pillId = useId();
  const reduce = useReducedMotion() ?? false;

  // Selecting from the collapsed rail unfolds the panel first (beui: a
  // submenu cannot live in the rail, so selecting expands it).
  const select = (label: string) => {
    setActive(label);
    if (collapsed) onToggleCollapse?.();
  };

  return (
    <>
      <Header onClose={onMobileClose} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      <motion.nav
        className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pb-1"
        aria-label="Sidebar links"
        variants={NAV_VARIANTS}
        initial={reduce ? false : "hidden"}
        animate="visible"
      >
        <NavRow
          icon={NavIcon(Search)}
          label="Search"
          labelClassName="text-[14px] leading-[20px] text-[oklch(0.949_0.0035_305)]"
          isActive={active === "Search"}
          layoutId={pillId}
          onSelect={() => select("Search")}
          collapsed={collapsed}
        />
        <NavRow icon={NavIcon(House)} label="Explore" isActive={active === "Explore"} layoutId={pillId} onSelect={() => select("Explore")} collapsed={collapsed} />
        <NavRow icon={NavIcon(PieChart)} label="Analytics" expandable isActive={active === "Analytics"} layoutId={pillId} onSelect={() => select("Analytics")} collapsed={collapsed} />
        <RailDivider collapsed={collapsed} />
        <ReviewSection
          open={reviewOpen}
          onToggle={() => setReviewOpen((value) => !value)}
          isActive={active === "Review"}
          layoutId={pillId}
          onActivate={() => select("Review")}
          collapsed={collapsed}
        />
        <NavRow icon={<BrandIcon brand="slack" />} label="Slack" badge="New" expandable isActive={active === "Slack"} layoutId={pillId} onSelect={() => select("Slack")} collapsed={collapsed} />
        <NavRow icon={<BrandIcon brand="discord" />} label="Discord" expandable isActive={active === "Discord"} layoutId={pillId} onSelect={() => select("Discord")} collapsed={collapsed} />
        <NavRow icon={NavIcon(ShieldCheck)} label="Security" badge="New" expandable isActive={active === "Security"} layoutId={pillId} onSelect={() => select("Security")} collapsed={collapsed} />
        <NavRow icon={NavIcon(ReceiptText)} label="Plan" expandable isActive={active === "Plan"} layoutId={pillId} onSelect={() => select("Plan")} collapsed={collapsed} />
        <RailDivider collapsed={collapsed} />
        <NavRow icon={NavIcon(Users)} label="Account" expandable isActive={active === "Account"} layoutId={pillId} onSelect={() => select("Account")} collapsed={collapsed} />
        <NavRow icon={NavIcon(BookOpen)} label="Documentation" isActive={active === "Documentation"} layoutId={pillId} onSelect={() => select("Documentation")} collapsed={collapsed} />
        <NavRow icon={NavIcon(Headphones)} label="Contact Support" isActive={active === "Contact Support"} layoutId={pillId} onSelect={() => select("Contact Support")} collapsed={collapsed} />
      </motion.nav>
      <AnimatePresence>
        {reviewOpen && !collapsed && (
          <motion.div
            key="view-more"
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6, transition: { duration: 0.18, ease: EASE_OUT } }}
            transition={reduce ? REDUCED_TRANSITION : { duration: 0.25, ease: EASE_OUT }}
            className="relative flex shrink-0 items-center justify-center px-2 py-3"
          >
            <div className="absolute inset-x-2 h-px bg-[#322F37]" />
            <motion.button
              type="button"
              whileTap={tap(reduce)}
              transition={SPRING_PRESS}
              className="relative z-10 inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full border border-[#322F37] bg-[#121014] px-[10px] text-[12px] font-medium leading-[16px] text-[oklch(0.949_0.0035_305)] transition-colors hover:bg-white/[0.04]"
            >
              <ChevronDown size={12} strokeWidth={2} className="shrink-0" />
              View more
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomProfile collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
    </>
  );
}

function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const reduce = useReducedMotion() ?? false;

  return (
    // in-flow so the page content rides along while the width springs
    // between the icon rail and the full panel (beui collapsible="icon")
    <motion.aside
      aria-label="Main navigation"
      data-state={collapsed ? "collapsed" : "expanded"}
      initial={false}
      animate={{ width: collapsed ? RAIL_WIDTH : PANEL_WIDTH }}
      transition={reduce ? REDUCED_TRANSITION : SIDEBAR_MORPH_TRANSITION}
      className="relative z-50 hidden shrink-0 lg:block"
    >
      <div className="sticky top-0 flex h-dvh w-full flex-col overflow-hidden border-r border-[#322F37] bg-[#121014]">
        <SidebarContent collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      </div>
    </motion.aside>
  );
}

/**
 * Mobile sheet over the beui animated-sidebar pattern: stays mounted for as
 * long as the viewport is mobile and hides itself once the close slide has
 * settled, so opening shows it in the same commit that starts the slide.
 * Esc closes, Tab is trapped inside, the body scroll is locked, and focus
 * returns to the opener on close.
 */
function MobileSheet({ open, onClose }: SidebarProps) {
  const reduce = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(!open);
  // The completion callback fires for the open slide too, and it reads state
  // from whenever motion settles: a ref keeps it on the current one.
  const openRef = useRef(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    openRef.current = open;
    if (open) setHidden(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const body = document.body;
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      left: body.style.left,
      overflow: body.style.overflow,
      position: body.style.position,
      right: body.style.right,
      top: body.style.top,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? panelRef.current)?.focus({ preventScroll: true });
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollY);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-50 size-0 lg:hidden",
        hidden && !open ? "invisible" : "visible",
      )}
    >
      <motion.button
        type="button"
        aria-label="Close sidebar overlay"
        tabIndex={open ? 0 : -1}
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={reduce ? REDUCED_TRANSITION : PANEL_TRANSITION}
        onClick={onClose}
        className={cn("fixed inset-0 bg-black/50", open ? "pointer-events-auto" : "pointer-events-none")}
      />
      <motion.aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        aria-hidden={!open}
        inert={!open}
        tabIndex={-1}
        data-state={open ? "expanded" : "collapsed"}
        initial={false}
        animate={{
          opacity: reduce ? (open ? 1 : 0) : 1,
          x: reduce ? 0 : open ? "0%" : "-120%",
        }}
        transition={reduce ? REDUCED_TRANSITION : PANEL_TRANSITION}
        onAnimationComplete={() => {
          if (!openRef.current) setHidden(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
            return;
          }

          if (event.key !== "Tab") return;
          const focusable = panelRef.current
            ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
            : [];

          if (focusable.length === 0) {
            event.preventDefault();
            panelRef.current?.focus();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
        className={cn(
          "pointer-events-auto fixed bottom-1 left-[7vw] top-1 flex w-[88vw] max-w-[360px] flex-col overflow-hidden rounded-[7px] border border-[#302E34] bg-[#232127] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]",
          !open && "pointer-events-none",
        )}
      >
        <SidebarContent onMobileClose={onClose} />
      </motion.aside>
    </div>,
    document.body,
  );
}

/** A reference-accurate, responsive navigation drawer. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  return isMobile ? <MobileSheet open={open} onClose={onClose} /> : <DesktopSidebar />;
}
