"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildProject, type NewProjectInput } from "./projectStore";
import type { Project } from "./types";

const PROVIDERS = ["AWS", "Google Cloud", "Vercel"] as const;
const REGIONS = [
  { value: "ap-southeast-1", label: "ap-southeast-1 · Singapore" },
  { value: "ap-southeast-3", label: "ap-southeast-3 · Indonesia" },
] as const;
const ENVIRONMENTS = ["production", "staging", "development"] as const;
const PLANS = ["NANO", "MICRO", "STANDARD", "PRO"] as const;

const fieldClass =
  "h-10 w-full rounded-md border border-[var(--projects-border)] bg-[var(--projects-control)] px-3 text-[13px] leading-4 text-[var(--projects-text)] outline-none transition-colors focus:border-[var(--projects-border-hover)]";
const labelClass = "mb-1.5 block text-[12px] font-medium text-[var(--projects-muted)]";

type NewProjectDialogProps = {
  open: boolean;
  onClose: () => void;
  existingIds: string[];
  onCreate: (project: Project) => void;
};

export function NewProjectDialog({ open, onClose, existingIds, onCreate }: NewProjectDialogProps) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<string>(PROVIDERS[0]);
  const [region, setRegion] = useState<string>(REGIONS[0].value);
  const [environment, setEnvironment] = useState<string>(ENVIRONMENTS[0]);
  const [plan, setPlan] = useState<string>(PLANS[0]);
  const [status, setStatus] = useState<Project["status"]>("active");

  useEffect(() => {
    if (!open) return;
    setName("");
    setProvider(PROVIDERS[0]);
    setRegion(REGIONS[0].value);
    setEnvironment(ENVIRONMENTS[0]);
    setPlan(PLANS[0]);
    setStatus("active");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    const input: NewProjectInput = { name, provider, region, environment, plan, status };
    onCreate(buildProject(input, existingIds));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
        className="relative w-full max-w-md rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-5 shadow-2xl shadow-black/40"
      >
        <h2
          id="new-project-title"
          className="m-0 flex items-center gap-2 text-[16px] font-semibold leading-5 text-[var(--projects-text)]"
        >
          <Plus size={16} strokeWidth={1.8} className="text-[var(--projects-accent)]" aria-hidden="true" />
          New project
        </h2>
        <p className="m-0 mt-1 text-[13px] leading-5 text-[var(--projects-muted)]">
          Create a new project to manage its infrastructure.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <label className="block">
            <span className={labelClass}>Project name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              required
              placeholder="e.g. my_app"
              className={fieldClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Provider</span>
              <select value={provider} onChange={(event) => setProvider(event.target.value)} className={fieldClass}>
                {PROVIDERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)} className={fieldClass}>
                {REGIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={labelClass}>Environment</span>
              <select
                value={environment}
                onChange={(event) => setEnvironment(event.target.value)}
                className={fieldClass}
              >
                {ENVIRONMENTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Plan</span>
              <select value={plan} onChange={(event) => setPlan(event.target.value)} className={fieldClass}>
                {PLANS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className={labelClass}>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as Project["status"])}
              className={cn(fieldClass, "cursor-pointer")}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </label>

          <div className="mt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center rounded-[10px] border border-[var(--projects-border)] px-4 text-[13px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-[10px] border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--projects-accent-hover)]"
            >
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
