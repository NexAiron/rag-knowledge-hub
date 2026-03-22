"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/lib/i18n/use-i18n";
import { useUserStore } from "@/stores/user-store";

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const register = useUserStore((state) => state.register);
  const isLoading = useUserStore((state) => state.isLoading);
  const storeError = useUserStore((state) => state.error);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (!email) return null;
    return emailRegExp.test(email) ? null : t("login.emailInvalid");
  }, [email, t]);

  const passwordError = useMemo(() => {
    if (!password) return null;
    return password.length >= 6 ? null : t("login.passwordInvalid");
  }, [password, t]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim();
    const normalizedPassword = password.trim();

    if (!normalizedName) {
      setFormError(t("register.nameRequired"));
      return;
    }
    if (!normalizedEmail || !normalizedPassword) {
      setFormError(t("login.emailRequired"));
      return;
    }
    if (!emailRegExp.test(normalizedEmail)) {
      setFormError(t("login.emailInvalid"));
      return;
    }
    if (normalizedPassword.length < 6) {
      setFormError(t("login.passwordInvalid"));
      return;
    }

    try {
      await register({
        name: normalizedName,
        email: normalizedEmail,
        password: normalizedPassword,
      });
      router.push("/dashboard");
    } catch {
      // Error is handled by store state.
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-[1480px] items-center px-5 py-8 lg:px-8">
      <section className="grid w-full overflow-hidden rounded-[36px] border border-white/45 bg-white/36 shadow-[0_40px_140px_rgba(29,36,51,0.16)] backdrop-blur-2xl xl:grid-cols-[1.02fr_0.98fr]">
        <div className="accent-panel relative overflow-hidden px-7 py-8 text-white lg:px-12 lg:py-12">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/78">
                {t("register.badge")}
              </span>
              <LanguageSwitcher />
            </div>

            <div className="mt-12 max-w-xl">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] lg:text-[4rem] lg:leading-[1.02]">
                {t("register.title")}
              </h1>
              <p className="mt-5 text-base leading-8 text-white/78 lg:max-w-lg">
                {t("register.subtitle")}
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">01</p>
                <p className="mt-2 text-sm font-medium text-white/88">Account</p>
                <p className="mt-2 text-xs leading-6 text-white/62">{t("login.tip1")}</p>
              </div>
              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">02</p>
                <p className="mt-2 text-sm font-medium text-white/88">Knowledge</p>
                <p className="mt-2 text-xs leading-6 text-white/62">{t("login.tip2")}</p>
              </div>
              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/56">03</p>
                <p className="mt-2 text-sm font-medium text-white/88">Pipeline</p>
                <p className="mt-2 text-xs leading-6 text-white/62">{t("login.tip3")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-7 py-8 lg:px-12 lg:py-12">
          <div className="ambient-card max-w-md rounded-[30px] p-6 lg:p-7">
            <h2 className="text-[1.85rem] font-semibold tracking-[-0.04em] text-ink">
              {t("register.panelTitle")}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">{t("register.panelSubtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-ink">{t("register.name")}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("register.namePlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3.5 text-sm text-ink outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(201,94,45,0.08)]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink">{t("login.email")}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("login.emailPlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3.5 text-sm text-ink outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(201,94,45,0.08)]"
                />
                {emailError ? <p className="mt-2 text-xs text-red-600">{emailError}</p> : null}
              </label>

              <label className="block">
                <span className="text-sm font-medium text-ink">{t("login.password")}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("login.passwordPlaceholder")}
                  className="mt-2 w-full rounded-[22px] border border-ink/12 bg-white px-4 py-3.5 text-sm text-ink outline-none transition focus:border-brand focus:shadow-[0_0_0_4px_rgba(201,94,45,0.08)]"
                />
                {passwordError ? (
                  <p className="mt-2 text-xs text-red-600">{passwordError}</p>
                ) : null}
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-[22px] bg-ink px-4 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(29,36,51,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? t("register.submitting") : t("register.submit")}
              </button>
            </form>

            {formError ? <p className="mt-4 text-xs text-red-600">{formError}</p> : null}
            {storeError ? <p className="mt-2 text-xs text-red-600">{storeError}</p> : null}

            <div className="mt-6 flex items-center justify-between border-t border-ink/8 pt-4 text-sm text-ink/62">
              <span>{t("register.hasAccount")}</span>
              <Link
                href="/login"
                className="font-semibold text-brand transition hover:text-ink"
              >
                {t("register.goLogin")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
