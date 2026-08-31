import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  FileDiff,
  FolderGit2,
  GitBranch,
  ListChecks,
  LoaderCircle,
  MessageSquare,
  MoreVertical,
  Play,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent, FileChange, WorkspaceMessage, WorkspaceTab } from "../types";
import { buildRunChanges, buildRunSteps, buildSeedMessages, nowTime } from "../data";
import { AgentStatusDot } from "../components/agent-status";
import { AgentChat } from "./agent-chat";
import { AgentComposer } from "./agent-composer";
import { AgentActivity } from "./agent-activity";
import { AgentSettings } from "./agent-settings";
import { AgentTasks } from "./agent-tasks";
import { ChangesSummary } from "./changes-summary";

const TABS: Array<{ id: WorkspaceTab; label: string; Icon: typeof MessageSquare }> = [
  { id: "chat", label: "Chat", Icon: MessageSquare },
  { id: "tasks", label: "Tasks", Icon: ListChecks },
  { id: "changes", label: "Changes", Icon: FileDiff },
  { id: "activity", label: "Activity", Icon: Activity },
  { id: "settings", label: "Settings", Icon: Settings2 },
];

export function AgentWorkspace({
  agent,
  onAgentChange,
}: {
  agent: Agent;
  onAgentChange: (agent: Agent) => void;
}) {
  const [tab, setTab] = useState<WorkspaceTab>("chat");
  const [messages, setMessages] = useState<WorkspaceMessage[]>(() => buildSeedMessages());
  const [runningId, setRunningId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const runningRef = useRef(false);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, []);

  useEffect(() => {
    if (tab === "chat") scrollToBottom();
  }, [messages, tab, scrollToBottom]);

  const startRun = useCallback((prompt: string) => {
    if (runningRef.current) return;
    runningRef.current = true;

    const steps = buildRunSteps();
    const runId = `msg-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-u`, role: "user", text: prompt, time: nowTime() },
      { id: runId, role: "agent", text: "On it — I'll inspect the relevant files and make the change.", time: nowTime(), status: "running", steps },
    ]);
    setRunningId(runId);

    let delay = 650;
    steps.forEach((_, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setMessages((prev) =>
            prev.map((message) => {
              if (message.id !== runId || message.role !== "agent") return message;
              return {
                ...message,
                steps: message.steps.map((step, stepIndex) =>
                  stepIndex === index ? { ...step, status: "done" } : step,
                ),
              };
            }),
          );
        }, delay),
      );
      delay += 850;
    });

    timersRef.current.push(
      window.setTimeout(() => {
        setMessages((prev) =>
          prev.map((message) => {
            if (message.id !== runId || message.role !== "agent") return message;
            const changes: FileChange[] = buildRunChanges();
            return { ...message, status: "completed", changes } satisfies WorkspaceMessage;
          }),
        );
        setRunningId(null);
        runningRef.current = false;
      }, delay + 350),
    );
  }, []);

  const handleSend = (text: string) => {
    startRun(text);
  };

  const handleRunAgent = () => {
    startRun(agent.currentTask ? `Run the current task: ${agent.currentTask}` : "Inspect the project and suggest improvements.");
  };

  const handleDiscard = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) => (message.id === messageId && message.role === "agent" ? { ...message, changes: undefined } : message)),
    );
  };

  const latestChanges = (() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (message.role === "agent" && message.changes && message.changes.length > 0) {
        return { changes: message.changes, messageId: message.id };
      }
    }
    return null;
  })();

  const isRunning = runningId !== null;

  return (
    <div className="flex h-dvh flex-col bg-[var(--projects-bg)] text-[var(--projects-text)]">
      <div className="shrink-0 border-b border-[var(--projects-border)] px-4 pt-14 sm:px-6 lg:px-7 lg:pt-6">
        <Link
          href="/agent"
          className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--projects-muted)] transition-colors hover:text-[var(--projects-text)]"
        >
          <ArrowLeft size={14} strokeWidth={1.8} aria-hidden="true" />
          Agents
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3 pb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="m-0 truncate text-[22px] font-semibold leading-7 tracking-[-0.02em]">{agent.name}</h1>
              <AgentStatusDot status={agent.status} withLabel />
            </div>
            <div className="projects-mono mt-1.5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-[var(--projects-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <FolderGit2 size={12} strokeWidth={1.7} aria-hidden="true" />
                {agent.project}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitBranch size={12} strokeWidth={1.7} aria-hidden="true" />
                {agent.branch}
              </span>
            </div>
          </div>

          <div className="flex w-full shrink-0 items-center gap-2 lg:w-auto">
            <button
              type="button"
              onClick={handleRunAgent}
              disabled={isRunning}
              className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-3.5 text-[13px] font-semibold leading-none text-white transition-colors hover:bg-[var(--projects-accent-hover)] disabled:cursor-default disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--projects-accent)]/70 lg:w-auto"
            >
              {isRunning ? (
                <LoaderCircle size={14} strokeWidth={2} className="animate-spin" aria-hidden="true" />
              ) : (
                <Play size={14} strokeWidth={1.8} aria-hidden="true" />
              )}
              {isRunning ? "Running…" : "Run Agent"}
            </button>

            <div className="relative" data-workspace-menu>
              <button
                type="button"
                aria-label="Workspace actions"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border)] text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]"
              >
                <MoreVertical size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-1 w-40 rounded-[10px] border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-1 shadow-xl shadow-black/30"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setTab("settings");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs leading-4 text-[var(--projects-text)] transition-colors hover:bg-[var(--projects-control)]"
                  >
                    <Settings2 size={13} strokeWidth={1.8} aria-hidden="true" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-[var(--projects-divider)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-[13px] transition-colors",
                  active ? "font-medium text-[var(--projects-text)]" : "text-[var(--projects-muted)] hover:text-[var(--projects-text)]",
                )}
              >
                <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
                {label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[var(--projects-accent)]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        {tab === "chat" && (
          <AgentChat
            agent={agent}
            messages={messages}
            onReview={() => setTab("changes")}
            onDiscard={handleDiscard}
          />
        )}
        {tab === "tasks" && <AgentTasks agent={agent} />}
        {tab === "changes" && (
          <div className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6">
            {latestChanges ? (
              <>
                <ChangesSummary
                  changes={latestChanges.changes}
                  onReview={() => {
                    setTab("chat");
                    requestAnimationFrame(scrollToBottom);
                  }}
                  onDiscard={() => handleDiscard(latestChanges.messageId)}
                />
                <p className="m-0 mt-3 text-[12px] leading-4 text-[var(--projects-muted)]">
                  Mock changes from the latest run — nothing is written to disk.
                </p>
              </>
            ) : (
              <p className="m-0 text-[13.5px] text-[var(--projects-muted)]">
                No changes yet — run the agent to see file changes here.
              </p>
            )}
          </div>
        )}
        {tab === "activity" && <AgentActivity agent={agent} />}
        {tab === "settings" && <AgentSettings agent={agent} onAgentChange={onAgentChange} />}
      </div>

      {tab === "chat" && <AgentComposer model={agent.model} disabled={isRunning} onSend={handleSend} />}
    </div>
  );
}
