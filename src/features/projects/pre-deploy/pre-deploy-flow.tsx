"use client";

import { SourceStep } from "./deploy-source-step";
import { ConfigureStep } from "./deploy-configure-step";
import { DeployStep } from "./deploy-progress-step";
import { DeploymentSummary } from "./deployment-summary";
import { DeployStepper } from "./pre-deploy-shared";
import type { Project } from "../types";
import type {
  DeploymentConfig,
  DeploymentSourceId,
  DeploymentStatus,
  PreDeployStep,
} from "./pre-deploy-model";

export type {
  DeploymentConfig,
  DeploymentFramework,
  DeploymentSourceId,
  DeploymentStatus,
  PreDeployStep,
} from "./pre-deploy-model";
export { getSourceDefinition } from "./pre-deploy-model";

export function PreDeployFlow({
  project,
  step,
  selectedSource,
  config,
  deployStatus,
  onSourceSelect,
  onConfigChange,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
  onContinue,
  onBack,
  onRetry,
  onOpenOverview,
  onSimulateFailure,
}: {
  project: Project;
  step: PreDeployStep;
  selectedSource: DeploymentSourceId | null;
  config: DeploymentConfig;
  deployStatus: DeploymentStatus;
  onSourceSelect: (source: DeploymentSourceId) => void;
  onConfigChange: <K extends keyof DeploymentConfig>(key: K, value: DeploymentConfig[K]) => void;
  onAddVariable: () => void;
  onRemoveVariable: (id: string) => void;
  onUpdateVariable: (id: string, field: "key" | "value", value: string) => void;
  onContinue: () => void;
  onBack: () => void;
  onRetry: () => void;
  onOpenOverview: () => void;
  onSimulateFailure: () => void;
}) {
  return (
    <div className="predeploy-shell">
      <DeployStepper currentStep={step} />
      <div className="predeploy-card">
        {step === "source" ? (
          <SourceStep selectedSource={selectedSource} onSelect={onSourceSelect} />
        ) : step === "configure" ? (
          <ConfigureStep
            config={config}
            onConfigChange={onConfigChange}
            onAddVariable={onAddVariable}
            onRemoveVariable={onRemoveVariable}
            onUpdateVariable={onUpdateVariable}
          />
        ) : (
          <DeployStep
            project={project}
            source={selectedSource}
            config={config}
            status={deployStatus}
            onBack={onBack}
            onRetry={onRetry}
            onSimulateFailure={onSimulateFailure}
          />
        )}
        <DeploymentSummary
          project={project}
          step={step}
          source={selectedSource}
          config={config}
          deployStatus={deployStatus}
          onContinue={onContinue}
          onOpenOverview={onOpenOverview}
          onRetry={onRetry}
        />
      </div>
    </div>
  );
}
