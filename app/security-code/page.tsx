"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getOtp, verifyOtp } from "@/lib/otp";
import AuthCard from "@/components/auth/AuthCard";
import { fmt } from "@/lib/utils";

export default function SecurityCodePage() {
  const { t } = useLang();
  const router = useRouter();
  const { startSession } = useAuth(); 

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const otp = getOtp("mfa");
      if (otp) setDemoCode(otp.code);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = verifyOtp("mfa", code);
    
    if (res.status === "wrong") {
      setError(fmt(t.auth.errors.wrongCode, { n: res.attemptsLeft }));
      return;
    }
    if (res.status === "expired") {
      setError(t.auth.errors.codeExpired);
      return;
    }
    if (res.status === "locked") {
      setError(t.auth.errors.codeLocked);
      return;
    }

    if (res.status === "ok") {
      const payload = getOtp("mfa")?.payload as { userId: string };
      if (payload?.userId) {
        const user = startSession(payload.userId);
        if (user) {
          router.push("/dashboard");
        }
      }
    }
  }

  return (
    <AuthCard title={t.auth.securityTitle} subtitle={t.auth.securitySubtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">{t.auth.codeLabel}</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-2xl tracking-[0.5em] rounded-md border border-line bg-white px-3 py-3 text-ink outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••"
          />
        </div>

        {error && <div className="p-3 bg-red-50 text-alert text-sm rounded border border-red-200">{error}</div>}

        <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition">
          {t.auth.verify}
        </button>
      </form>

      {demoCode && (
        <div className="mt-6 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded text-center">
          {fmt(t.auth.demoCode, { code: demoCode })}
        </div>
      )}
    </AuthCard>
  );
}