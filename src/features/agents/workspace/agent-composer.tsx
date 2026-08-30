import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

/** Developer-style prompt composer — attach context, model chip, send. */
export function AgentComposer({
  model,
  disabled,
  onSend,
}: {
  model: string;
  disabled?: boolean;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="shrink-0 border-t border-[var(--projects-divider)] bg-[var(--projects-bg)] px-4 pb-3 pt-3 sm:px-6">
      <div className="mx-auto w-full max-w-[760px]">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex items-end gap-1.5 rounded-xl border border-[var(--projects-border)] bg-[var(--projects-card-bg)] p-2 transition-colors focus-within:border-[var(--projects-border-hover)]",
            disabled && "opacity-70",
          )}
        >
          <button
            type="button"
            aria-label="Attach context"
            title="Attach context"
            disabled={disabled}
            onClick={() => setText((prev) => (prev.includes("@AGENTS.md") ? prev : `${prev}${prev ? " " : ""}@AGENTS.md`))}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--projects-muted)] transition-colors hover:bg-white/[0.05] hover:text-[var(--projects-text)] disabled:pointer-events-none"
          >
            <Paperclip size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask this agent to work on your project..."
            aria-label="Prompt"
            className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-[13.5px] leading-[20px] text-[var(--projects-text)] outline-none placeholder:text-[var(--projects-muted)]"
          />

          <span
            className="projects-mono hidden h-9 shrink-0 items-center rounded-lg border border-[var(--projects-border)] px-2 text-[11px] leading-none text-[var(--projects-muted)] sm:inline-flex"
            title="Model"
          >
            {model}
          </span>

          <button
            type="submit"
            aria-label="Send prompt"
            disabled={disabled || !text.trim()}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--projects-accent-border)] bg-[var(--projects-accent-strong)] text-white transition-colors hover:bg-[var(--projects-accent-hover)] disabled:cursor-default disabled:opacity-50"
          >
            <Send size={15} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </form>
        <p className="m-0 mt-1.5 text-center text-[11px] leading-4 text-[var(--projects-muted)]">
          Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}
