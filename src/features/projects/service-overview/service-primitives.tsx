"use client";

import { serviceIcon, statusLabel, type ServiceKind, type ServiceStatus } from "./service-overview-model";

export function TechnologyLogo({ kind, src, size = "md" }: { kind?: ServiceKind; src?: string; size?: "sm" | "md" | "lg" }) {
  const iconSource = src ?? (kind ? serviceIcon(kind) : undefined);
  if (!iconSource) return null;

  return (
    <span className={`technology-logo technology-logo--${size}`}>
      <img src={iconSource} alt="" aria-hidden="true" />
    </span>
  );
}

export function StatusPill({ status, compact = false }: { status: ServiceStatus; compact?: boolean }) {
  return (
    <span className={`service-status service-status--${status} ${compact ? "service-status--compact" : ""}`}>
      <span className="service-status__dot" aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}

export function DetailRow({ label, children, mono = false }: { label: string; children: React.ReactNode; mono?: boolean }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd className={mono ? "detail-row__mono" : ""}>{children}</dd>
    </div>
  );
}
