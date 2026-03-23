import { clearAccessTokenCookie } from "@/lib/server/backend";
import { jsonAcknowledgement } from "@/lib/server/route-response";

export async function POST() {
  await clearAccessTokenCookie();

  return jsonAcknowledgement();
}
