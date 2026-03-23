import { jsonPayload } from "@/lib/server/route-response";

export async function GET() {
  return jsonPayload({
    status: "ok",
    service: "@nexairon/frontend",
    timestamp: new Date().toISOString(),
  });
}
