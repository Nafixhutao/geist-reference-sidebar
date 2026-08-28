import { projects } from "./data";
import type { Project } from "./types";

const STORAGE_KEY = "projects-list-v1";

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return projects;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return projects;
    const stored = JSON.parse(raw) as Project[];
    if (!Array.isArray(stored) || !stored.every((item) => item && typeof item.id === "string" && typeof item.name === "string")) {
      return projects;
    }
    return [...projects, ...stored.filter((item) => !projects.some((seed) => seed.id === item.id))];
  } catch {
    return projects;
  }
}

export function saveProjects(list: Project[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // penyimpanan penuh atau tidak tersedia — biarkan daftar tetap di memori
  }
}

export type NewProjectInput = {
  name: string;
  provider: string;
  region: string;
  environment: string;
  plan: string;
  status: Project["status"];
};

export function buildProject(input: NewProjectInput, existingIds: string[]): Project {
  const base = input.name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");
  let id = base || "project";
  let suffix = 2;
  while (existingIds.includes(id)) {
    id = `${base || "project"}_${suffix}`;
    suffix += 1;
  }

  return {
    id,
    name: input.name.trim(),
    provider: input.provider,
    region: input.region,
    regionCountry: input.region === "ap-southeast-3" ? "indonesia" : "singapore",
    environment: input.environment,
    plan: input.plan,
    status: input.status,
    createdAt: new Date().toISOString(),
  };
}
