"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  MapPin,
  Menu,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "../context/LanguageContext";

// One icon per service, in the same order as translations.services.items
const serviceIcons: LucideIcon[] = [
  Bell,
  MapPin,
  ClipboardCheck,
  Smartphone,
  BarChart3,
  MessageSquare,
  FileText,
  ShieldCheck,
];

const sectionLinks = ["about", "services", "how", "benefits", "contact"] as const;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const { lang, setLang, t } = useLang();

  function handleContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  }

  const inputClass =
    "mt-1 min-h-11 w-full rounded border border-line bg-white px-3 text-base";

  return (
    <div>
      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="flex h-1.5" aria-hidden="true">
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-sun" />
          <div className="flex-1 bg-flag-green" />
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-primary text-white">
              <Bell size={20} aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-base font-semibold sm:text-lg">
                {t.brand}
              </span>
              <span className="block text-xs text-muted">{t.district}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label={t.aria.main}>
            {sectionLinks.map((id) => (
              <a key={id} href={`#${id}`} className="hover:underline">
                {t.nav[id]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="flex overflow-hidden rounded border border-line"
              role="group"
              aria-label={t.nav.language}
            >
              {(["en", "rw"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-pressed={lang === code}
                  className={`min-h-11 min-w-11 px-3 text-sm font-semibold ${
                    lang === code ? "bg-primary text-white" : "bg-white hover:bg-paper"
                  }`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="hidden min-h-11 items-center rounded bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark sm:inline-flex"
            >
              {t.nav.login}
            </Link>

            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-line lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={t.nav.menu}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-line bg-white px-4 py-2 lg:hidden" aria-label={t.aria.mobile}>
            {sectionLinks.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-base"
              >
                {t.nav[id]}
              </a>
            ))}
            <Link href="/login" className="block py-3 text-base font-semibold text-primary">
              {t.nav.login}
            </Link>
          </nav>
        )}
      </header>

      <main>
        {/* ---------- Hero ---------- */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{t.hero.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center rounded bg-primary px-6 font-semibold text-white hover:bg-primary-dark"
              >
                {t.nav.login}
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center rounded border border-primary px-6 font-semibold text-primary hover:bg-white"
              >
                {t.nav.register}
              </Link>
            </div>
          </div>

          <div
            className="rounded-lg border border-line bg-white p-5 shadow-sm"
            aria-label={t.hero.sampleLabel}
          >
            <p className="mb-3 text-xs text-muted">{t.hero.sampleLabel}</p>
            <div className="border-l-4 border-alert pl-4">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded bg-primary px-2 py-0.5 text-white">{t.hero.category}</span>
                <span className="rounded bg-alert px-2 py-0.5 text-white">{t.hero.priority}</span>
              </div>
              <h2 className="mt-3 font-heading text-xl font-semibold">{t.hero.noticeTitle}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={16} aria-hidden="true" />
                {t.hero.target}
              </p>
            </div>
            <ol className="mt-5 flex items-center gap-2 text-xs">
              <li className="rounded bg-paper px-2 py-1 text-muted">{t.hero.draft}</li>
              <li aria-hidden="true" className="h-px flex-1 bg-line" />
              <li className="rounded bg-paper px-2 py-1 text-muted">{t.hero.pending}</li>
              <li aria-hidden="true" className="h-px flex-1 bg-line" />
              <li className="rounded bg-primary px-2 py-1 font-semibold text-white">
                {t.hero.published}
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="scroll-mt-24 border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-semibold">{t.about.title}</h2>
              <p className="mt-4 max-w-prose leading-relaxed text-muted">{t.about.text}</p>
            </div>
            <ul className="divide-y divide-line self-center border-y border-line">
              {t.about.points.map((p) => (
                <li key={p} className="flex items-center gap-3 py-4">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sun" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
          <h2 className="font-heading text-3xl font-semibold">{t.services.title}</h2>
          <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.items.map((item, i) => {
              const Icon = serviceIcons[i];
              return (
                <div key={item.title} className="border-t-4 border-primary pt-4">
                  <Icon size={24} className="text-primary" aria-hidden="true" />
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section id="how" className="scroll-mt-24 border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="font-heading text-3xl font-semibold">{t.how.title}</h2>
            <ol className="mt-8 grid gap-8 md:grid-cols-4">
              {t.how.steps.map((step, i) => (
                <li key={step.title} className="border-t-4 border-primary pt-4">
                  <p className="text-sm font-semibold text-primary">{i + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Benefits ---------- */}
        <section id="benefits" className="scroll-mt-24 bg-primary-dark text-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 className="font-heading text-3xl font-semibold">{t.benefits.title}</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {t.benefits.items.map((b) => (
                <div key={b.title} className="border-l-4 border-sun pl-4">
                  <h3 className="text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/85">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="mx-auto grid max-w-6xl scroll-mt-24 gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-3xl font-semibold">{t.contact.title}</h2>
            <p className="mt-4 max-w-prose leading-relaxed text-muted">{t.contact.text}</p>
            <p className="mt-6 flex items-center gap-2 font-semibold">
              <MapPin size={18} className="text-primary" aria-hidden="true" />
              {t.contact.place}
            </p>
          </div>

          <form onSubmit={handleContact} className="space-y-4">
            <div>
              <label htmlFor="c-name" className="text-sm font-semibold">
                {t.contact.name}
              </label>
              <input id="c-name" name="name" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="c-reach" className="text-sm font-semibold">
                {t.contact.reach}
              </label>
              <input id="c-reach" name="reach" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="c-msg" className="text-sm font-semibold">
                {t.contact.message}
              </label>
              <textarea
                id="c-msg"
                name="message"
                rows={4}
                required
                className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-base"
              />
            </div>
            <button
              type="submit"
              className="min-h-12 rounded bg-primary px-6 font-semibold text-white hover:bg-primary-dark"
            >
              {t.contact.send}
            </button>
            {sent && (
              <p role="status" className="text-sm font-semibold text-primary">
                {t.contact.sent}
              </p>
            )}
          </form>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="bg-primary-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm">
          <div>
            <p className="font-semibold">{t.brand}</p>
            <p className="text-white/80">
              {t.district} · {t.footer}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={t.aria.footer}>
            {sectionLinks.map((id) => (
              <a key={id} href={`#${id}`} className="hover:underline">
                {t.nav[id]}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}