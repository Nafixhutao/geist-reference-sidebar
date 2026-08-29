"use client";

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import {
  GitBranch,
  Layers3,
  Code2,
  Cpu,
  Globe2,
  LoaderCircle,
  Maximize2,
  MemoryStick,
  MoreVertical,
  MousePointer2,
  Plus,
  Rocket,
  RefreshCcw,
  Settings,
  StopCircle,
  FileText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { TechnologyLogo, StatusPill } from "./service-primitives";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  NODE_HEIGHT,
  NODE_WIDTH,
  SERVICE_CHOICES,
  connectorPath,
  getConnectorAnchors,
  serviceKindLabel,
  type ServiceNode,
} from "./service-overview-model";

type NodeAction = "logs" | "redeploy" | "restart" | "stop" | "settings";

type ServiceNodeCardProps = {
  node: ServiceNode;
  selected: boolean;
  menuOpen: boolean;
  onSelect: (id: string) => void;
  onPointerDown: (id: string, event: ReactPointerEvent<HTMLElement>) => void;
  onMenuToggle: (id: string) => void;
  onAction: (id: string, action: NodeAction) => void;
};

// Memoized: handlers take the node id so their identity stays stable across
// renders, letting drag/pan frames skip every card except the moving one.
const ServiceNodeCard = memo(function ServiceNodeCard({ node, selected, menuOpen, onSelect, onPointerDown, onMenuToggle, onAction }: ServiceNodeCardProps) {
  return (
    <article
      className={`service-node ${selected ? "service-node--selected" : ""} ${menuOpen ? "service-node--menu-open" : ""}`}
      data-service-node="true"
      style={{ left: node.position.x, top: node.position.y } as CSSProperties}
      onPointerDown={(event) => onPointerDown(node.id, event)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(node.id);
        }
      }}
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
          onClick={(event) => {
            event.stopPropagation();
            onMenuToggle(node.id);
          }}
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
          <button type="button" role="menuitem" onClick={() => onAction(node.id, "logs")}>
            <FileText size={14} strokeWidth={1.7} aria-hidden="true" />
            View logs
          </button>
          <button type="button" role="menuitem" onClick={() => onAction(node.id, "redeploy")}>
            <Rocket size={14} strokeWidth={1.7} aria-hidden="true" />
            Redeploy
          </button>
          <button type="button" role="menuitem" onClick={() => onAction(node.id, "restart")}>
            <RefreshCcw size={14} strokeWidth={1.7} aria-hidden="true" />
            Restart
          </button>
          <button type="button" role="menuitem" onClick={() => onAction(node.id, "stop")}>
            <StopCircle size={14} strokeWidth={1.7} aria-hidden="true" />
            Stop
          </button>
          <button type="button" role="menuitem" onClick={() => onAction(node.id, "settings")}>
            <Settings size={14} strokeWidth={1.7} aria-hidden="true" />
            Settings
          </button>
        </div>
      ) : null}
    </article>
  );
});

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

type ServiceCanvasProps = {
  services: ServiceNode[];
  selectedServiceId: string | null;
  deploymentActive: boolean;
  onSelect: (id: string) => void;
  onOpenAdd: () => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onNodeAction: (id: string, action: NodeAction) => void;
};

export function ServiceCanvas({ services, selectedServiceId, deploymentActive, onSelect, onOpenAdd, onUpdatePosition, onNodeAction }: ServiceCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const interactionRef = useRef<
    | { kind: "node"; id: string; startX: number; startY: number; originX: number; originY: number; offsetX: number; offsetY: number }
    | { kind: "pan"; startX: number; startY: number; originX: number; originY: number }
    | null
  >(null);
  const draggedRef = useRef(false);
  // Latest-value refs keep the memoized node handlers dependency-free, so
  // pointerdown reads fresh pan/zoom/services without new handler identities.
  const panRef = useRef(pan);
  panRef.current = pan;
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const servicesRef = useRef(services);
  servicesRef.current = services;

  const handleNodePointerDown = useCallback((id: string, event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    const node = servicesRef.current.find((item) => item.id === id);
    const viewport = viewportRef.current;
    if (!node || !viewport) return;
    const rect = viewport.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left - panRef.current.x) / zoomRef.current;
    const pointerY = (event.clientY - rect.top - panRef.current.y) / zoomRef.current;
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
  }, []);

  const handleNodeSelect = useCallback((id: string) => onSelect(id), [onSelect]);

  const handleNodeMenuToggle = useCallback((id: string) => {
    setMenuOpenId((value) => (value === id ? null : id));
  }, []);

  const handleNodeAction = useCallback((id: string, action: NodeAction) => {
    setMenuOpenId(null);
    onNodeAction(id, action);
  }, [onNodeAction]);

  const handleViewportPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-canvas-control]")) return;
    if (target.closest("[data-service-node]")) return;
    interactionRef.current = { kind: "pan", startX: event.clientX, startY: event.clientY, originX: pan.x, originY: pan.y };
    draggedRef.current = false;
    setIsPanning(true);
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
    setIsPanning(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  // React registers onWheel as a passive listener, so preventDefault would be
  // ignored and a wheel gesture would zoom AND scroll the page. Attach a
  // non-passive native listener instead.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((value) => Math.max(0.72, Math.min(1.24, Number((value + (event.deltaY > 0 ? -0.08 : 0.08)).toFixed(2)))));
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, []);

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
        className={`canvas-viewport ${isPanning ? "canvas-viewport--panning" : ""}`}
        onPointerDown={handleViewportPointerDown}
        onPointerMove={handleViewportPointerMove}
        onPointerUp={handleViewportPointerUp}
        onPointerCancel={handleViewportPointerUp}
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
                onSelect={handleNodeSelect}
                onPointerDown={handleNodePointerDown}
                onMenuToggle={handleNodeMenuToggle}
                onAction={handleNodeAction}
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
