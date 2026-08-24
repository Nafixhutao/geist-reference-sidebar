export type ProjectStatus = "active" | "paused";

export type Project = {
  id: string;
  name: string;
  provider: string;
  region: string;
  plan: string;
  status: ProjectStatus;
};

export type ProjectView = "grid" | "list";
export type ProjectSort = "name-asc" | "name-desc";
