"use client";

import {
  ChevronRight,
  Copy,
  Settings,
  X,
} from "lucide-react";
import { TechnologyLogo } from "./service-primitives";
import { SERVICE_CHOICES, type ServiceChoice, type ServiceNode, type ServiceStatus } from "./service-overview-model";

type AddServiceDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (choice: ServiceChoice) => void;
};

export function AddServiceDialog({ open, onClose, onSelect }: AddServiceDialogProps) {
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

export function LogsDialog({ open, service, onClose }: { open: boolean; service: ServiceNode | null; onClose: () => void }) {
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

export function SettingsDialog({ open, selectedService, onClose, onStatusChange, onClear, onLoadDemo }: SettingsDialogProps) {
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
