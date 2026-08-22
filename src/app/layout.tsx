import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist";
import "../index.css";

export const metadata: Metadata = {
  title: "Nafixhutao Sidebar",
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
