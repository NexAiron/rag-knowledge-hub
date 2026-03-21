"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const storeError = useUserStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    return emailRegExp.test(email) ? null : "Please enter a valid email address.";
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return password.length >= 6 ? null : "Password must be at least 6 characters.";
  }, [password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setFormError("Email and password are required.");
      return;
    }
    if (!emailRegExp.test(normalizedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (normalizedPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      await login({
        email: normalizedEmail,
        password: normalizedPassword,
      });
      router.push("/dashboard");
    } catch {
      // Error message is stored in userStore.error.
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6">
      <section className="w-full rounded-2xl border border-ink/15 bg-panel p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Sign In</h1>
        <p className="mt-2 text-sm text-ink/70">
          Enter your email and password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
            />
            {emailError ? (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand"
            />
            {passwordError ? (
              <p className="mt-1 text-xs text-red-600">{passwordError}</p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {formError ? <p className="mt-3 text-xs text-red-600">{formError}</p> : null}
        {storeError ? (
          <p className="mt-1 text-xs text-red-600">{storeError}</p>
        ) : null}
      </section>
    </main>
  );
}
