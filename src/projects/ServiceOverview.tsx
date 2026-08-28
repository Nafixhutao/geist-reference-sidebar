"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  Activity,
  AlertCircle,
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CloudUpload,
  Code2,
  Container,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  HardDrive,
  KeyRound,
  Layers3,
  LayoutTemplate,
  LoaderCircle,
  Maximize2,
  MemoryStick,
  MoreVertical,
  MousePointer2,
  Package,
  PanelRight,
  Pause,
  Play,
  Plus,
  RefreshCcw,
  Rocket,
  Search,
  Server,
  Settings,
  SquareTerminal,
  StopCircle,
  Terminal,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { RegionFlag } from "./RegionFlag";
import type { Project } from "./types";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 620;
const NODE_WIDTH = 250;
const NODE_HEIGHT = 154;
const SERVICE_STORAGE_KEY = "app-ig-service-canvas-v1";

type ServiceStatus = "building" | "live" | "failed" | "stopped" | "available";
type ServiceKind = "laravel" | "node" | "react" | "docker" | "postgresql" | "mysql" | "redis";

type ServiceNode = {
  id: string;
  name: string;
  kind: ServiceKind;
  runtime: string;
  status: ServiceStatus;
  endpoint: string;
  cpu: string;
  ram: string;
  branch?: string;
  connections: string[];
  position: { x: number; y: number };
};

type ServiceChoice = {
  id: string;
  label: string;
  description: string;
  kind: ServiceKind;
  icon: string;
  source?: boolean;
};

const SERVICE_CHOICES: ServiceChoice[] = [
  { id: "github", label: "GitHub Repo", description: "Connect a repository", kind: "laravel", icon: "/icons/github.svg", source: true },
  { id: "upload", label: "Upload Source", description: "Deploy a local project", kind: "laravel", icon: "/icons/php.svg", source: true },
  { id: "docker", label: "Docker Image", description: "Run a container image", kind: "docker", icon: "/icons/docker.svg", source: true },
  { id: "template", label: "Template", description: "Start from a starter kit", kind: "react", icon: "/icons/react.svg", source: true },
  { id: "postgresql", label: "PostgreSQL", description: "Managed relational database", kind: "postgresql", icon: "/icons/postgresql.svg" },
  { id: "mysql", label: "MySQL", description: "Managed relational database", kind: "mysql", icon: "/icons/mysql.svg" },
  { id: "redis", label: "Redis", description: "Managed in-memory store", kind: "redis", icon: "/icons/redis.svg" },
];

const DEFAULT_SERVICES: ServiceNode[] = [
  {
    id: "laravel-web",
    name: "Laravel Web",
    kind: "laravel",
    runtime: "PHP 8.3",
    status: "live",
    endpoint: "Port 8080",
    cpu: "0.5 vCPU",
    ram: "512 MB",
    branch: "main",
    connections: [],
    position: { x: 120, y: 224 },
  },
  {
    id: "queue-worker",
    name: "Queue Worker",
    kind: "node",
    runtime: "Node.js 20",
    status: "live",
    endpoint: "Worker process",
    cpu: "0.25 vCPU",
    ram: "256 MB",
    connections: ["laravel-web"],
    position: { x: 474, y: 86 },
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    kind: "postgresql",
    runtime: "PostgreSQL 16",
    status: "available",
    endpoint: "Port 5432",
    cpu: "0.25 vCPU",
    ram: "512 MB",
    connections: ["laravel-web"],
    position: { x: 474, y: 360 },
  },
  {
    id: "redis",
    name: "Redis",
    kind: "redis",
    runtime: "Redis 7",
    status: "available",
    endpoint: "Port 6379",
    cpu: "0.25 vCPU",
    ram: "128 MB",
    connections: ["laravel-web", "queue-worker"],
    position: { x: 800, y: 224 },
  },
];

const tabs = [
  { label: "Overview", Icon: Activity },
  { label: "Deployments", Icon: Box },
  { label: "Logs", Icon: FileText },
  { label: "Variables", Icon: Code2 },
  { label: "Domains", Icon: Globe2 },
  { label: "Settings", Icon: Settings },
] as const;

type TabLabel = (typeof tabs)[number]["label"];

function cloneDefaultServices() {
  return DEFAULT_SERVICES.map((service) => ({
    ...service,
    position: { ...service.position },
    connections: [...service.connections],
  }));
}

function isServiceKind(value: unknown): value is ServiceKind {
  return ["laravel", "node", "react", "docker", "postgresql", "mysql", "redis"].includes(value as ServiceKind);
}

function isServiceStatus(value: unknown): value is ServiceStatus {
  return ["building", "live", "failed", "stopped", "available"].includes(value as ServiceStatus);
}

function parseStoredServices(raw: string | null): ServiceNode[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return null;

    const parsed = value.filter((item): item is ServiceNode => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<ServiceNode>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.name === "string" &&
        isServiceKind(candidate.kind) &&
        typeof candidate.runtime === "string" &&
        isServiceStatus(candidate.status) &&
        typeof candidate.endpoint === "string" &&
        typeof candidate.cpu === "string" &&
        typeof candidate.ram === "string" &&
        Array.isArray(candidate.connections) &&
        candidate.connections.every((connection) => typeof connection === "string") &&
        candidate.position !== undefined &&
        typeof candidate.position === "object" &&
        typeof candidate.position.x === "number" &&
        typeof candidate.position.y === "number"
      );
    });

    return parsed.map((service) => ({
      ...service,
      position: { x: service.position.x, y: service.position.y },
      connections: [...service.connections],
    }));
  } catch {
    return null;
  }
}

function serviceIcon(kind: ServiceKind) {
  const iconByKind: Record<ServiceKind, string> = {
    laravel: "/icons/laravel.svg",
    node: "/icons/nodejs.svg",
    react: "/icons/react.svg",
    docker: "/icons/docker.svg",
    postgresql: "/icons/postgresql.svg",
    mysql: "/icons/mysql.svg",
    redis: "/icons/redis.svg",
  };
  return iconByKind[kind];
}

function serviceKindLabel(kind: ServiceKind) {
  const labels: Record<ServiceKind, string> = {
    laravel: "Web service",
    node: "Worker service",
    react: "Web service",
    docker: "Container",
    postgresql: "Database",
    mysql: "Database",
    redis: "Cache",
  };
  return labels[kind];
}

function statusLabel(status: ServiceStatus) {
  const labels: Record<ServiceStatus, string> = {
    building: "Building",
    live: "Live",
    failed: "Failed",
    stopped: "Stopped",
    available: "Available",
  };
  return labels[status];
}

function isDatabase(service: ServiceNode) {
  return service.kind === "postgresql" || service.kind === "mysql" || service.kind === "redis";
}

function TechnologyLogo({ kind, src, size = "md" }: { kind?: ServiceKind; src?: string; size?: "sm" | "md" | "lg" }) {
  const iconSource = src ?? (kind ? serviceIcon(kind) : undefined);
  if (!iconSource) return null;

  return (
    <span className={`technology-logo technology-logo--${size}`}>
      <img src={iconSource} alt="" aria-hidden="true" />
    </span>
  );
}

function StatusPill({ status, compact = false }: { status: ServiceStatus; compact?: boolean }) {
  return (
    <span className={`service-status service-status--${status} ${compact ? "service-status--compact" : ""}`}>
      <span className="service-status__dot" aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

function getConnectorAnchors(from: ServiceNode, to: ServiceNode) {
  const fromCenter = { x: from.position.x + NODE_WIDTH / 2, y: from.position.y + NODE_HEIGHT / 2 };
  const toCenter = { x: to.position.x + NODE_WIDTH / 2, y: to.position.y + NODE_HEIGHT / 2 };
  const deltaX = toCenter.x - fromCenter.x;
  const deltaY = toCenter.y - fromCenter.y;

  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    const points = deltaX >= 0
      ? { start: { x: from.position.x + NODE_WIDTH, y: fromCenter.y }, end: { x: to.position.x, y: toCenter.y } }
      : { start: { x: from.position.x, y: fromCenter.y }, end: { x: to.position.x + NODE_WIDTH, y: toCenter.y } };
    return points;
  }

  const points = deltaY >= 0
    ? { start: { x: fromCenter.x, y: from.position.y + NODE_HEIGHT }, end: { x: toCenter.x, y: to.position.y } }
    : { start: { x: fromCenter.x, y: from.position.y }, end: { x: toCenter.x, y: to.position.y + NODE_HEIGHT } };
  return points;
}

function connectorPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const horizontal = Math.abs(end.x - start.x) >= Math.abs(end.y - start.y);
  if (horizontal) {
    const controlX = start.x + (end.x - start.x) / 2;
    return `M ${start.x} ${start.y} C ${controlX} ${start.y}, ${controlX} ${end.y}, ${end.x} ${end.y}`;
  }

  const controlY = start.y + (end.y - start.y) / 2;
  return `M ${start.x} ${start.y} C ${start.x} ${controlY}, ${end.x} ${controlY}, ${end.x} ${end.y}`;
}

type ServiceNodeCardProps = {
  node: ServiceNode;
  selected: boolean;
  menuOpen: boolean;
  onSelect: () => void;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onMenuToggle: (event: ReactPointerEvent<HTMLButtonElement>) => void;
  onAction: (action: "logs" | "redeploy" | "restart" | "stop" | "settings") => void;
};

function ServiceNodeCard({ node, selected, menuOpen, onSelect, onPointerDown, onMenuToggle, onAction }: ServiceNodeCardProps) {
  return (
    <article
      className={`service-node ${selected ? "service-node--selected" : ""} ${menuOpen ? "service-node--menu-open" : ""}`}
      data-service-node="true"
      style={{ left: node.position.x, top: node.position.y } as CSSProperties}
      onPointerDown={onPointerDown}
      onClick={onSelect}
      aria-label={`${node.name} service node`}
    >
      <div className="service-node__header">
        <TechnologyLogo kind={node.kind} size="md" />
        <div className="service-node__heading">
          <span className="service-node__eyebrow">{serviceKindLabel(node.kind)}</span>
          <h3>{node.name}</h3>
        </div>
        <button
          type="button"
          className="icon-button icon-button--node"
          aria-label={`Actions for ${node.name}`}
          aria-expanded={menuOpen}
          data-canvas-control="true"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onMenuToggle}
        >
          <MoreVertical size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      <div className="service-node__status-row">
        <StatusPill status={node.status} compact />
        {node.branch ? (
          <span className="service-node__branch">
            <GitBranch size={12} strokeWidth={1.8} aria-hidden="true" />
            {node.branch}
          </span>
        ) : node.connections.length ? (
          <span className="service-node__branch" title={node.connections.length > 1 ? "Connected to Web and Worker" : "Connected to Laravel Web"}>
            <Layers3 size={12} strokeWidth={1.8} aria-hidden="true" />
            {node.connections.length > 1 ? "Web + Worker" : "Laravel Web"}
          </span>
        ) : null}
      </div>

      <div className="service-node__facts">
        <span>
          <Code2 size={12} strokeWidth={1.8} aria-hidden="true" />
          {node.runtime}
        </span>
        <span>
          <Globe2 size={12} strokeWidth={1.8} aria-hidden="true" />
          {node.endpoint}
        </span>
      </div>

      <div className="service-node__footer">
        <span>
          <Cpu size={12} strokeWidth={1.8} aria-hidden="true" />
          {node.cpu}
        </span>
        <span>
          <MemoryStick size={12} strokeWidth={1.8} aria-hidden="true" />
          {node.ram}
        </span>
      </div>

      {menuOpen ? (
        <div className="node-action-menu" role="menu" aria-label={`${node.name} actions`} data-canvas-control="true" onPointerDown={(event) => event.stopPropagation()}>
          <button type="button" role="menuitem" onClick={() => onAction("logs")}>
            <FileText size={14} strokeWidth={1.7} aria-hidden="true" />
            View logs
          </button>
          <button type="button" role="menuitem" onClick={() => onAction("redeploy")}>
            <Rocket size={14} strokeWidth={1.7} aria-hidden="true" />
            Redeploy
          </button>
          <button type="button" role="menuitem" onClick={() => onAction("restart")}>
            <RefreshCcw size={14} strokeWidth={1.7} aria-hidden="true" />
            Restart
          </button>
          <button type="button" role="menuitem" onClick={() => onAction("stop")}>
            <StopCircle size={14} strokeWidth={1.7} aria-hidden="true" />
            Stop
          </button>
          <button type="button" role="menuitem" onClick={() => onAction("settings")}>
            <Settings size={14} strokeWidth={1.7} aria-hidden="true" />
            Settings
          </button>
        </div>
      ) : null}
    </article>
  );
}

type ServiceCanvasProps = {
  services: ServiceNode[];
  selectedServiceId: string | null;
  deploymentActive: boolean;
  onSelect: (id: string) => void;
  onOpenAdd: () => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onNodeAction: (id: string, action: "logs" | "redeploy" | "restart" | "stop" | "settings") => void;
};

function ServiceCanvas({ services, selectedServiceId, deploymentActive, onSelect, onOpenAdd, onUpdatePosition, onNodeAction }: ServiceCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const interactionRef = useRef<
    | { kind: "node"; id: string; startX: number; startY: number; originX: number; originY: number; offsetX: number; offsetY: number }
    | { kind: "pan"; startX: number; startY: number; originX: number; originY: number }
    | null
  >(null);
  const draggedRef = useRef(false);

  const handleNodePointerDown = (id: string, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const node = services.find((item) => item.id === id);
    const viewport = viewportRef.current;
    if (!node || !viewport) return;
    const rect = viewport.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left - pan.x) / zoom;
    const pointerY = (event.clientY - rect.top - pan.y) / zoom;
    interactionRef.current = {
      kind: "node",
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: node.position.x,
      originY: node.position.y,
      offsetX: pointerX - node.position.x,
      offsetY: pointerY - node.position.y,
    };
    draggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleViewportPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-canvas-control]")) return;
    if (target.closest("[data-service-node]")) return;
    interactionRef.current = { kind: "pan", startX: event.clientX, startY: event.clientY, originX: pan.x, originY: pan.y };
    draggedRef.current = false;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleViewportPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    if (!interaction) return;
    const deltaX = event.clientX - interaction.startX;
    const deltaY = event.clientY - interaction.startY;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) draggedRef.current = true;

    if (interaction.kind === "pan") {
      setPan({ x: interaction.originX + deltaX, y: interaction.originY + deltaY });
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const nextX = (event.clientX - rect.left - pan.x) / zoom - interaction.offsetX;
    const nextY = (event.clientY - rect.top - pan.y) / zoom - interaction.offsetY;
    onUpdatePosition(interaction.id, {
      x: Math.max(24, Math.min(CANVAS_WIDTH - NODE_WIDTH - 20, nextX)),
      y: Math.max(28, Math.min(CANVAS_HEIGHT - NODE_HEIGHT - 18, nextY)),
    });
  };

  const handleViewportPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    if (interaction?.kind === "node" && !draggedRef.current) onSelect(interaction.id);
    interactionRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handleViewportWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((value) => Math.max(0.72, Math.min(1.24, Number((value + (event.deltaY > 0 ? -0.08 : 0.08)).toFixed(2)))));
  };

  const fitView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const connectors = services.flatMap((source) => source.connections.map((targetId) => {
    const target = services.find((candidate) => candidate.id === targetId);
    if (!target) return null;
    const anchors = getConnectorAnchors(source, target);
    const isActive = selectedServiceId === source.id || selectedServiceId === target.id;
    return { key: `${source.id}-${target.id}`, ...anchors, isActive };
  }).filter(Boolean)) as Array<{ key: string; start: { x: number; y: number }; end: { x: number; y: number }; isActive: boolean }>;

  const stageStyle = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
  } as CSSProperties;

  return (
    <section className="service-canvas" aria-label="Production service canvas">
      <div className="canvas-header">
        <span className="canvas-live-dot" aria-hidden="true" />
        <span>Production · Singapore</span>
        <span className="canvas-header__separator" aria-hidden="true" />
        <span className="canvas-header__count">{services.length} {services.length === 1 ? "service" : "services"}</span>
      </div>

      <div
        ref={viewportRef}
        className={`canvas-viewport ${interactionRef.current?.kind === "pan" ? "canvas-viewport--panning" : ""}`}
        onPointerDown={handleViewportPointerDown}
        onPointerMove={handleViewportPointerMove}
        onPointerUp={handleViewportPointerUp}
        onPointerCancel={handleViewportPointerUp}
        onWheel={handleViewportWheel}
      >
        <div className="canvas-stage" style={stageStyle}>
          <svg className="canvas-connectors" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} aria-hidden="true">
            {connectors.map((connector) => (
              <g key={connector.key} className={connector.isActive ? "connector connector--active" : "connector"}>
                <path d={connectorPath(connector.start, connector.end)} />
                <circle cx={connector.start.x} cy={connector.start.y} r="3" />
                <circle cx={connector.end.x} cy={connector.end.y} r="3" />
              </g>
            ))}
          </svg>

          {services.length === 0 ? (
            <EmptyCanvas onAdd={onOpenAdd} />
          ) : (
            services.map((node) => (
              <ServiceNodeCard
                key={node.id}
                node={node}
                selected={node.id === selectedServiceId}
                menuOpen={node.id === menuOpenId}
                onSelect={() => onSelect(node.id)}
                onPointerDown={(event) => handleNodePointerDown(node.id, event)}
                onMenuToggle={(event) => {
                  event.stopPropagation();
                  setMenuOpenId((value) => (value === node.id ? null : node.id));
                }}
                onAction={(action) => {
                  setMenuOpenId(null);
                  onNodeAction(node.id, action);
                }}
              />
            ))
          )}
        </div>

        <div className="canvas-toolbar" data-canvas-control="true" aria-label="Canvas controls">
          <button type="button" className="canvas-tool canvas-tool--active" aria-label="Select" title="Select">
            <MousePointer2 size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button type="button" className="canvas-tool" aria-label="Add service" title="Add service" onClick={onOpenAdd}>
            <Plus size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <span className="canvas-tool-divider" aria-hidden="true" />
          <button type="button" className="canvas-tool" aria-label="Zoom in" title="Zoom in" onClick={() => setZoom((value) => Math.min(1.24, Number((value + 0.1).toFixed(2))))}>
            <ZoomIn size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button type="button" className="canvas-tool" aria-label="Zoom out" title="Zoom out" onClick={() => setZoom((value) => Math.max(0.72, Number((value - 0.1).toFixed(2))))}>
            <ZoomOut size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <button type="button" className="canvas-tool" aria-label="Fit view" title="Fit view" onClick={fitView}>
            <Maximize2 size={15} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>

        <div className="canvas-zoom-label" aria-live="polite">{Math.round(zoom * 100)}%</div>
        {deploymentActive ? (
          <div className="canvas-deploying-indicator">
            <LoaderCircle size={13} strokeWidth={1.8} className="spin" aria-hidden="true" />
            Updating services
          </div>
        ) : null}
      </div>
    </section>
  );
}

function EmptyCanvas({ onAdd }: { onAdd: () => void }) {
  const choices = SERVICE_CHOICES.slice(0, 4);
  const positions = [
    { left: 150, top: 118 },
    { left: 774, top: 118 },
    { left: 150, top: 360 },
    { left: 774, top: 360 },
  ];

  return (
    <>
      <svg className="empty-connectors" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} aria-hidden="true">
        <path d="M 305 170 H 398 V 248 H 428" />
        <path d="M 680 248 H 744 V 170 H 774" />
        <path d="M 305 392 H 398 V 320 H 428" />
        <path d="M 680 320 H 744 V 392 H 774" />
        <path d="M 554 356 V 448" />
      </svg>

      {choices.map((choice, index) => (
        <button
          key={choice.id}
          type="button"
          className={`empty-choice empty-choice--${index % 2 === 0 ? "left" : "right"}`}
          style={positions[index]}
          onClick={() => onAdd()}
        >
          <TechnologyLogo src={choice.icon} size="sm" />
          <span>
            <strong>{choice.label}</strong>
            <small>+ Add</small>
          </span>
        </button>
      ))}

      <button type="button" className="empty-start-card" onClick={onAdd}>
        <span className="empty-start-card__plus">
          <Plus size={22} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <strong>Start your project</strong>
        <span>Add a service to begin deploying</span>
      </button>

      <div className="empty-infrastructure">
        <span className="empty-infrastructure__label">Add infrastructure</span>
        {SERVICE_CHOICES.slice(4).map((choice) => (
          <button key={choice.id} type="button" className="empty-infrastructure__item" onClick={onAdd}>
            <TechnologyLogo src={choice.icon} size="sm" />
            <span>
              <strong>{choice.label}</strong>
              <small>+ Add</small>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function SetupSteps({ services, deploymentStatus }: { services: ServiceNode[]; deploymentStatus: string }) {
  const steps = [
    { label: "Project created", detail: "Complete", complete: true },
    { label: "Add service", detail: services.length ? `${services.length} services connected` : "Add your first service", complete: services.length > 0 },
    { label: "Configure", detail: services.length ? "Environment ready" : "Set environment variables", complete: false },
    { label: "Deploy", detail: deploymentStatus === "Live" ? "Deployed to production" : "Deploy your services", complete: deploymentStatus === "Live" },
    { label: "Domain", detail: "Add a custom domain", complete: false },
  ];

  return (
    <div className="setup-steps">
      {steps.map((step, index) => (
        <div className={`setup-step ${step.complete ? "setup-step--complete" : index === 1 && services.length === 0 ? "setup-step--current" : ""}`} key={step.label}>
          <span className="setup-step__marker">
            {step.complete ? <Check size={13} strokeWidth={2.2} aria-hidden="true" /> : index + 1}
          </span>
          <span className="setup-step__copy">
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
          </span>
        </div>
      ))}
    </div>
  );
}

function DetailRow({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd className={mono ? "detail-row__mono" : ""}>{children}</dd>
    </div>
  );
}

type ProjectPanelProps = {
  project: Project;
  services: ServiceNode[];
  selectedService: ServiceNode | null;
  deploymentStatus: string;
  mobileOpen: boolean;
  onClose: () => void;
  onOpenLogs: (id?: string) => void;
  onRedeploy: (id?: string) => void;
  onSettings: () => void;
};

function ProjectPanel({ project, services, selectedService, deploymentStatus, mobileOpen, onClose, onOpenLogs, onRedeploy, onSettings }: ProjectPanelProps) {
  const domain = "app-ig.example.dev";
  const latestDeployment = services.length ? "Aug 27, 2026 · 10:24 UTC" : "Not deployed";

  return (
    <aside className={`overview-detail-panel ${mobileOpen ? "overview-detail-panel--mobile-open" : ""}`} aria-label={selectedService ? "Service details" : "Project setup"}>
      <div className="panel-header">
        <div>
          <span className="panel-kicker">{selectedService ? "Selected service" : "Production environment"}</span>
          <h2>{selectedService ? "Service details" : "Project setup"}</h2>
        </div>
        <button type="button" className="icon-button panel-close" aria-label="Close panel" onClick={onClose}>
          <X size={16} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      {selectedService ? (
        <>
          <div className="panel-service-summary">
            <TechnologyLogo kind={selectedService.kind} size="lg" />
            <div>
              <strong>{selectedService.name}</strong>
              <span>{serviceKindLabel(selectedService.kind)} · {project.name}</span>
            </div>
            <StatusPill status={selectedService.status} compact />
          </div>

          <div className="panel-section panel-section--first">
            <span className="panel-section__title">Service configuration</span>
            <dl className="detail-list">
              <DetailRow label="Runtime">{selectedService.runtime}</DetailRow>
              <DetailRow label="Endpoint" mono>{selectedService.endpoint}</DetailRow>
              {selectedService.branch ? <DetailRow label="Branch" mono>{selectedService.branch}</DetailRow> : null}
              <DetailRow label="CPU">{selectedService.cpu}</DetailRow>
              <DetailRow label="RAM">{selectedService.ram}</DetailRow>
            </dl>
          </div>

          <div className="panel-actions">
            <button type="button" className="panel-action panel-action--primary" onClick={() => onOpenLogs(selectedService.id)}>
              <FileText size={14} strokeWidth={1.7} aria-hidden="true" />
              View logs
            </button>
            <button type="button" className="panel-action" onClick={() => onRedeploy(selectedService.id)}>
              <Rocket size={14} strokeWidth={1.7} aria-hidden="true" />
              Redeploy
            </button>
            <button type="button" className="panel-action" onClick={onSettings}>
              <Settings size={14} strokeWidth={1.7} aria-hidden="true" />
              Settings
            </button>
          </div>

          <div className="panel-section">
            <span className="panel-section__title">Connections</span>
            <div className="connection-list">
              {selectedService.connections.length ? selectedService.connections.map((connection) => {
                const target = services.find((service) => service.id === connection);
                return target ? (
                  <div className="connection-item" key={target.id}>
                    <span className="connection-item__line" aria-hidden="true" />
                    <TechnologyLogo kind={target.kind} size="sm" />
                    <span>{target.name}</span>
                  </div>
                ) : null;
              }) : (
                <div className="panel-muted-row">No upstream dependencies</div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <SetupSteps services={services} deploymentStatus={deploymentStatus} />

          <div className="panel-section panel-section--first">
            <span className="panel-section__title">Environment summary</span>
            <dl className="detail-list">
              <DetailRow label="Services"><strong>{services.length}</strong></DetailRow>
              <DetailRow label="Region"><span className="panel-region"><RegionFlag country="singapore" /> Singapore</span></DetailRow>
              <DetailRow label="Status"><span className="panel-status-dot"><span aria-hidden="true" />{deploymentStatus}</span></DetailRow>
              <DetailRow label="Domain" mono>{services.length ? domain : "Not configured"}</DetailRow>
            </dl>
          </div>

          <div className="panel-section">
            <span className="panel-section__title">Deployment</span>
            <dl className="detail-list">
              <DetailRow label="Latest deployment">{latestDeployment}</DetailRow>
              <DetailRow label="Monthly usage">12.4 / 100 hours</DetailRow>
            </dl>
            <div className="usage-meter" aria-label="Monthly usage 12.4 percent">
              <span style={{ width: "12.4%" }} />
            </div>
          </div>

          <div className="panel-help-card">
            <div className="panel-help-card__icon"><CircleHelp size={14} strokeWidth={1.7} aria-hidden="true" /></div>
            <div>
              <strong>Need help getting started?</strong>
              <a href="#documentation">View documentation <ExternalLink size={12} strokeWidth={1.7} aria-hidden="true" /></a>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

type AddServiceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (choice: ServiceChoice) => void;
};

function AddServiceDialog({ open, onClose, onSelect }: AddServiceDialogProps) {
  if (!open) return null;

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="add-service-title">
      <button type="button" className="modal-backdrop" aria-label="Close add service dialog" onClick={onClose} />
      <div className="modal-card modal-card--service-picker">
        <div className="modal-card__header">
          <div>
            <span className="panel-kicker">Production · ap-southeast-1</span>
            <h2 id="add-service-title">Add a new service</h2>
            <p>Choose a source or managed infrastructure to add to your project.</p>
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
        <div className="service-picker-grid">
          {SERVICE_CHOICES.map((choice) => (
            <button type="button" className="service-picker-option" key={choice.id} onClick={() => onSelect(choice)}>
              <TechnologyLogo src={choice.icon} size="md" />
              <span>
                <strong>{choice.label}</strong>
                <small>{choice.description}</small>
              </span>
              <ChevronRight size={15} strokeWidth={1.7} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogsDialog({ open, service, onClose }: { open: boolean; service: ServiceNode | null; onClose: () => void }) {
  if (!open) return null;
  const title = service ? `${service.name} logs` : "Project logs";
  const runtimeLine = service?.kind === "laravel" ? "php artisan config:cache" : service?.kind === "node" ? "node worker.js" : "healthcheck --ready";

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="logs-title">
      <button type="button" className="modal-backdrop" aria-label="Close logs" onClick={onClose} />
      <div className="modal-card modal-card--logs">
        <div className="modal-card__header">
          <div>
            <span className="panel-kicker">Build & runtime output</span>
            <h2 id="logs-title">{title}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close logs" onClick={onClose}>
            <X size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
        <div className="logs-toolbar">
          <span className="logs-live"><span aria-hidden="true" /> Live tail</span>
          <span>production</span>
          <button type="button" className="logs-copy" onClick={() => void navigator.clipboard?.writeText(`10:24:18 info ${runtimeLine}`)}>
            <Copy size={13} strokeWidth={1.7} aria-hidden="true" /> Copy
          </button>
        </div>
        <pre className="log-output"><code><span className="log-muted">10:24:14</span> <span className="log-info">info</span>  starting deployment for {service?.name ?? "project"}{"\n"}<span className="log-muted">10:24:16</span> <span className="log-info">info</span>  pulling source from <span className="log-accent">main</span>{"\n"}<span className="log-muted">10:24:17</span> <span className="log-info">info</span>  {runtimeLine}{"\n"}<span className="log-muted">10:24:18</span> <span className="log-success">done</span>  service is healthy and accepting traffic</code></pre>
      </div>
    </div>
  );
}

type SettingsDialogProps = {
  open: boolean;
  selectedService: ServiceNode | null;
  onClose: () => void;
  onStatusChange: (status: ServiceStatus) => void;
  onClear: () => void;
  onLoadDemo: () => void;
};

function SettingsDialog({ open, selectedService, onClose, onStatusChange, onClear, onLoadDemo }: SettingsDialogProps) {
  if (!open) return null;

  return (
    <div className="modal-shell" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button type="button" className="modal-backdrop" aria-label="Close settings" onClick={onClose} />
      <div className="modal-card modal-card--settings">
        <div className="modal-card__header">
          <div>
            <span className="panel-kicker">Project configuration</span>
            <h2 id="settings-title">Settings</h2>
            <p>Prototype controls for this production environment.</p>
          </div>
          <button type="button" className="icon-button" aria-label="Close settings" onClick={onClose}>
            <X size={17} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>

        {selectedService ? (
          <label className="settings-field">
            <span>Prototype service status</span>
            <select value={selectedService.status} onChange={(event) => onStatusChange(event.target.value as ServiceStatus)}>
              <option value="building">Building</option>
              <option value="live">Live</option>
              <option value="failed">Failed</option>
              <option value="stopped">Stopped</option>
              <option value="available">Available</option>
            </select>
          </label>
        ) : null}

        <div className="settings-toggle-row">
          <div>
            <strong>Automatic deployments</strong>
            <span>Deploy commits pushed to main automatically.</span>
          </div>
          <span className="fake-toggle fake-toggle--on"><span /></span>
        </div>
        <div className="settings-toggle-row">
          <div>
            <strong>Health checks</strong>
            <span>Route traffic only after the service is ready.</span>
          </div>
          <span className="fake-toggle fake-toggle--on"><span /></span>
        </div>

        <div className="settings-danger-zone">
          <div>
            <strong>Demo data</strong>
            <span>Switch between the deployed canvas and the empty state.</span>
          </div>
          <div className="settings-danger-zone__actions">
            <button type="button" className="panel-action" onClick={onLoadDemo}>Load deployed demo</button>
            <button type="button" className="panel-action panel-action--danger" onClick={onClear}>Clear services</button>
          </div>
        </div>

        <div className="modal-card__footer">
          <button type="button" className="panel-action" onClick={onClose}>Close</button>
          <button type="button" className="panel-action panel-action--primary" onClick={onClose}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function buildNewService(choice: ServiceChoice, existing: ServiceNode[], id: string): ServiceNode {
  const index = existing.length;
  const layouts = [
    { x: 150, y: 224 },
    { x: 476, y: 86 },
    { x: 476, y: 360 },
    { x: 800, y: 224 },
  ];
  const position = layouts[index % layouts.length];
  const sourceDefaults: Record<string, Pick<ServiceNode, "name" | "runtime" | "endpoint" | "cpu" | "ram">> = {
    github: { name: "Laravel Web", runtime: "PHP 8.3", endpoint: "Port 8080", cpu: "0.5 vCPU", ram: "512 MB" },
    upload: { name: "Uploaded Source", runtime: "PHP 8.3", endpoint: "Port 8080", cpu: "0.5 vCPU", ram: "512 MB" },
    docker: { name: "Docker Service", runtime: "Docker image", endpoint: "Port 8080", cpu: "0.5 vCPU", ram: "512 MB" },
    template: { name: "React Starter", runtime: "React 19", endpoint: "Port 3000", cpu: "0.5 vCPU", ram: "512 MB" },
    postgresql: { name: "PostgreSQL", runtime: "PostgreSQL 16", endpoint: "Port 5432", cpu: "0.25 vCPU", ram: "512 MB" },
    mysql: { name: "MySQL", runtime: "MySQL 8", endpoint: "Port 3306", cpu: "0.25 vCPU", ram: "512 MB" },
    redis: { name: "Redis", runtime: "Redis 7", endpoint: "Port 6379", cpu: "0.25 vCPU", ram: "128 MB" },
  };
  const defaults = sourceDefaults[choice.id];
  const source = choice.source ?? false;
  const parent = existing.find((service) => service.kind === "laravel" || service.kind === "react" || service.kind === "docker");

  return {
    id,
    name: defaults.name,
    kind: choice.kind,
    runtime: defaults.runtime,
    status: source ? "building" : "available",
    endpoint: defaults.endpoint,
    cpu: defaults.cpu,
    ram: defaults.ram,
    branch: source ? "main" : undefined,
    connections: parent && !source ? [parent.id] : [],
    position,
  };
}

function makeServiceId(choice: ServiceChoice, existing: ServiceNode[]) {
  const base = choice.id === "github" ? "laravel-web" : choice.id;
  let id = base;
  let suffix = 2;
  while (existing.some((service) => service.id === id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

export function ServiceOverview({ project }: { project: Project }) {
  const [services, setServices] = useState<ServiceNode[]>(cloneDefaultServices);
  const [storageReady, setStorageReady] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabLabel>("Overview");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsServiceId, setLogsServiceId] = useState<string | undefined>(undefined);
  const [deployProgress, setDeployProgress] = useState<{ progress: number; label: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const stored = parseStoredServices(window.localStorage.getItem(SERVICE_STORAGE_KEY));
    if (stored) setServices(stored);
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(services));
    } catch {
      // Keep the prototype usable when storage is blocked or full.
    }
  }, [services, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  );

  const deploymentStatus = useMemo(() => {
    if (deployProgress) return "Building";
    if (!services.length) return "Empty";
    if (services.some((service) => service.status === "failed")) return "Failed";
    if (services.every((service) => service.status === "stopped")) return "Stopped";
    return "Live";
  }, [deployProgress, services]);

  const startDeployment = useCallback((serviceId?: string) => {
    if (!services.length) {
      setAddDialogOpen(true);
      return;
    }

    setDeployProgress({ progress: 18, label: "Deploying" });
    setServices((current) => current.map((service) => {
      if (serviceId && service.id !== serviceId) return service;
      return { ...service, status: "building" };
    }));

    window.setTimeout(() => setDeployProgress({ progress: 46, label: "Building" }), 420);
    window.setTimeout(() => setDeployProgress({ progress: 78, label: "Health check" }), 980);
    window.setTimeout(() => {
      setServices((current) => current.map((service) => {
        if (serviceId && service.id !== serviceId) return service;
        return { ...service, status: isDatabase(service) ? "available" : "live" };
      }));
      setDeployProgress(null);
      setToast(serviceId ? "Service redeployed successfully" : "Deployment completed successfully");
    }, 1540);
  }, [services.length]);

  const restartService = useCallback((id: string) => {
    setServices((current) => current.map((service) => service.id === id ? { ...service, status: "building" } : service));
    setDeployProgress({ progress: 42, label: "Restarting" });
    window.setTimeout(() => {
      setServices((current) => current.map((service) => service.id === id ? { ...service, status: isDatabase(service) ? "available" : "live" } : service));
      setDeployProgress(null);
      setToast("Service restarted");
    }, 1100);
  }, []);

  const stopService = useCallback((id: string) => {
    setServices((current) => current.map((service) => service.id === id ? { ...service, status: "stopped" } : service));
    setToast("Service stopped");
  }, []);

  const handleNodeAction = (id: string, action: "logs" | "redeploy" | "restart" | "stop" | "settings") => {
    setSelectedServiceId(id);
    if (action === "logs") {
      setLogsServiceId(id);
      setLogsOpen(true);
    } else if (action === "redeploy") {
      startDeployment(id);
    } else if (action === "restart") {
      restartService(id);
    } else if (action === "stop") {
      stopService(id);
    } else {
      setSettingsOpen(true);
    }
  };

  const handleAddChoice = (choice: ServiceChoice) => {
    const id = makeServiceId(choice, services);
    const service = buildNewService(choice, services, id);
    setServices((current) => [...current, buildNewService(choice, current, id)]);
    setAddDialogOpen(false);
    setSelectedServiceId(id);
    setMobilePanelOpen(true);
    setToast(`${service.name} added to the canvas`);

    if (service.status === "building") {
      window.setTimeout(() => {
        setServices((current) => current.map((item) => item.id === id ? { ...item, status: "live" } : item));
        setToast(`${service.name} is live`);
      }, 1350);
    }
  };

  const handleTabClick = (tab: TabLabel) => {
    setActiveTab(tab);
    if (tab === "Logs") {
      setLogsServiceId(selectedServiceId ?? undefined);
      setLogsOpen(true);
    } else if (tab === "Settings") {
      setSettingsOpen(true);
    } else if (tab !== "Overview") {
      setToast(`${tab} view is ready for the next prototype step`);
    }
  };

  return (
    <div className="overview-page">
      <TopBar showSidebarToggle={false} projectName={project.name} environment={project.environment} />

      <main>
        <header className="overview-header">
          <div className="overview-title-row">
            <div>
              <span className="overview-kicker">Project</span>
              <h1>{project.name}</h1>
              <p>
                {project.provider}
                <span aria-hidden="true">|</span>
                <RegionFlag country="singapore" />
                {project.region}
              </p>
            </div>
            <span className="environment-badge">{project.environment.toUpperCase()}</span>
          </div>

          <div className="overview-nav-row">
            <nav className="overview-tabs" aria-label="Project sections" role="tablist">
              {tabs.map(({ label, Icon }) => {
                const active = activeTab === label;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`overview-tab ${active ? "overview-tab--active" : ""}`}
                    key={label}
                    onClick={() => handleTabClick(label)}
                  >
                    <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="overview-actions">
              <button type="button" className="overview-button overview-button--primary" onClick={() => setAddDialogOpen(true)}>
                <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
                New service
              </button>
              <button type="button" className="overview-button" onClick={() => startDeployment()} disabled={Boolean(deployProgress) || services.length === 0}>
                {deployProgress ? <LoaderCircle size={15} strokeWidth={1.8} className="spin" aria-hidden="true" /> : <Rocket size={15} strokeWidth={1.7} aria-hidden="true" />}
                {deployProgress ? `${deployProgress.label} ${deployProgress.progress}%` : services.length ? "Redeploy" : "Deploy"}
              </button>
              <button type="button" className="overview-button" onClick={() => setSettingsOpen(true)}>
                <Settings size={15} strokeWidth={1.7} aria-hidden="true" />
                Settings
              </button>
            </div>
          </div>
        </header>

        <div className="overview-main-grid">
          <ServiceCanvas
            services={services}
            selectedServiceId={selectedServiceId}
            deploymentActive={Boolean(deployProgress)}
            onSelect={(id) => {
              setSelectedServiceId(id);
              setMobilePanelOpen(true);
            }}
            onOpenAdd={() => setAddDialogOpen(true)}
            onUpdatePosition={(id, position) => setServices((current) => current.map((service) => service.id === id ? { ...service, position } : service))}
            onNodeAction={handleNodeAction}
          />

          {mobilePanelOpen ? <button type="button" className="panel-backdrop" aria-label="Close details panel" onClick={() => setMobilePanelOpen(false)} /> : null}
          <ProjectPanel
            project={project}
            services={services}
            selectedService={selectedService}
            deploymentStatus={deploymentStatus}
            mobileOpen={mobilePanelOpen}
            onClose={() => setMobilePanelOpen(false)}
            onOpenLogs={(id) => {
              setLogsServiceId(id);
              setLogsOpen(true);
            }}
            onRedeploy={startDeployment}
            onSettings={() => setSettingsOpen(true)}
          />
        </div>
      </main>

      {toast ? (
        <div className="overview-toast" role="status">
          <Check size={14} strokeWidth={2} aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <AddServiceDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSelect={handleAddChoice} />
      <LogsDialog open={logsOpen} service={services.find((service) => service.id === logsServiceId) ?? null} onClose={() => setLogsOpen(false)} />
      <SettingsDialog
        open={settingsOpen}
        selectedService={selectedService}
        onClose={() => setSettingsOpen(false)}
        onStatusChange={(status) => {
          if (!selectedServiceId) return;
          setServices((current) => current.map((service) => service.id === selectedServiceId ? { ...service, status } : service));
        }}
        onClear={() => {
          setServices([]);
          setSelectedServiceId(null);
          setMobilePanelOpen(false);
          setSettingsOpen(false);
          setToast("Canvas cleared — choose a source to start again");
        }}
        onLoadDemo={() => {
          setServices(cloneDefaultServices());
          setSettingsOpen(false);
          setToast("Deployed service demo restored");
        }}
      />
    </div>
  );
}
