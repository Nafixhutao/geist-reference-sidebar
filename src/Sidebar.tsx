import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import {
  BookOpen,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  Headphones,
  House,
  PieChart,
  ReceiptText,
  Search,
  ShieldCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

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
};

const NavIcon = (Icon: LucideIcon) => (
  <Icon size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
);

const rowClass =
  "flex h-[34px] w-full items-center gap-[10px] px-4 text-left text-[13px] font-normal text-[#C5C1C9] transition-colors hover:bg-white/[0.035] lg:h-[38px] lg:text-[14px]";

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

function ChevronToggle({ className = "", gap = 0.6 }: { className?: string; gap?: number }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        transform={`translate(0 ${-gap})`}
        d="M10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        transform={`translate(0 ${gap})`}
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
          d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
        />
      </svg>
    </span>
  );
}

function NavRow({ icon, label, badge, expandable = false, labelClassName = "" }: NavRowProps) {
  return (
    <button type="button" className={rowClass}>
      {icon}
      <span className={`flex-1 origin-left truncate ${labelClassName}`}>{label}</span>
      {badge && <Badge kind={badge} />}
      {expandable && <ChevronToggle className="ml-auto size-[13px] shrink-0 text-[#737078]" />}
    </button>
  );
}

function Header({ onClose }: Pick<SidebarProps, "onClose">) {
  return (
    <header className="flex h-[44px] shrink-0 items-center px-4 lg:h-[48px]">
      <img alt="Nafixhutao avatar" className="shrink-0 object-cover size-5 rounded-md" src="https://avatars.githubusercontent.com/u/135522402?s=80&v=4" />
      <span className="ml-2 text-[14px] font-medium tracking-[-0.01em] leading-[20px] text-[oklch(0.949_0.0035_305)]">Nafixhutao</span>
      <span className="ml-2 rounded-[5px] bg-[#201E22] px-[6px] py-[2px] text-[12px] font-medium leading-[16px] text-[oklch(0.767_0.0105_305)]">Pro Plus</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="ml-2 size-[13px] shrink-0 text-[#737078]" aria-hidden="true">
        <path d="m7 8 5-5 5 5" />
        <path d="m7 16 5 5 5-5" />
      </svg>
      <button
        type="button"
        onClick={onClose}
        className="ml-auto inline-flex h-6 w-6 items-center justify-center text-[#AAA6AE] hover:text-[#EEEAF0] lg:hidden"
        aria-label="Close sidebar"
      >
        <X size={14} strokeWidth={1.8} />
      </button>
      <span className="group/btn ml-auto hidden shrink-0 text-[#AAA6AE] lg:block">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
          <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="5" height="6" rx="0.75" fill="currentColor" className="transition-[width] duration-300 ease-cui-out-expo [width:4px] group-hover/btn:[width:2.5px]" />
        </svg>
      </span>
    </header>
  );
}

function ReviewSection({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const submenuRef = useRef<HTMLDivElement>(null);
  const submenu = ["Triage", "Repositories", "Integrations", "Learnings", "Caches", "Organization Settings"];

  useEffect(() => {
    const el = submenuRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const reduce = !!ctx.conditions?.reduce;
      gsap.to(el, {
        height: open ? "auto" : 0,
        autoAlpha: open ? 1 : 0,
        duration: reduce ? 0 : 0.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      if (open) {
        gsap.fromTo(
          el.querySelectorAll(":scope > button"),
          { y: 4, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: reduce ? 0 : 0.25, stagger: reduce ? 0 : 0.03, delay: reduce ? 0 : 0.05, ease: "power2.out", overwrite: "auto" },
        );
      }
    });
    return () => mm.revert();
  }, [open]);

  return (
    <section>
      <button
        type="button"
        className={rowClass}
        onClick={onToggle}
        aria-expanded={open}
      >
        <FileText size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
        <span>Review</span>
        <ChevronToggle className="ml-auto size-[13px] shrink-0 text-[#737078]" />
      </button>
      <div ref={submenuRef} className="ml-[22px] overflow-hidden border-l border-[#3A373F] pl-[20px]">
        {submenu.map((item) => (
          <button
            type="button"
            key={item}
            className="flex h-[30px] w-full items-center text-left text-[12px] font-normal text-[#C5C1C9] hover:text-[#EEEAF0] lg:h-[34px] lg:text-[14px]"
          >
            <span>{item}</span>
            {item === "Triage" && <Badge kind="Beta" />}
          </button>
        ))}
      </div>
    </section>
  );
}

function BottomProfile() {
  return (
    <footer className="flex shrink-0 items-center px-[14px] py-[10px]">
      <img alt="NN" className="shrink-0 object-cover size-8 rounded-full" src="https://avatars.githubusercontent.com/u/135522402?v=4" />
      <div className="ml-2 min-w-0 leading-tight">
        <p className="m-0 truncate text-[14px] leading-[20px] text-[oklch(0.767_0.0105_305)]">Nafixhutao</p>
        <p className="m-0 mt-[2px] text-[12px] leading-[16px] text-[oklch(0.585_0.0161_305)]">Admin</p>
      </div>
      <ChevronsUpDown size={12} strokeWidth={1.7} className="ml-auto shrink-0 text-[#737078]" aria-hidden="true" />
    </footer>
  );
}

/** A reference-accurate, responsive navigation drawer. */
export function Sidebar({ open, onClose }: SidebarProps) {
  const [reviewOpen, setReviewOpen] = useState(true);
  const asideRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);

  // Entrance: top-level nav rows stagger in once.
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    const mm = gsap.matchMedia();
    mm.add({ reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const reduce = !!ctx.conditions?.reduce;
      gsap.from(aside.querySelectorAll("nav > button"), {
        y: 8,
        autoAlpha: 0,
        duration: reduce ? 0 : 0.35,
        stagger: reduce ? 0 : 0.04,
        ease: "power2.out",
        clearProps: "all",
      });
    });
    return () => mm.revert();
  }, []);

  // Mobile drawer slide + overlay fade.
  useEffect(() => {
    const aside = asideRef.current;
    const overlay = overlayRef.current;
    if (!aside || !overlay) return;
    const mm = gsap.matchMedia();
    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, isMobile } = ctx.conditions ?? {};
        const reduce = !!ctx.conditions?.reduce;
        const duration = reduce ? 0 : 0.35;
        if (isDesktop) {
          gsap.set(aside, { xPercent: 0 });
        } else if (isMobile) {
          gsap.to(aside, { xPercent: open ? 0 : -120, duration, ease: "power3.out", overwrite: "auto" });
        }
        gsap.to(overlay, { autoAlpha: open ? 1 : 0, duration });
      },
    );
    return () => mm.revert();
  }, [open]);

  return (
    <>
      <button
        ref={overlayRef}
        type="button"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        aria-label="Close sidebar overlay"
        tabIndex={open ? 0 : -1}
      />
      <aside
        ref={asideRef}
        aria-label="Main navigation"
        className="fixed bottom-1 left-[7vw] top-1 z-50 flex w-[88vw] max-w-[360px] flex-col overflow-hidden rounded-[7px] border border-[#302E34] bg-[#232127] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)] lg:bottom-auto lg:left-0 lg:top-0 lg:h-dvh lg:w-[268px] lg:min-w-[268px] lg:max-w-[268px] lg:rounded-none lg:border-0 lg:border-r lg:border-[#322F37] lg:bg-[#121014] lg:shadow-none"
      >
        <Header onClose={onClose} />
        <nav className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pb-1" aria-label="Sidebar links">
          <NavRow
            icon={NavIcon(Search)}
            label="Search"
            labelClassName="text-[14px] leading-[20px] text-[oklch(0.949_0.0035_305)]"
          />
          <NavRow icon={NavIcon(House)} label="Explore" />
          <NavRow icon={NavIcon(PieChart)} label="Analytics" expandable />
          <ReviewSection open={reviewOpen} onToggle={() => setReviewOpen((value) => !value)} />
          <NavRow icon={<BrandIcon brand="slack" />} label="Slack" badge="New" expandable />
          <NavRow icon={<BrandIcon brand="discord" />} label="Discord" expandable />
          <NavRow icon={NavIcon(ShieldCheck)} label="Security" badge="New" expandable />
          <NavRow icon={NavIcon(ReceiptText)} label="Plan" expandable />
          <NavRow icon={NavIcon(Users)} label="Account" expandable />
          <NavRow icon={NavIcon(BookOpen)} label="Documentation" />
          <NavRow icon={NavIcon(Headphones)} label="Contact Support" />
        </nav>
        {reviewOpen && (
          <div className="relative flex shrink-0 items-center justify-center px-2 py-3">
            <div className="absolute inset-x-2 h-px bg-[#322F37]" />
            <button
              type="button"
              className="relative z-10 inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full border border-[#322F37] bg-[#121014] px-[10px] text-[12px] font-medium leading-[16px] text-[oklch(0.949_0.0035_305)] hover:bg-white/[0.04]"
            >
              <ChevronDown size={12} strokeWidth={2} className="shrink-0" />
              View more
            </button>
          </div>
        )}
        <BottomProfile />
      </aside>
    </>
  );
}
