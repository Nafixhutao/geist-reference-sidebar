export type ProjectStatus = "active" | "paused";
export type RegionCountry = "singapore" | "indonesia";

export type Project = {
  id: string;
  name: string;
  description?: string;
  provider: string;
  region: string;
  regionCountry: RegionCountry;
  environment: string;
  plan: string;
  status: ProjectStatus;
  createdAt: string;
};

export type ProjectView = "grid" | "list";
export type ProjectSort = "name-asc" | "name-desc";
