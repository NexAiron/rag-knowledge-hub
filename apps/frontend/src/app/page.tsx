import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ACCESS_TOKEN_COOKIE = "access_token";

export default async function HomePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (accessToken) {
    redirect("/dashboard");
  }

  redirect("/login");
}
