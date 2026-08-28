"use client";

import {
  Check,
  CircleHelp,
  ExternalLink,
  FileText,
  Rocket,
  Settings,
  X,
} from "lucide-react";
import { RegionFlag } from "@/components/region-flag";
import type { Project } from "../types";
import { DetailRow, StatusPill, TechnologyLogo } from "./service-primitives";
import { serviceKindLabel, type ServiceNode } from "./service-overview-model";

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

export function ProjectPanel({ project, services, selectedService, deploymentStatus, mobileOpen, onClose, onOpenLogs, onRedeploy, onSettings }: ProjectPanelProps) {
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
