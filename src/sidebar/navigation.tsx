"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { PixelSkeleton } from "../PixelSkeleton";
import {
  EASE_OUT,
  LABEL_ENTER_TRANSITION,
  LABEL_EXIT_TRANSITION,
  POWER2_INOUT,
  POWER2_OUT,
  REDUCED_TRANSITION,
  SPRING_LAYOUT,
  SPRING_PRESS,
  SUBMENU_TRANSITION,
} from "@/lib/ease";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  ChevronDown,
  CircleDollarSign,
  Database,
  FileText,
  Headphones,
  House,
  LayoutDashboard,
  LogOut,
  PieChart,
  ReceiptText,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { BottomProfile } from "./profile-menu";
import {
  ActiveRowPill,
  Badge,
  BrandIcon,
  ChevronToggle,
  NavIcon,
  RailDivider,
  RailLabel,
  rowClass,
  tap,
} from "./shared";
import type { NavItem, NavRowProps } from "./types";

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

type SearchResult = {
  label: string;
  section: string;
  Icon: LucideIcon;
};

const SEARCH_RESULTS: SearchResult[] = [
  { section: "Navigation", label: "Go to Repositories", Icon: Database },
  { section: "Navigation", label: "Go to Dashboard", Icon: LayoutDashboard },
  { section: "Settings", label: "Go to Organization Settings", Icon: Building2 },
  { section: "Settings", label: "Go to Billing", Icon: CircleDollarSign },
  { section: "Account", label: "Go to Profile", Icon: UserRound },
  { section: "Account", label: "Logout", Icon: LogOut },
  { section: "Help Center", label: "Go to Documentation", Icon: BookOpen },
  { section: "Help Center", label: "Contact Support", Icon: Headphones },
  { section: "Help Center", label: "Keyboard Shortcuts", Icon: FileText },
  { section: "Help Center", label: "Release Notes", Icon: FileText },
  { section: "Help Center", label: "Status", Icon: ShieldCheck },
  { section: "Help Center", label: "API Reference", Icon: BookOpen },
  { section: "Help Center", label: "Report a Problem", Icon: Headphones },
];

const primaryNavItems: NavItem[] = [
  {
    icon: NavIcon(Search),
    label: "Search",
    labelClassName: "text-[14px] leading-[20px] text-[oklch(0.949_0.0035_305)]",
  },
  { icon: NavIcon(House), label: "Explore" },
  { icon: NavIcon(PieChart), label: "Analytics", expandable: true },
];

const integrationNavItems: NavItem[] = [
  { icon: <BrandIcon brand="slack" />, label: "Slack", badge: "New", expandable: true },
  { icon: <BrandIcon brand="discord" />, label: "Discord", expandable: true },
  { icon: NavIcon(ShieldCheck), label: "Security", badge: "New", expandable: true },
  { icon: NavIcon(ReceiptText), label: "Plan", expandable: true },
];

const accountNavItems: NavItem[] = [
  { icon: NavIcon(Users), label: "Account", expandable: true },
  { icon: NavIcon(BookOpen), label: "Documentation" },
  { icon: NavIcon(Headphones), label: "Contact Support" },
];

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
          className="size-5 shrink-0 rounded-md object-cover"
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
        className={cn(
          "group/btn hidden shrink-0 text-[#AAA6AE] transition-colors hover:text-[#EEEAF0] lg:block",
          // in the rail the toggle belongs to the icon column (reference
          // center 23.5); only the expanded panel pins it to the right edge
          collapsed ? "mr-auto" : "ml-auto",
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="4" y="5" width="2" height="6" rx="1" fill="currentColor" className="transition-[width] duration-300 ease-out [width:2px] group-hover/btn:[width:1px]" />
        </svg>
      </motion.button>
    </header>
  );
}

function CompactSidebarHeader({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <header className="flex h-[38px] shrink-0 items-center px-4">
      <motion.button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        whileTap={tap(reduce)}
        transition={SPRING_PRESS}
        className={cn(
          "group/btn shrink-0 text-[#AAA6AE] transition-colors hover:text-[#EEEAF0]",
          collapsed ? "mr-auto" : "ml-auto",
        )}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <rect x="4" y="5" width="2" height="6" rx="1" fill="currentColor" className="transition-[width] duration-300 ease-out [width:2px] group-hover/btn:[width:1px]" />
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

function SearchPalette({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion() ?? false;

  const groups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = SEARCH_RESULTS.filter((result) => result.label.toLowerCase().includes(normalizedQuery));
    return Array.from(new Set(matches.map((result) => result.section))).map((section) => ({
      section,
      results: matches.filter((result) => result.section === section),
    }));
  }, [query]);

  const results = useMemo(() => groups.flatMap((group) => group.results), [groups]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowDown" && results.length > 0) {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % results.length);
      } else if (event.key === "ArrowUp" && results.length > 0) {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + results.length) % results.length);
      } else if (event.key === "Enter" && results[activeIndex]) {
        event.preventDefault();
        onSelect(results[activeIndex]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, onSelect, open, results]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-backdrop"
          className="fixed inset-0 z-[100] flex items-start justify-center overscroll-contain bg-black/45 px-4 pt-[20vh] backdrop-blur-[3px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.16 } }}
          onMouseDown={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-[520px] overflow-hidden rounded-[8px] border border-[#3a373f] bg-[#232127] shadow-[0_0_0_1px_rgba(255,255,255,0.025),0_24px_80px_rgba(0,0,0,0.6)]"
            initial={reduce ? false : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 items-center gap-3 border-b border-[#322F37] px-3.5">
              <Search size={16} strokeWidth={1.8} className="shrink-0 text-[#8a8791]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Search..."
                aria-label="Search commands"
                className="min-w-0 flex-1 bg-transparent text-[14px] font-normal leading-[20px] text-[oklch(0.949_0.0035_305)] outline-none placeholder:text-[#8a8791]"
              />
            </div>

            <div className="search-palette-scrollbar h-[304px] overscroll-contain overflow-x-hidden overflow-y-auto p-1.5">
              {groups.length > 0 ? (
                groups.map((group) => (
                  <section key={group.section}>
                    <h2 className="px-2 py-2 text-[12px] font-normal leading-[16px] text-[oklch(0.585_0.0161_305)]">{group.section}</h2>
                    {group.results.map((result) => {
                      const index = results.indexOf(result);
                      const active = index === activeIndex;
                      return (
                        <button
                          type="button"
                          key={result.label}
                          onClick={() => onSelect(result)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex h-8 w-full items-center gap-3 rounded-[5px] px-2.5 text-left text-[14px] font-normal leading-[20px] text-[oklch(0.949_0.0035_305)] transition-colors",
                            active ? "bg-[#302e34]" : "hover:bg-[#2b2930]",
                          )}
                        >
                          <result.Icon size={15} strokeWidth={1.8} className="shrink-0 text-[#aaa6ae]" aria-hidden="true" />
                          <span className="truncate">{result.label}</span>
                        </button>
                      );
                    })}
                  </section>
                ))
              ) : (
                <p className="px-2.5 py-8 text-center text-[13px] text-[#8a8791]">No results found.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Everything inside the panel, shared by the desktop rail and mobile sheet. */
export function SidebarContent({
  onMobileClose,
  collapsed = false,
  showHeader = true,
  onToggleCollapse,
}: {
  onMobileClose?: () => void;
  collapsed?: boolean;
  showHeader?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [reviewOpen, setReviewOpen] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const pillId = useId();
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    const openSearch = () => setSearchOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("open-command-palette", openSearch);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("open-command-palette", openSearch);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Selecting from the collapsed rail unfolds the panel first (beui: a
  // submenu cannot live in the rail, so selecting expands it).
  const select = (label: string) => {
    setActive(label);
    if (collapsed) onToggleCollapse?.();
  };

  const renderNavItem = (item: NavItem) => (
    <NavRow
      key={item.label}
      {...item}
      isActive={active === item.label}
      layoutId={pillId}
      onSelect={() => {
        if (item.label === "Search") setSearchOpen(true);
        else select(item.label);
      }}
      collapsed={collapsed}
    />
  );

  return (
    <>
      {showHeader ? (
        <Header onClose={onMobileClose} collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      ) : (
        <CompactSidebarHeader collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      )}
      <motion.nav
        className="sidebar-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-1"
        aria-label="Sidebar links"
        variants={NAV_VARIANTS}
        initial={reduce ? false : "hidden"}
        animate="visible"
      >
        {primaryNavItems.map(renderNavItem)}
        <RailDivider collapsed={collapsed} />
        <ReviewSection
          open={reviewOpen}
          onToggle={() => setReviewOpen((value) => !value)}
          isActive={active === "Review"}
          layoutId={pillId}
          onActivate={() => select("Review")}
          collapsed={collapsed}
        />
        {integrationNavItems.map(renderNavItem)}
        <RailDivider collapsed={collapsed} />
        {accountNavItems.map(renderNavItem)}
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
              className="relative z-10 inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full border border-[#322F37] bg-[#121014] px-[10px] text-[12px] font-medium leading-[16px] text-[oklch(0.949_0.0035_305)] transition-colors hover:border-[#4a4650] hover:bg-[#121014]"
            >
              <ChevronDown size={12} strokeWidth={2} className="shrink-0" />
              View more
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomProfile collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      <SearchPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={(result) => {
          setSearchOpen(false);
          if (result.label.startsWith("Go to ")) select(result.label.slice(6));
        }}
      />
    </>
  );
}
