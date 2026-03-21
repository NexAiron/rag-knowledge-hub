import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = body.email?.trim() ?? "";
  const password = body.password?.trim() ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    token: "mock-jwt-token",
    user: {
      id: `u-${Date.now()}`,
      name: email.split("@")[0],
      email,
    },
  });
}
