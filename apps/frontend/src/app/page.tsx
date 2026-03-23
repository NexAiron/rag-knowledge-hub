import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_TOKEN_COOKIE,
  DEFAULT_AUTHENTICATED_REDIRECT,
} from "@/lib/auth/routes";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    redirect(DEFAULT_AUTHENTICATED_REDIRECT);
  }

  redirect("/login");
}
