"use client";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  CircleAlert,
  Info,
  LoaderCircle,
  RefreshCcw,
  Server,
  Terminal,
} from "lucide-react";
import type { Project } from "../types";
import {
  STATUS_ORDER,
  STATUS_PROGRESS,
  getSourceDefinition,
  type DeploymentConfig,
  type DeploymentSourceId,
  type DeploymentStatus,
} from "./pre-deploy-model";

export function DeployStep({
  project,
  source,
  config,
  status,
  onBack,
  onRetry,
  onSimulateFailure,
}: {
  project: Project;
  source: DeploymentSourceId | null;
  config: DeploymentConfig;
  status: DeploymentStatus;
  onBack: () => void;
  onRetry: () => void;
  onSimulateFailure: () => void;
}) {
  const activeIndex = STATUS_ORDER.indexOf(status);
  const selectedSource = getSourceDefinition(source);
  const isFailed = status === "Failed";
  const isLive = status === "Live";
  const logLines: Record<DeploymentStatus, string[]> = {
    Queued: ["Waiting for a build worker…", `Source: ${selectedSource?.summary ?? "Deployment source"}`],
    Building: ["Installing dependencies…", config.buildCommand || "Running build command…"],
    Deploying: ["Pushing image to ap-southeast-1…", "Waiting for health checks…"],
    Live: ["Health checks passed", "Service is accepting traffic on port " + config.port],
    Failed: ["Build exited with code 1", "Check the build logs and try again."],
  };

  return (
    <section className="deploy-progress-panel" aria-labelledby="deploy-title">
      <div className="deploy-section-heading deploy-progress-heading">
        <div>
          <h2 id="deploy-title">Deploy {project.name}</h2>
          <p>{isLive ? "Your service is live and ready to receive traffic." : isFailed ? "The deployment needs attention before it can go live." : "We are preparing your service for production."}</p>
        </div>
        <span className={`deploy-status-badge deploy-status-badge--${status.toLowerCase()}`}>
          {isLive ? <CheckCircle2 size={14} strokeWidth={1.9} aria-hidden="true" /> : isFailed ? <CircleAlert size={14} strokeWidth={1.9} aria-hidden="true" /> : <LoaderCircle size={14} strokeWidth={1.9} className="spin" aria-hidden="true" />}
          {status}
        </span>
      </div>

      <div className="deploy-progress-track" aria-label={`${status} deployment progress`}>
        <span style={{ width: `${STATUS_PROGRESS[status]}%` }} />
      </div>

      <ol className="deploy-status-timeline">
        {STATUS_ORDER.map((item, index) => {
          const complete = !isFailed && (isLive || activeIndex > index);
          const active = item === status;
          return (
            <li key={item} className={`${complete ? "is-complete" : ""} ${active ? "is-active" : ""}`}>
              <span className="deploy-status-timeline__marker" aria-hidden="true">
                {complete ? <Check size={12} strokeWidth={2.4} /> : active && !isFailed ? <LoaderCircle size={12} strokeWidth={2} className="spin" /> : <Circle size={12} strokeWidth={1.5} />}
              </span>
              <span>{item}</span>
            </li>
          );
        })}
        {isFailed ? (
          <li className="is-failed"><span className="deploy-status-timeline__marker" aria-hidden="true"><CircleAlert size={13} strokeWidth={1.9} /></span><span>Failed</span></li>
        ) : null}
      </ol>

      <div className="deploy-live-card">
        <div className="deploy-live-card__icon"><Server size={17} strokeWidth={1.7} aria-hidden="true" /></div>
        <div>
          <strong>{selectedSource?.summary ?? "Deployment source"}</strong>
          <span>{project.region} · branch {config.branch || "main"}</span>
        </div>
        <span className="deploy-live-card__port">:{config.port || "8080"}</span>
      </div>

      <div className="deploy-log-preview" aria-live="polite">
        <div className="deploy-log-preview__heading"><span><Terminal size={13} strokeWidth={1.8} aria-hidden="true" />Deployment output</span><span>{isFailed ? "Needs attention" : "Live output"}</span></div>
        {logLines[status].map((line) => <code key={line}>{line}</code>)}
      </div>

      <div className="deploy-progress-actions">
        <button type="button" className="deploy-secondary-button" onClick={onBack} disabled={!isFailed && !isLive && status !== "Queued"}>
          <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
          Back to configuration
        </button>
        {isFailed ? <button type="button" className="deploy-secondary-button" onClick={onRetry}><RefreshCcw size={14} strokeWidth={1.8} aria-hidden="true" />Retry</button> : null}
        {!isLive && !isFailed ? <button type="button" className="deploy-text-button" onClick={onSimulateFailure}>Simulate failed run</button> : null}
      </div>
      <p className="deploy-local-note"><Info size={13} strokeWidth={1.7} aria-hidden="true" />Deployment state is saved in this browser.</p>
    </section>
  );
}
