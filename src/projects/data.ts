import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "app_ig",
    name: "app_ig",
    provider: "AWS",
    region: "ap-southeast-1",
    status: "paused",
  },
];

export const usageRows = [
  { label: "EGRESS", value: "0 GB", limit: "5 GB" },
  { label: "DATABASE SIZE", value: "0 GB", limit: "500 MB" },
  { label: "MONTHLY ACTIVE USERS", value: "0", limit: "50,000" },
  { label: "FILE STORAGE", value: "0 GB", limit: "1 GB" },
] as const;
