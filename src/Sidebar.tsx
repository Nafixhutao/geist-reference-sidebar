import { useState, type CSSProperties } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
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
  icon: LucideIcon;
  label: string;
  badge?: BadgeKind;
  expandable?: boolean;
  labelClassName?: string;
  labelStyle?: CSSProperties;
};

const rowClass =
  "flex h-[34px] w-full items-center gap-[10px] px-4 text-left text-[13px] font-normal text-[#C5C1C9] transition-colors hover:bg-white/[0.035] lg:h-[38px] lg:text-[14px]";

function Badge({ kind }: { kind: BadgeKind }) {
  return kind === "New" ? (
    <span className="ml-auto rounded-[6px] bg-[#331E0B] px-[7px] py-[2px] text-[12px] font-medium leading-[16px] text-[rgb(255,160,87)]" style={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 500 }}>
      New
    </span>
  ) : (
    <span className="ml-auto mr-2 rounded-[5px] bg-[#201E22] px-[6px] py-[2px] text-[10px] font-medium leading-none text-[#C9C5CD]">
      Beta
    </span>
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
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] shrink-0 fill-current text-[#AAA6AE] lg:h-[15px] lg:w-[15px]"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

function NavRow({ icon: Icon, label, badge, expandable = false, labelClassName = "", labelStyle }: NavRowProps) {
  return (
    <button type="button" className={rowClass}>
      <Icon size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
      <span className={`flex-1 origin-left truncate ${labelClassName}`} style={labelStyle}>{label}</span>
      {badge && <Badge kind={badge} />}
      {expandable && <ChevronDown size={13} strokeWidth={1.8} className="ml-auto shrink-0 text-[#737078]" />}
    </button>
  );
}

function BrandNavRow({ brand, label, badge }: { brand: "slack" | "discord"; label: string; badge?: BadgeKind }) {
  return (
    <button type="button" className={rowClass}>
      <BrandIcon brand={brand} />
      <span className="flex-1 origin-left truncate">{label}</span>
      {badge && <Badge kind={badge} />}
      <ChevronDown size={13} strokeWidth={1.8} className="ml-auto shrink-0 text-[#737078]" />
    </button>
  );
}

function Header({ onClose }: Pick<SidebarProps, "onClose">) {
  return (
    <header className="flex h-[44px] shrink-0 items-center px-4 lg:h-[48px]">
      <img alt="Nafixhutao avatar" className="shrink-0 object-cover size-5 rounded-md" src="https://avatars.githubusercontent.com/u/135522402?s=80&v=4" />
      <span className="ml-2 text-[14px] font-medium tracking-[-0.01em] leading-[20px] text-[oklch(0.949_0.0035_305)]" style={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 500 }}>Nafixhutao</span>
      <span className="ml-2 rounded-[5px] bg-[#201E22] px-[6px] py-[2px] text-[12px] font-medium leading-[16px] text-[oklch(0.767_0.0105_305)]" style={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 500 }}>Pro Plus</span>
      <ChevronsUpDown size={12} strokeWidth={1.7} className="ml-2 shrink-0 text-[#737078]" />
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

function ReviewSection() {
  const [reviewOpen, setReviewOpen] = useState(true);
  const submenu = ["Triage", "Repositories", "Integrations", "Learnings", "Caches", "Organization Settings"];

  return (
    <section>
      <button
        type="button"
        className={rowClass}
        onClick={() => setReviewOpen((value) => !value)}
        aria-expanded={reviewOpen}
      >
        <FileText size={15} strokeWidth={1.8} className="shrink-0 text-[#AAA6AE]" />
        <span>Review</span>
        {reviewOpen ? (
          <ChevronUp size={13} strokeWidth={1.8} className="ml-auto shrink-0 text-[#737078]" />
        ) : (
          <ChevronDown size={13} strokeWidth={1.8} className="ml-auto shrink-0 text-[#737078]" />
        )}
      </button>
      {reviewOpen && (
        <div className="ml-[22px] border-l border-[#3A373F] py-[1px] pl-[20px]">
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
      )}
    </section>
  );
}

function BottomProfile() {
  return (
    <footer className="flex shrink-0 items-center px-[14px] py-[10px]">
      <img alt="NN" className="shrink-0 object-cover size-8 rounded-full" src="https://avatars.githubusercontent.com/u/135522402?v=4" />
      <div className="ml-2 min-w-0 leading-tight">
        <p className="m-0 truncate text-[14px] leading-[20px] text-[oklch(0.767_0.0105_305)]" style={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 400 }}>Nafixhutao</p>
        <p className="m-0 mt-[2px] text-[12px] leading-[16px] text-[oklch(0.585_0.0161_305)]" style={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 400 }}>Admin</p>
      </div>
      <ChevronsUpDown size={12} strokeWidth={1.7} className="ml-auto shrink-0 text-[#737078]" aria-hidden="true" />
    </footer>
  );
}

/** A reference-accurate, responsive navigation drawer. */
export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <button
        type="button"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-label="Close sidebar overlay"
        tabIndex={open ? 0 : -1}
      />
      <aside
        aria-label="Main navigation"
        className={`fixed bottom-1 left-[7vw] top-1 z-50 flex w-[88vw] max-w-[360px] flex-col overflow-hidden rounded-[7px] border border-[#302E34] bg-[#232127] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)] transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-[120%]"
        } lg:bottom-auto lg:left-0 lg:top-0 lg:h-dvh lg:w-[268px] lg:min-w-[268px] lg:max-w-[268px] lg:translate-x-0 lg:rounded-none lg:border-0 lg:border-r lg:border-[#322F37] lg:bg-[#121014] lg:shadow-none`}
      >
        <Header onClose={onClose} />
        <nav className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto pb-1" aria-label="Sidebar links">
          <NavRow
            icon={Search}
            label="Search"
            labelClassName="text-[14px] leading-[20px] text-[oklch(0.949_0.0035_305)]"
            labelStyle={{ fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', fontStyle: "normal", fontWeight: 400 }}
          />
          <NavRow icon={House} label="Explore" />
          <NavRow icon={PieChart} label="Analytics" expandable />
          <div className="mx-2 my-1 h-px bg-[#322F37]" />
          <ReviewSection />
          <BrandNavRow brand="slack" label="Slack" badge="New" />
          <BrandNavRow brand="discord" label="Discord" />
          <NavRow icon={ShieldCheck} label="Security" badge="New" expandable />
          <NavRow icon={ReceiptText} label="Plan" expandable />
          <div className="mx-2 my-1 h-px bg-[#322F37]" />
          <NavRow icon={Users} label="Account" expandable />
          <NavRow icon={BookOpen} label="Documentation" />
          <NavRow icon={Headphones} label="Contact Support" />
        </nav>
        <BottomProfile />
      </aside>
    </>
  );
}
