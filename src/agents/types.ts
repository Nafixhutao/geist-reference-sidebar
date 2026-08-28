import type { RegionCountry } from "../projects/types";

export type AgentStatus = "active" | "idle";

export type Agent = {
  id: string;
  name: string;
  description: string;
  model: string;
  status: AgentStatus;
  region: string;
  regionCountry: RegionCountry;
  requests24h: number;
  latencyMs: number;
  tokens24h: number;
};
