import { NextResponse } from "next/server";
import type { KnowledgeBase } from "@/types";

const kbCollection: KnowledgeBase[] = [
  {
    id: "engineering-handbook",
    name: "Engineering Handbook",
    description: "Playbooks, deployment standards, and coding conventions.",
    documentCount: 26,
    updatedAt: "2026-03-18",
  },
  {
    id: "product-faq",
    name: "Product FAQ",
    description: "Common product questions and business process guides.",
    documentCount: 41,
    updatedAt: "2026-03-20",
  },
  {
    id: "support-playbook",
    name: "Support Playbook",
    description: "Support SOPs, ticket templates, and response policies.",
    documentCount: 19,
    updatedAt: "2026-03-19",
  },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  return NextResponse.json({
    data: kbCollection,
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    description?: string;
  };

  const name = body.name?.trim() ?? "";
  const description = body.description?.trim() ?? "";

  if (!name) {
    return NextResponse.json(
      { message: "Knowledge base name is required." },
      { status: 400 },
    );
  }

  if (!description) {
    return NextResponse.json(
      { message: "Knowledge base description is required." },
      { status: 400 },
    );
  }

  const baseId = slugify(name);
  const suffix = Date.now().toString(36);
  const id = `${baseId || "kb"}-${suffix}`;
  const now = new Date().toISOString().slice(0, 10);

  const created: KnowledgeBase = {
    id,
    name,
    description,
    documentCount: 0,
    updatedAt: now,
  };

  kbCollection.unshift(created);

  return NextResponse.json(
    {
      data: created,
      message: "Knowledge base created.",
    },
    { status: 201 },
  );
}
