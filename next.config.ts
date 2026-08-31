import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Vite app ran without StrictMode; keep identical effect behavior
  reactStrictMode: false,
  // Dev server is reached through a Cloudflare quick tunnel whose random
  // *.trycloudflare.com host would otherwise be blocked from /_next assets.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
