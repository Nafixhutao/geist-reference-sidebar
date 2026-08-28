"use client";

import {
  Check,
  CloudUpload,
  Code2,
  Database,
  LayoutTemplate,
} from "lucide-react";
import { DEPLOY_STEPS, type PreDeployStep, type SourceDefinition } from "./pre-deploy-model";

export function SourceIcon({ source, size = "md" }: { source: SourceDefinition; size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? 22 : 26;

  if (source.icon) {
    return (
      <span className={`deploy-source-icon deploy-source-icon--${size}`}>
        <img src={source.icon} alt="" aria-hidden="true" />
      </span>
    );
  }

  const Icon = source.iconType === "upload"
    ? CloudUpload
    : source.iconType === "template"
      ? LayoutTemplate
      : Database;

  return (
    <span className={`deploy-source-icon deploy-source-icon--${size} deploy-source-icon--lucide`}>
      <Icon size={iconSize} strokeWidth={1.55} aria-hidden="true" />
    </span>
  );
}

export function RuntimeIcon({ runtime }: { runtime: { icon?: string; iconType?: "html" } }) {
  if (runtime.icon) {
    return (
      <span className="runtime-badge__icon">
        <img src={runtime.icon} alt="" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="runtime-badge__icon runtime-badge__icon--html">
      <Code2 size={15} strokeWidth={1.7} aria-hidden="true" />
    </span>
  );
}

export function DeployStepper({ currentStep }: { currentStep: PreDeployStep }) {
  const currentIndex = DEPLOY_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <ol className="deploy-stepper" aria-label="Deployment progress">
      {DEPLOY_STEPS.map((step, index) => {
        const complete = index < currentIndex;
        const active = index === currentIndex;

        return (
          <li key={step.id} className={`deploy-stepper__item ${active ? "is-active" : ""} ${complete ? "is-complete" : ""}`}>
            <span className="deploy-stepper__marker" aria-hidden="true">
              {complete ? <Check size={14} strokeWidth={2.2} /> : step.number}
            </span>
            <span className="deploy-stepper__label">{step.label}</span>
            {index < DEPLOY_STEPS.length - 1 ? <span className="deploy-stepper__line" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={`deploy-field ${className}`}>
      <span className="deploy-field__label">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function SummaryRow({ label, children, muted = false }: { label: string; children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="deploy-summary-row">
      <dt>{label}</dt>
      <dd className={muted ? "is-muted" : ""}>{children}</dd>
    </div>
  );
}
