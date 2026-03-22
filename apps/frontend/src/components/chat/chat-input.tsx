"use client";

import { FormEvent, KeyboardEvent } from "react";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();

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
    <form onSubmit={handleSubmit} className="glass-panel rounded-[30px] p-4">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("chat.askPlaceholder")}
        className="h-28 w-full resize-none rounded-[22px] border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(120,174,235,0.16)]"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={isStreaming}
          className="rounded-2xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-ink/10 disabled:opacity-60"
        >
          {isStreaming ? t("chat.generating") : t("chat.send")}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand"
        >
          {t("chat.stop")}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-2xl border border-ink/20 bg-white/78 px-4 py-2 text-xs font-semibold transition hover:-translate-y-0.5 hover:border-brand"
        >
          {t("chat.clear")}
        </button>
      </div>
    </form>
  );
}
