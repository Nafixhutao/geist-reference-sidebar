import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist";
import "@fontsource-variable/source-code-pro";
import "../styles/global.css";

export const metadata: Metadata = {
  title: {
    default: "Stealth Console",
    template: "%s · Stealth",
  },
  description:
    "Stealth Console — deploy, monitor, and manage your services on the Stealth developer cloud.",
  applicationName: "Stealth",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* browser extensions (e.g. AI sidebars) inject attributes like
          cz-shortcut-listen into <body> before hydration — ignore them */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
