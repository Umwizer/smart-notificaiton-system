import { ReactNode } from "react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const {  lang, setLang } = useLang();

  return (
    <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-line overflow-hidden">
        {/* Header bar matching the gov style */}
        <div className="bg-primary px-6 py-8 text-center relative">
          <Link href="/" className="text-white/80 text-sm hover:text-white absolute left-4 top-4">&larr; Back</Link>
          <div className="inline-flex gap-1 absolute right-4 top-4 bg-white/10 rounded-md p-1">
            <button onClick={() => setLang("en")} className={`px-2 py-0.5 text-xs rounded ${lang === "en" ? "bg-white text-primary font-bold" : "text-white"}`}>EN</button>
            <button onClick={() => setLang("rw")} className={`px-2 py-0.5 text-xs rounded ${lang === "rw" ? "bg-white text-primary font-bold" : "text-white"}`}>RW</button>
          </div>
          <h1 className="text-2xl font-heading font-semibold text-white mt-4">{title}</h1>
          <p className="text-primary-tint text-sm mt-2">{subtitle}</p>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </main>
  );
}