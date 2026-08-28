"use client";

import {
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  RefreshCcw,
} from "lucide-react";
import { RegionFlag } from "@/components/region-flag";
import type { Project } from "../types";
import {
  FRAMEWORK_LABELS,
  getSourceDefinition,
  type DeploymentConfig,
  type DeploymentSourceId,
  type DeploymentStatus,
  type PreDeployStep,
} from "./pre-deploy-model";
import { SummaryRow } from "./pre-deploy-shared";

export function DeploymentSummary({
  project,
  step,
  source,
  config,
  deployStatus,
  onContinue,
  onOpenOverview,
  onRetry,
}: {
  project: Project;
  step: PreDeployStep;
  source: DeploymentSourceId | null;
  config: DeploymentConfig;
  deployStatus: DeploymentStatus;
  onContinue: () => void;
  onOpenOverview: () => void;
  onRetry: () => void;
}) {
  const selectedSource = getSourceDefinition(source);
  const continueDisabled = step === "source" && !source;
  const regionName = project.regionCountry === "indonesia" ? "Jakarta" : "Singapore";
  const summarySource = selectedSource?.summary ?? "Not selected";

  return (
    <aside className="deployment-summary" aria-labelledby="deployment-summary-title">
      <h2 id="deployment-summary-title">Deployment summary</h2>
      <dl>
        <SummaryRow label="Project">{project.name}</SummaryRow>
        <SummaryRow label="Environment"><span className="deploy-summary-value--accent">{project.environment[0].toUpperCase() + project.environment.slice(1)}</span></SummaryRow>
        <SummaryRow label="Region">
          <span className="deploy-region-value">
            <RegionFlag country={project.regionCountry} />
            {regionName} ({project.region})
          </span>
        </SummaryRow>
        <SummaryRow label="Source" muted={!selectedSource}>{summarySource}</SummaryRow>
        <SummaryRow label="Framework">{FRAMEWORK_LABELS[config.framework]}</SummaryRow>
        <SummaryRow label="Auto deploy"><span className="deploy-summary-value--accent">{config.autoDeploy ? "On" : "Off"}</span></SummaryRow>
      </dl>

      {step === "deploy" ? (
        <div className="deployment-summary__deploy-state">
          {deployStatus === "Live" ? (
            <button type="button" className="deploy-primary-button" onClick={onOpenOverview}>
              <CheckCircle2 size={16} strokeWidth={1.8} aria-hidden="true" />
              Open service overview
            </button>
          ) : deployStatus === "Failed" ? (
            <button type="button" className="deploy-primary-button" onClick={onRetry}>
              <RefreshCcw size={15} strokeWidth={1.8} aria-hidden="true" />
              Retry deployment
            </button>
          ) : (
            <button type="button" className="deploy-primary-button" disabled>
              <LoaderCircle size={15} strokeWidth={1.8} className="spin" aria-hidden="true" />
              {deployStatus} deployment…
            </button>
          )}
          <p className="deployment-summary__note">You can change these settings later.</p>
        </div>
      ) : (
        <div className="deployment-summary__footer">
          <button type="button" className="deploy-primary-button" onClick={onContinue} disabled={continueDisabled}>
            {step === "source" ? "Continue to configuration" : "Continue to deployment"}
            <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <p className="deployment-summary__note">
            {continueDisabled ? "Choose a source to continue." : "You can change these settings later."}
          </p>
        </div>
      )}
    </aside>
  );
}
