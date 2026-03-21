"use client";

import { FormEvent, useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { KbCard } from "@/components/kb/kb-card";
import { useKbStore } from "@/stores/kb-store";

export default function DashboardPage() {
  const knowledgeBases = useKbStore((state) => state.knowledgeBases);
  const isLoading = useKbStore((state) => state.isLoading);
  const isCreating = useKbStore((state) => state.isCreating);
  const error = useKbStore((state) => state.error);
  const fetchKnowledgeBases = useKbStore((state) => state.fetchKnowledgeBases);
  const createKnowledgeBase = useKbStore((state) => state.createKnowledgeBase);
  const selectKnowledgeBase = useKbStore((state) => state.selectKnowledgeBase);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (knowledgeBases.length === 0) {
      void fetchKnowledgeBases();
    }
  }, [fetchKnowledgeBases, knowledgeBases.length]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedName = name.trim();
    const normalizedDescription = description.trim();

    if (!normalizedName) {
      setFormError("Knowledge base name is required.");
      return;
    }
    if (!normalizedDescription) {
      setFormError("Knowledge base description is required.");
      return;
    }

    try {
      await createKnowledgeBase({
        name: normalizedName,
        description: normalizedDescription,
      });
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } catch {
      // Error message is handled by store state.
    }
  };

  return (
    <Layout
      title="Knowledge Bases"
      description="Browse existing knowledge bases or create a new one."
      action={
        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white"
        >
          {showCreateForm ? "Close" : "New KB"}
        </button>
      }
    >
      <div className="space-y-4">
        {showCreateForm ? (
          <form
            onSubmit={handleCreate}
            className="rounded-2xl border border-ink/15 bg-panel p-5"
          >
            <h2 className="text-lg font-semibold">Create Knowledge Base</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Team Handbook"
                  className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Description</span>
                <input
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="A short summary for this knowledge base"
                  className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
                />
              </label>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-white disabled:opacity-60"
              >
                {isCreating ? "Creating..." : "Create"}
              </button>
              {formError ? (
                <p className="text-xs text-red-600">{formError}</p>
              ) : null}
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {isLoading ? (
          <section className="rounded-2xl border border-ink/15 bg-panel p-5 text-sm text-ink/70">
            Loading knowledge bases...
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {knowledgeBases.map((kb) => (
              <KbCard key={kb.id} kb={kb} onSelect={selectKnowledgeBase} />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}
