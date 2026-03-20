interface Props {
  content: string;
}

export function ChatResponse({ content }: Props) {
  return (
    <div className="rounded-xl border border-ink/20 bg-panel p-4">
      <p className="whitespace-pre-wrap text-sm leading-6">
        {content || "等待回答..."}
      </p>
    </div>
  );
}

