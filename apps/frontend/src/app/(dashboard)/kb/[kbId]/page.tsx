interface Props {
  params: { kbId: string };
}

export default function KnowledgeBaseDetailPage({ params }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">知识库详情</h2>
      <div className="rounded-xl border border-ink/15 bg-panel p-5">
        <p className="text-sm text-ink/70">KB ID</p>
        <p className="font-mono text-sm">{params.kbId}</p>
      </div>
    </section>
  );
}

