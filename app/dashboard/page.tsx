"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

export default function DashboardRouter() {
  const { user, ready, signOut } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [user, ready, router]);

  if (!ready || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="font-heading font-semibold text-lg">{t.brand}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-white/20 px-3 py-1 rounded hidden sm:inline-block">
            {t.labels.roles[user.role]}
          </span>
          <Link 
            href="/profile" 
            className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
          >
            My Profile
          </Link>
          <button 
            onClick={signOut} 
            className="text-sm hover:underline"
          >
            {t.dash.logout}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-heading font-bold text-ink mb-2">
          {t.dash.welcome}, {user.name}
        </h1>
        <p className="text-muted mb-8">
          {user.role === "resident" ? t.dash.citizenTitle : t.dash.officialTitle}
        </p>

        {user.role === "resident" ? (
          <div className="bg-white p-6 rounded shadow-sm border border-line">
            <h2 className="text-lg font-semibold mb-4 text-primary">Notice Feed</h2>
            <p className="text-muted text-sm">
              Your targeted area: {user.area.sector}, {user.area.cell}, {user.area.village}
            </p>
            <div className="mt-4 p-8 border border-dashed border-line text-center text-muted">
              Notifications will appear here (Hour 5).
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded shadow-sm border border-line">
            <h2 className="text-lg font-semibold mb-4 text-primary">Pending Approvals</h2>
            <p className="text-muted text-sm">
              You are logged in as {t.labels.roles[user.role]}.
            </p>
            <div className="mt-4 p-8 border border-dashed border-line text-center text-muted">
              Notification approval queue will appear here (Hour 5).
            </div>
          </div>
        )}
      </main>
    </div>
  );
}