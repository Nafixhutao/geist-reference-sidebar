"use client";

import { ChevronRight, Plus } from "lucide-react";
import { RUNTIME_BADGES, SOURCE_DEFINITIONS, type DeploymentSourceId } from "./pre-deploy-model";
import { RuntimeIcon, SourceIcon } from "./pre-deploy-shared";

export function SourceStep({
  selectedSource,
  onSelect,
}: {
  selectedSource: DeploymentSourceId | null;
  onSelect: (source: DeploymentSourceId) => void;
}) {
  const primarySources = SOURCE_DEFINITIONS.slice(0, 4);
  const databaseSources = SOURCE_DEFINITIONS.slice(4);

  return (
    <section className="deploy-source-panel" aria-labelledby="source-title">
      <div className="deploy-section-heading">
        <h2 id="source-title">Choose a deployment source</h2>
        <p>Start by connecting a source or choose a template to deploy.</p>
      </div>

      <div className="deploy-source-list" role="list">
        {primarySources.map((source) => {
          const selected = selectedSource === source.id;
          return (
            <button
              type="button"
              role="listitem"
              className={`deploy-source-option ${selected ? "is-selected" : ""}`}
              key={source.id}
              aria-pressed={selected}
              onClick={() => onSelect(source.id)}
            >
              <SourceIcon source={source} />
              <span className="deploy-source-option__copy">
                <strong>{source.label}</strong>
                <small>{source.description}</small>
              </span>
              {source.recommended ? <span className="deploy-recommended">Recommended</span> : null}
              <ChevronRight className="deploy-source-option__chevron" size={17} strokeWidth={1.65} aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="deploy-database-section">
        <div className="deploy-database-heading">
          <span>Or deploy a database</span>
          <span aria-hidden="true" />
        </div>
        <div className="deploy-database-options" role="list" aria-label="Database sources">
          {databaseSources.map((source) => {
            const selected = selectedSource === source.id;
            return (
              <button
                type="button"
                role="listitem"
                key={source.id}
                className={`deploy-database-option ${selected ? "is-selected" : ""}`}
                aria-pressed={selected}
                onClick={() => onSelect(source.id)}
              >
                <SourceIcon source={source} size="sm" />
                <span>{source.label}</span>
                <Plus size={14} strokeWidth={1.8} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="runtime-section">
        <span className="runtime-section__label">Popular frameworks</span>
        <div className="runtime-badges" aria-label="Popular frameworks">
          {RUNTIME_BADGES.map((runtime) => (
            <span className="runtime-badge" key={runtime.label}>
              <RuntimeIcon runtime={runtime} />
              {runtime.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
