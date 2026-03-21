import type { SourceChunk } from "@/types";

const encoder = new TextEncoder();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function toSSE(event: string, payload: string): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${payload}\n\n`);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    kbId?: string;
    sessionId?: string;
    question?: string;
  };

  const kbId = body.kbId?.trim() ?? "";
  const sessionId = body.sessionId?.trim() ?? "";
  const question = body.question?.trim() ?? "";

  if (!kbId || !sessionId || !question) {
    return new Response("kbId, sessionId and question are required.", {
      status: 400,
    });
  }

  const answer =
    `### Analysis\n` +
    `You asked: **${question}**\n\n` +
    `Based on KB \`${kbId}\`, here is a concise response:\n` +
    `1. The system retrieves relevant chunks.\n` +
    `2. The model synthesizes them into a final answer.\n` +
    `3. You can inspect references in the right panel.\n\n` +
    `> Session: ${sessionId}`;

  const sources: SourceChunk[] = [
    {
      id: "source-1",
      doc: "retrieval-overview.md",
      content:
        "Retrieval pipeline: query rewrite, vector search, and reranking before generation.",
      page: "12",
    },
    {
      id: "source-2",
      doc: "qa-policy.md",
      content:
        "Responses should remain grounded in indexed documents and include source transparency.",
      page: "4",
    },
  ];

  // Emit one character per token for a natural typewriter effect on the client.
  const tokens = Array.from(answer);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (let index = 0; index < tokens.length; index += 1) {
          controller.enqueue(toSSE("token", tokens[index]));
          await sleep(12);
        }

        controller.enqueue(toSSE("sources", JSON.stringify(sources)));
        controller.enqueue(toSSE("done", "ok"));
        controller.close();
      } catch {
        controller.enqueue(toSSE("error", "Failed during streaming."));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
