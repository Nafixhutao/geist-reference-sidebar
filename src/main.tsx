import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import "@fontsource-variable/geist";
import "./index.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-dvh bg-[#1A181D]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-h-dvh lg:pl-[268px]">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="m-4 inline-flex items-center gap-2 rounded-md border border-[#38343d] bg-[#232127] px-3 py-2 text-sm text-[#C5C1C9] hover:bg-white/[0.04] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={16} />
          Menu
        </button>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
