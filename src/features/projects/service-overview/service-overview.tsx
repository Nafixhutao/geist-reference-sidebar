"use client";

import {
  Check,
  LoaderCircle,
  Plus,
  Rocket,
  Settings,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { useApplicationShell } from "@/components/application-shell";
import { PreDeployFlow } from "../pre-deploy/pre-deploy-flow";
import { RegionFlag } from "@/components/region-flag";
import type { Project } from "../types";
import { ServiceCanvas } from "./service-canvas";
import { ProjectPanel } from "./service-detail-panel";
import { AddServiceDialog, LogsDialog, SettingsDialog } from "./service-dialogs";
import { tabs, type TabLabel } from "./service-overview-model";
import { useServiceOverview } from "./use-service-overview";

export function ServiceOverview({ project }: { project: Project }) {
  const shell = useApplicationShell();
  const overview = useServiceOverview(project.id);
  const {
    services,
    selectedService,
    selectedServiceId,
    mobilePanelOpen,
    setMobilePanelOpen,
    deploymentStatus,
    deployProgress,
    updateServicePosition,
    activeTab,
    handleTabClick,
    addDialogOpen,
    setAddDialogOpen,
    settingsOpen,
    setSettingsOpen,
    logsOpen,
    setLogsOpen,
    logsService,
    handleNodeAction,
    handleAddChoice,
    startDeployment,
    updateServiceStatus,
    clearServices,
    loadDemoServices,
    isPreDeploy,
    preDeployStep,
    workflowMode,
    selectedSource,
    selectSource,
    deploymentConfig,
    updateDeploymentConfig,
    addEnvironmentVariable,
    removeEnvironmentVariable,
    updateEnvironmentVariable,
    preDeployStatus,
    handlePreDeployContinue,
    handlePreDeployBack,
    startPreDeploy,
    openServiceOverview,
    simulateFailedDeployment,
    handleHeaderDeploy,
    toast,
  } = overview;

  return (
    <div className="overview-page">
      <TopBar
        showSidebarToggle={false}
        onMenuClick={shell?.openSidebar}
        projectName={project.name}
        environment={project.environment}
      />

      <main>
        <header className="overview-header">
          <div className="overview-title-row">
            <div>
              <span className="overview-kicker">Project</span>
              <h1>{project.name}</h1>
              <p>
                {project.provider}
                <span aria-hidden="true">|</span>
                <RegionFlag country={project.regionCountry} />
                {project.region}
              </p>
            </div>
            <span className="environment-badge">{project.environment.toUpperCase()}</span>
          </div>

          <div className="overview-nav-row">
            <nav className="overview-tabs" aria-label="Project sections" role="tablist">
              {tabs.map(({ label, Icon }) => {
                const active = activeTab === label;
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`overview-tab ${active ? "overview-tab--active" : ""}`}
                    key={label}
                    onClick={() => handleTabClick(label)}
                  >
                    <Icon size={15} strokeWidth={1.7} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <div className="overview-actions">
              <button type="button" className="overview-button overview-button--primary" onClick={() => setAddDialogOpen(true)}>
                <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
                New service
              </button>
              <button
                type="button"
                className="overview-button"
                onClick={handleHeaderDeploy}
                disabled={isPreDeploy ? workflowMode === "source" ? !selectedSource : workflowMode === "deploy" : Boolean(deployProgress) || services.length === 0}
              >
                {isPreDeploy && workflowMode === "deploy" ? <LoaderCircle size={15} strokeWidth={1.8} className="spin" aria-hidden="true" /> : deployProgress ? <LoaderCircle size={15} strokeWidth={1.8} className="spin" aria-hidden="true" /> : <Rocket size={15} strokeWidth={1.7} aria-hidden="true" />}
                {isPreDeploy ? workflowMode === "deploy" ? `${preDeployStatus}…` : "Deploy" : deployProgress ? `${deployProgress.label} ${deployProgress.progress}%` : services.length ? "Redeploy" : "Deploy"}
              </button>
              <button type="button" className="overview-button" onClick={() => setSettingsOpen(true)}>
                <Settings size={15} strokeWidth={1.7} aria-hidden="true" />
                Settings
              </button>
            </div>
          </div>
        </header>

        {isPreDeploy ? (
          <PreDeployFlow
            project={project}
            step={preDeployStep}
            selectedSource={selectedSource}
            config={deploymentConfig}
            deployStatus={preDeployStatus}
            onSourceSelect={selectSource}
            onConfigChange={updateDeploymentConfig}
            onAddVariable={addEnvironmentVariable}
            onRemoveVariable={removeEnvironmentVariable}
            onUpdateVariable={updateEnvironmentVariable}
            onContinue={handlePreDeployContinue}
            onBack={handlePreDeployBack}
            onRetry={startPreDeploy}
            onOpenOverview={openServiceOverview}
            onSimulateFailure={simulateFailedDeployment}
          />
        ) : (
          <div className="overview-main-grid">
            <ServiceCanvas
              services={services}
              selectedServiceId={selectedServiceId}
              deploymentActive={Boolean(deployProgress)}
              onSelect={(id) => {
                overview.selectService(id);
                setMobilePanelOpen(true);
              }}
              onOpenAdd={() => setAddDialogOpen(true)}
              onUpdatePosition={updateServicePosition}
              onNodeAction={handleNodeAction}
            />

            {mobilePanelOpen ? <button type="button" className="panel-backdrop" aria-label="Close details panel" onClick={() => setMobilePanelOpen(false)} /> : null}
            <ProjectPanel
              project={project}
              services={services}
              selectedService={selectedService}
              deploymentStatus={deploymentStatus}
              mobileOpen={mobilePanelOpen}
              onClose={() => setMobilePanelOpen(false)}
              onOpenLogs={(id) => {
                overview.openLogs(id);
                setLogsOpen(true);
              }}
              onRedeploy={startDeployment}
              onSettings={() => setSettingsOpen(true)}
            />
          </div>
        )}
      </main>

      {toast ? (
        <div className="overview-toast" role="status">
          <Check size={14} strokeWidth={2} aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <AddServiceDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSelect={handleAddChoice} />
      <LogsDialog open={logsOpen} service={logsService} onClose={() => setLogsOpen(false)} />
      <SettingsDialog
        open={settingsOpen}
        selectedService={selectedService}
        onClose={() => setSettingsOpen(false)}
        onStatusChange={updateServiceStatus}
        onClear={clearServices}
        onLoadDemo={loadDemoServices}
      />
    </div>
  );
}

export type { TabLabel };
