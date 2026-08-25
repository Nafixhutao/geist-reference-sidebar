import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "app_ig",
    name: "app_ig",
    provider: "AWS",
    region: "ap-southeast-1",
    plan: "NANO",
    status: "paused",
  },
];

export const usageRows = [
  { label: "Egress", value: "0 GB", limit: "5 GB", percent: 0 },
  { label: "Database size", value: "27 MB", limit: "500 MB", percent: 5.4 },
  { label: "Monthly active users", value: "0", limit: "50,000", percent: 0 },
  { label: "File storage", value: "0 MB", limit: "1 GB", percent: 0 },
] as const;
