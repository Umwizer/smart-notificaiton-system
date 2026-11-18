"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { registerResident } from "@/lib/authService";
import AuthCard from "@/components/auth/AuthCard";
import PasswordStrength from "@/components/auth/PasswordStrength";
import { checkPassword } from "@/lib/password";
import { AREAS } from "@/lib/bugesera";

export default function RegisterPage() {
  const { t, lang } = useLang();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "", phone: "", email: "", sector: "", cell: "", village: "", password: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const passwordCheck = checkPassword(form.password);

  const sectors = Object.keys(AREAS);
  const cells = form.sector ? Object.keys(AREAS[form.sector]) : [];
  const villages = form.sector && form.cell ? AREAS[form.sector][form.cell] : [];

  function update(field: keyof typeof form, val: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "sector") { next.cell = ""; next.village = ""; }
      if (field === "cell") { next.village = ""; }
      return next;
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!passwordCheck.valid) {
      setError("Password does not meet requirements.");
      return;
    }

    setBusy(true);
    const res = registerResident({
      ...form,
      language: lang as "en" | "rw"
    });
    setBusy(false);

    if (!res.ok) {
      if (res.error === "phoneTaken") setError(t.auth.errors.phoneTaken);
      if (res.error === "emailTaken") setError(t.auth.errors.emailTaken);
      return;
    }

    router.push("/login");
  }

  return (
    <AuthCard title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.nameLabel}</label>
            <input required value={form.name} onChange={e => update("name", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.phoneLabel}</label>
            <input required value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="078..." className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.emailLabel}</label>
            <input type="email" value={form.email} onChange={e => update("email", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.sectorLabel}</label>
            <select required value={form.sector} onChange={e => update("sector", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select...</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.cellLabel}</label>
            <select required disabled={!form.sector} value={form.cell} onChange={e => update("cell", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              <option value="">Select...</option>
              {cells.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.villageLabel}</label>
            <select required disabled={!form.cell} value={form.village} onChange={e => update("village", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
              <option value="">Select...</option>
              {villages.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.passwordLabel}</label>
            <input type="password" required value={form.password} onChange={e => update("password", e.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" />
            <PasswordStrength password={form.password} />
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 text-alert text-sm rounded border border-red-200">{error}</div>}

        <button type="submit" disabled={busy || !passwordCheck.valid} className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition disabled:opacity-50 mt-4">
          {busy ? t.auth.creatingAccount : t.auth.createAccount}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted">
        {t.auth.alreadyHave}{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          {t.auth.loginLink}
        </Link>
      </div>
    </AuthCard>
  );
}