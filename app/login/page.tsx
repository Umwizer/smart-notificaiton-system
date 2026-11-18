"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/components/auth/AuthCard";
import { fmt } from "@/lib/utils";
import { isValidEmail, isValidPhone } from "@/lib/authService";

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const { signIn } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate format before hitting the database
    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      setError("Please enter a valid email address or Rwandan phone number (e.g. 078...).");
      return;
    }

    setBusy(true);
    const res = signIn(identifier, password);
    setBusy(false);

    if (!res.ok) {
      if (res.reason === "invalid") setError(fmt(t.auth.errors.attemptsLeft, { n: res.attemptsLeft }));
      if (res.reason === "locked") setError(fmt(t.auth.errors.locked, { m: res.minutesLeft }));
      if (res.reason === "suspended") setError(t.auth.errors.suspended);
      return;
    }

    if (res.needsMfa) {
      router.push("/security-code");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <AuthCard title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">{t.auth.identifierLabel}</label>
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink focus:ring-2 focus:ring-primary outline-none"
            placeholder="078... or email@domain.com"
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-ink">{t.auth.passwordLabel}</label>
            <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
              {t.auth.forgotPassword}
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink focus:ring-2 focus:ring-primary outline-none"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xs text-muted hover:text-primary"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 text-alert text-sm rounded border border-red-200">{error}</div>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition disabled:opacity-70"
        >
          {busy ? t.auth.signingIn : t.auth.signIn}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="text-primary font-semibold hover:underline">
          {t.auth.registerLink}
        </Link>
      </div>
    </AuthCard>
  );
}