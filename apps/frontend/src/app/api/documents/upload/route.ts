import { NextResponse } from "next/server";
import { createDocument } from "@/lib/mock/documents-db";

function resolveFileType(fileName: string): "pdf" | "md" | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".md")) return "md";
  return null;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const kbId = String(formData.get("kbId") ?? "").trim();
  const file = formData.get("file");

  if (!kbId) {
    return NextResponse.json({ message: "kbId is required." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "File is required." }, { status: 400 });
  }

  const fileType = resolveFileType(file.name);
  if (!fileType) {
    return NextResponse.json(
      { message: "Only PDF and Markdown files are supported." },
      { status: 400 },
    );
  }

  const created = createDocument({
    kbId,
    fileName: file.name,
    fileType,
    size: file.size,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
