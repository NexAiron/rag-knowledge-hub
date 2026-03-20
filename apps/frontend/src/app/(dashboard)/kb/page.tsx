import Link from "next/link";

const demoKbs = [
  { id: "kb_sales", name: "Sales Playbook", docs: 12 },
  { id: "kb_product", name: "Product Docs", docs: 34 },
];

export default function KnowledgeBaseListPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">知识库列表</h2>
      <div className="grid gap-3">
        {demoKbs.map((kb) => (
          <Link
            key={kb.id}
            href={`/kb/${kb.id}`}
            className="rounded-xl border border-ink/15 bg-panel p-4 hover:border-ink/40"
          >
            <p className="font-medium">{kb.name}</p>
            <p className="text-xs text-ink/70">文档数: {kb.docs}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

