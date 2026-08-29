export type DeploymentSourceId =
  | "github"
  | "upload"
  | "docker"
  | "template"
  | "postgresql"
  | "mysql"
  | "redis";

export type DeploymentFramework = "auto" | "laravel" | "php" | "node" | "react" | "static-html";

export type DeploymentConfig = {
  branch: string;
  framework: DeploymentFramework;
  rootDirectory: string;
  buildCommand: string;
  startCommand: string;
  port: string;
  envVariables: Array<{ id: string; key: string; value: string }>;
  autoDeploy: boolean;
};

export type DeploymentStatus = "Queued" | "Building" | "Deploying" | "Live" | "Failed";
export type PreDeployStep = "source" | "configure" | "deploy";

export type SourceDefinition = {
  id: DeploymentSourceId;
  label: string;
  description: string;
  summary: string;
  icon?: string;
  iconType?: "upload" | "template" | "database";
  recommended?: boolean;
};

export const SOURCE_DEFINITIONS: SourceDefinition[] = [
  {
    id: "github",
    label: "Connect GitHub",
    description: "Deploy from a repository",
    summary: "GitHub repository",
    icon: "/icons/github.svg",
    recommended: true,
  },
  {
    id: "upload",
    label: "Upload project",
    description: "Upload a project archive",
    summary: "Uploaded project",
    iconType: "upload",
  },
  {
    id: "docker",
    label: "Use Docker image",
    description: "Deploy any container image",
    summary: "Docker image",
    icon: "/icons/docker.svg",
  },
  {
    id: "template",
    label: "Browse templates",
    description: "Start with a production-ready template",
    summary: "Project template",
    iconType: "template",
  },
  {
    id: "postgresql",
    label: "PostgreSQL",
    description: "Managed relational database",
    summary: "PostgreSQL database",
    icon: "/icons/postgresql.svg",
    iconType: "database",
  },
  {
    id: "mysql",
    label: "MySQL",
    description: "Managed relational database",
    summary: "MySQL database",
    icon: "/icons/mysql.svg",
    iconType: "database",
  },
  {
    id: "redis",
    label: "Redis",
    description: "Managed in-memory data store",
    summary: "Redis cache",
    icon: "/icons/redis.svg",
    iconType: "database",
  },
];

export const RUNTIME_BADGES: Array<{ label: string; icon?: string; iconType?: "html" }> = [
  { label: "Laravel", icon: "/icons/laravel.svg" },
  { label: "PHP", icon: "/icons/php.svg" },
  { label: "Node.js", icon: "/icons/nodejs.svg" },
  { label: "React", icon: "/icons/react.svg" },
  { label: "Static HTML", iconType: "html" },
];

export const DEPLOY_STEPS: Array<{ id: PreDeployStep; number: number; label: string }> = [
  { id: "source", number: 1, label: "Source" },
  { id: "configure", number: 2, label: "Configure" },
  { id: "deploy", number: 3, label: "Deploy" },
];

export const STATUS_ORDER: DeploymentStatus[] = ["Queued", "Building", "Deploying", "Live"];

export const FRAMEWORK_LABELS: Record<DeploymentFramework, string> = {
  auto: "Auto detect",
  laravel: "Laravel",
  php: "PHP",
  node: "Node.js",
  react: "React",
  "static-html": "Static HTML",
};

export const STATUS_PROGRESS: Record<DeploymentStatus, number> = {
  Queued: 12,
  Building: 42,
  Deploying: 76,
  Live: 100,
  Failed: 64,
};

export function getSourceDefinition(source: DeploymentSourceId | null) {
  return SOURCE_DEFINITIONS.find((item) => item.id === source) ?? null;
}
