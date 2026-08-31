import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode stays off so effects keep their single-run behavior; the app
  // relies on effect timing (canvas persistence, simulated deployment timers).
  reactStrictMode: false,
  // Dev server is reached through a Cloudflare quick tunnel whose random
  // *.trycloudflare.com host would otherwise be blocked from /_next assets.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
