"use client";

import { KeyRound, Plus, Rocket, Terminal, Trash2 } from "lucide-react";
import { FRAMEWORK_LABELS, type DeploymentConfig, type DeploymentFramework } from "./pre-deploy-model";
import { TextField } from "./pre-deploy-shared";

export function ConfigureStep({
  config,
  onConfigChange,
  onAddVariable,
  onRemoveVariable,
  onUpdateVariable,
}: {
  config: DeploymentConfig;
  onConfigChange: <K extends keyof DeploymentConfig>(key: K, value: DeploymentConfig[K]) => void;
  onAddVariable: () => void;
  onRemoveVariable: (id: string) => void;
  onUpdateVariable: (id: string, field: "key" | "value", value: string) => void;
}) {
  return (
    <section className="deploy-config-panel" aria-labelledby="configure-title">
      <div className="deploy-section-heading">
        <h2 id="configure-title">Configure your deployment</h2>
        <p>Set the commands and runtime settings for this service.</p>
      </div>

      <div className="deploy-config-form">
        <div className="deploy-config-grid">
          <TextField label="Branch" value={config.branch} onChange={(value) => onConfigChange("branch", value)} />
          <label className="deploy-field">
            <span className="deploy-field__label">Framework</span>
            <select value={config.framework} onChange={(event) => onConfigChange("framework", event.target.value as DeploymentFramework)}>
              {Object.entries(FRAMEWORK_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <TextField label="Root directory" value={config.rootDirectory} onChange={(value) => onConfigChange("rootDirectory", value)} hint="Use / for the project root" />
          <TextField label="Port" value={config.port} onChange={(value) => onConfigChange("port", value)} />
        </div>

        <div className="deploy-command-grid">
          <label className="deploy-field">
            <span className="deploy-field__label"><Terminal size={13} strokeWidth={1.7} aria-hidden="true" />Build command</span>
            <input className="deploy-mono-input" value={config.buildCommand} onChange={(event) => onConfigChange("buildCommand", event.target.value)} />
          </label>
          <label className="deploy-field">
            <span className="deploy-field__label"><Rocket size={13} strokeWidth={1.7} aria-hidden="true" />Start command</span>
            <input className="deploy-mono-input" value={config.startCommand} onChange={(event) => onConfigChange("startCommand", event.target.value)} />
          </label>
        </div>

        <div className="deploy-env-section">
          <div className="deploy-env-heading">
            <div>
              <h3>Environment variables</h3>
              <p>Values are stored securely and injected during deploy.</p>
            </div>
            <KeyRound size={16} strokeWidth={1.7} aria-hidden="true" />
          </div>
          <div className="deploy-env-list">
            {config.envVariables.map((variable) => (
              <div className="deploy-env-row" key={variable.id}>
                <input aria-label="Variable name" placeholder="KEY" value={variable.key} onChange={(event) => onUpdateVariable(variable.id, "key", event.target.value)} />
                <input aria-label="Variable value" placeholder="value" value={variable.value} onChange={(event) => onUpdateVariable(variable.id, "value", event.target.value)} />
                <button type="button" className="deploy-icon-button" aria-label={`Remove ${variable.key || "environment variable"}`} onClick={() => onRemoveVariable(variable.id)}>
                  <Trash2 size={14} strokeWidth={1.7} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="deploy-add-variable" onClick={onAddVariable}>
            <Plus size={14} strokeWidth={1.9} aria-hidden="true" />
            Add variable
          </button>
        </div>

        <label className="deploy-toggle-row">
          <input type="checkbox" checked={config.autoDeploy} onChange={(event) => onConfigChange("autoDeploy", event.target.checked)} />
          <span className="deploy-toggle" aria-hidden="true"><span /></span>
          <span><strong>Auto deploy</strong><small>Deploy new commits from the selected branch automatically.</small></span>
        </label>
      </div>
    </section>
  );
}
