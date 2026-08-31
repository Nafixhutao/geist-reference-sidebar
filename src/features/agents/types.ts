export type AgentRole = "General" | "Frontend" | "Reviewer" | "Documentation";
export type AgentStatus = "active" | "running" | "idle";
export type AgentTool =
  | "Read files"
  | "Search code"
  | "Edit files"
  | "Terminal"
  | "Run tests"
  | "Git diff";

/** A coding agent: what it is, where it works, and what it is allowed to do. */
export interface Agent {
  id: string;
  name: string;
  description: string;
  role: AgentRole;
  status: AgentStatus;
  project: string;
  branch: string;
  provider: string;
  model: string;
  /** Task currently being worked on, if any. */
  currentTask?: string;
  /** Minutes since the last activity — drives "2m ago" labels and recency sort. */
  lastActiveMinutes: number;
  tools: AgentTool[];
  instructions?: string;
  createdAt: string;
}

export type AgentStepType = "read" | "edit" | "search" | "command" | "check";
export type AgentStepStatus = "pending" | "done";

export interface AgentStep {
  id: string;
  type: AgentStepType;
  label: string;
  target: string;
  status: AgentStepStatus;
}

export interface FileChange {
  path: string;
  additions: number;
  deletions: number;
  status: "modified" | "added";
}

export type AgentRunStatus = "running" | "completed";

export interface AgentRun {
  id: string;
  prompt: string;
  status: AgentRunStatus;
  steps: AgentStep[];
  changes?: FileChange[];
}

export type WorkspaceTab = "chat" | "tasks" | "changes" | "activity" | "settings";

export type WorkspaceMessage =
  | { id: string; role: "user"; text: string; time: string }
  | {
      id: string;
      role: "agent";
      text: string;
      time: string;
      status: AgentRunStatus;
      steps: AgentStep[];
      changes?: FileChange[];
    };
