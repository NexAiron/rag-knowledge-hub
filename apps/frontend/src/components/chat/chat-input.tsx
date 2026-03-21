"use client";

import { FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  isStreaming: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  onClear: () => void;
}

export function ChatInput({
  value,
  isStreaming,
  onChange,
  onSubmit,
  onStop,
  onClear,
}: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-ink/15 bg-panel p-4"
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your documents..."
        className="h-28 w-full resize-none rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isStreaming}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
        >
          {isStreaming ? "Generating..." : "Send"}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="rounded-lg border border-ink/20 px-4 py-2 text-xs font-medium"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-ink/20 px-4 py-2 text-xs font-medium"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
