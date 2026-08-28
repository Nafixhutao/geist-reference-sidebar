"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, Bot, ChevronDown, ChevronLeft, MessageSquare, Plus, X } from "lucide-react";
import { EASE_OUT, REDUCED_TRANSITION } from "@/lib/ease";
import { cn } from "@/lib/utils";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

const SUGGESTIONS = [
  "How is my token usage this cycle?",
  "Why is ops-monitor idle?",
  "Suggest a fix for high latency",
  "How do I deploy a new agent?",
];

const MODELS = ["claude-3.7-sonnet", "claude-3.5-sonnet", "claude-3.5-haiku"];

type HistoryItem = {
  id: string;
  title: string;
  time: string;
  messages: [ChatRole, string][];
};

const HISTORY: HistoryItem[] = [
  {
    id: "deploy",
    title: "Deploying a new agent",
    time: "2 days ago",
    messages: [
      ["user", "What does a deployment take?"],
      ["assistant", "Deploying an agent takes a model, a region, and an environment. Once created it appears in the table above with an active status and starts receiving requests."],
    ],
  },
  {
    id: "tokens",
    title: "Token usage this cycle",
    time: "3 days ago",
    messages: [
      ["user", "Show me my token usage"],
      ["assistant", "This cycle you've used 415.2K tokens — 32% of the 1M quota. support-agent is the top consumer at 320K, mostly from ticket replies."],
    ],
  },
  {
    id: "latency",
    title: "Fixing doc-writer latency",
    time: "5 days ago",
    messages: [
      ["user", "doc-writer is slow"],
      ["assistant", "doc-writer sits at 1,180 ms. Pin it to ap-southeast-1 or move it to claude-3.5-haiku to get under the 600 ms target."],
    ],
  },
];

function pickReply(text: string) {
  const normalized = text.toLowerCase();

  if (normalized.includes("token") || normalized.includes("usage")) {
    return "You've used 415.2K tokens this cycle — 32% of the 1M quota. support-agent is the top consumer at 320K, mostly from ticket replies. No headroom issues right now.";
  }
  if (normalized.includes("idle") || normalized.includes("ops")) {
    return "ops-monitor is idle because it had no requests in the last 24h. Your active agents are support-agent (1,284 requests) and code-reviewer (356), and you can resume ops-monitor from the table actions.";
  }
  if (normalized.includes("latency") || normalized.includes("slow")) {
    return "Average latency is 528 ms; doc-writer is the outlier at 1,180 ms. Pin it to ap-southeast-1 or switch it to a faster model like claude-3.5-haiku to get under the 600 ms target.";
  }
  if (normalized.includes("deploy") || normalized.includes("new")) {
    return "To deploy a new agent, hit \"New agent\" on the Agents page, pick a model and region, and it will be added to the list as active — usually inside a few seconds.";
  }
  return "I can help with agent deployments, token usage, latency, and statuses. Try one of the suggestions below or ask me anything about your agents.";
}

function TypingDots() {
  const reduce = useReducedMotion() ?? false;

  return (
    <span className="inline-flex items-center gap-1" role="status" aria-label="AI is typing">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-1.5 rounded-full bg-[var(--projects-muted)]"
          animate={reduce ? { opacity: 0.5 } : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={reduce ? {} : { duration: 0.9, repeat: Infinity, delay: index * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [model, setModel] = useState(MODELS[0]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef(1);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const send = (rawText = input) => {
    const text = rawText.trim();
    if (!text || typing) return;

    setInput("");
    setMessages((current) => [...current, { id: idRef.current++, role: "user", text }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((current) => [
        ...current,
        { id: idRef.current++, role: "assistant", text: pickReply(text) },
      ]);
    }, 900);
  };

  const openHistory = (item: HistoryItem) => {
    setActiveChat(item.id);
    setMessages(item.messages.map(([role, text]) => ({ id: idRef.current++, role, text })));
  };

  const newChat = () => {
    setActiveChat(null);
    setMessages([]);
    inputRef.current?.focus();
  };

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          aria-label="Chat with AI"
          whileTap={reduce ? undefined : { scale: 0.97 }}
          transition={REDUCED_TRANSITION}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex h-11 items-center gap-2 rounded-full border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] px-5 text-[13px] font-semibold leading-none text-white shadow-[0_8px_28px_rgba(0,115,75,0.45)] transition-colors hover:bg-[var(--projects-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--projects-accent)]/70"
        >
          <Bot size={17} strokeWidth={1.8} aria-hidden="true" />
          Chat with AI
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="AI chat"
            className="fixed inset-0 z-50 flex bg-[var(--projects-bg)]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0 }}
            transition={reduce ? REDUCED_TRANSITION : { duration: 0.18, ease: EASE_OUT }}
          >
            {/* Chat history rail */}
            <aside
              className={cn(
                "hidden w-[272px] shrink-0 flex-col border-r border-[var(--projects-divider)] bg-[var(--projects-control)]",
                historyOpen && "lg:flex",
              )}
            >
              <div className="p-3">
                <button
                  type="button"
                  onClick={newChat}
                  className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3 text-[13px] font-medium text-[var(--projects-text)] transition-colors hover:bg-white/[0.04]"
                >
                  <Plus size={15} strokeWidth={1.8} className="text-[var(--projects-muted)]" aria-hidden="true" />
                  New chat
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                <p className="m-0 px-2 pb-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--projects-muted)]">
                  Recent
                </p>
                <div className="space-y-0.5">
                  {/* current conversation */}
                  <button
                    type="button"
                    onClick={newChat}
                    aria-current={activeChat === null ? "page" : undefined}
                    className={cn(
                      "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors",
                      activeChat === null
                        ? "bg-white/[0.06] text-[var(--projects-text)]"
                        : "text-[var(--projects-muted)] hover:bg-white/[0.03] hover:text-[var(--projects-text)]",
                    )}
                  >
                    <MessageSquare size={14} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                    <span className="truncate">New chat</span>
                  </button>
                  {HISTORY.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openHistory(item)}
                      aria-current={activeChat === item.id ? "page" : undefined}
                      className={cn(
                        "flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors",
                        activeChat === item.id
                          ? "bg-white/[0.06] text-[var(--projects-text)]"
                          : "text-[var(--projects-muted)] hover:bg-white/[0.03] hover:text-[var(--projects-text)]",
                      )}
                    >
                      <MessageSquare size={14} strokeWidth={1.8} className="shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--projects-divider)] p-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] text-[var(--projects-muted)] transition-colors hover:bg-white/[0.03] hover:text-[var(--projects-text)]"
                >
                  <ChevronLeft size={14} strokeWidth={1.8} aria-hidden="true" />
                  Back to agents
                </button>
              </div>
            </aside>

            {/* Conversation */}
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--projects-divider)] px-4">
                <button
                  type="button"
                  onClick={() => setHistoryOpen((value) => !value)}
                  aria-label="Toggle chat history"
                  aria-expanded={historyOpen}
                  className="inline-flex size-9 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)] lg:hidden"
                >
                  <MessageSquare size={16} strokeWidth={1.8} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setModel((current) => MODELS[(MODELS.indexOf(current) + 1) % MODELS.length])}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3 text-[12px] font-medium text-[var(--projects-text)] transition-colors hover:border-[var(--projects-border-hover)]"
                >
                  <Bot size={14} strokeWidth={1.8} className="text-[var(--projects-accent)]" aria-hidden="true" />
                  {model}
                  <ChevronDown size={12} strokeWidth={1.8} className="text-[var(--projects-muted)]" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)]"
                >
                  <X size={17} strokeWidth={1.8} aria-hidden="true" />
                </button>
              </header>

              <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-[46rem] px-4 sm:px-6">
                  {messages.length === 0 ? (
                    <div className="mx-auto max-w-[38rem] pt-[16vh]">
                      <span className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--projects-border)] bg-[var(--projects-surface)] text-[var(--projects-accent)]">
                        <Bot size={22} strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <h2 className="m-0 mt-5 text-[26px] font-semibold leading-8 tracking-[-0.02em] text-[var(--projects-text)]">
                        What can I help with?
                      </h2>
                      <p className="m-0 mt-1.5 text-[14px] leading-5 text-[var(--projects-muted)]">
                        Ask about your agents, usage, latency, or deployments.
                      </p>
                      <div className="mt-6 grid gap-2 sm:grid-cols-2">
                        {SUGGESTIONS.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => send(suggestion)}
                            className="rounded-xl border border-[var(--projects-border)] bg-[var(--projects-surface)] px-3.5 py-3 text-left text-[13px] leading-5 text-[var(--projects-text)] transition-colors hover:border-[var(--projects-border-hover)] hover:bg-[var(--projects-control)]"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 py-6">
                      {messages.map((message) =>
                        message.role === "assistant" ? (
                          <div key={message.id} className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border-hover)] bg-[var(--projects-control)] text-[var(--projects-accent)]">
                              <Bot size={15} strokeWidth={1.8} aria-hidden="true" />
                            </span>
                            <p className="m-0 text-[15px] leading-[26px] text-[var(--projects-text)]">{message.text}</p>
                          </div>
                        ) : (
                          <div key={message.id} className="flex justify-end">
                            <p className="m-0 max-w-[85%] rounded-[22px] rounded-br-md bg-[#2f2f2f] px-4 py-2.5 text-[15px] leading-[26px] text-[var(--projects-text)]">
                              {message.text}
                            </p>
                          </div>
                        ),
                      )}
                      {typing && (
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--projects-border-hover)] bg-[var(--projects-control)] text-[var(--projects-accent)]">
                            <Bot size={15} strokeWidth={1.8} aria-hidden="true" />
                          </span>
                          <span className="rounded-md bg-[var(--projects-control)] px-3.5 py-3">
                            <TypingDots />
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0 px-4 pb-3 pt-2 sm:px-6">
                <div className="mx-auto w-full max-w-[46rem]">
                  <div className="flex items-end gap-2 rounded-[26px] border border-[var(--projects-border-hover)] bg-[var(--projects-control)] p-2.5 pl-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-colors focus-within:border-[var(--projects-accent-border)]">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          send();
                        }
                      }}
                      rows={1}
                      placeholder="Message your AI agent…"
                      aria-label="Chat message"
                      className="max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2 text-[14px] leading-6 text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)]"
                    />
                    <button
                      type="button"
                      aria-label="Send message"
                      onClick={() => send()}
                      disabled={!input.trim() || typing}
                      className={cn(
                        "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                        input.trim() && !typing
                          ? "bg-[var(--projects-accent-strong)] text-white hover:bg-[var(--projects-accent-hover)]"
                          : "bg-white/[0.07] text-[var(--projects-muted)]",
                      )}
                    >
                      <ArrowUp size={16} strokeWidth={2.2} aria-hidden="true" />
                    </button>
                  </div>
                  <p className="m-0 pt-2 text-center text-[11px] leading-4 text-[var(--projects-muted)]">
                    AI can make mistakes. Review important information before acting.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
