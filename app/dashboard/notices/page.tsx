"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { readDB } from "@/lib/mockStore";
import DashboardLayout from "@/components/DashboardLayout";

export default function NoticesManagementPage() {
  const { user, ready } = useAuth();
  const { t } = useLang(); // Removed lang to fix the unused warning

  // Initialize stats directly to fix the ESLint error
  const [stats] = useState(() => {
    if (typeof window === "undefined") return { total: 0, pending: 0, published: 0, feedback: 0 };
    const db = readDB();
    return {
      total: db.notices.length,
      pending: db.notices.filter(n => n.status === "pending").length,
      published: db.notices.filter(n => n.status === "published").length,
      feedback: db.feedback.length,
    };
  });

  if (!ready || !user) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-ink">{t.dash.noticeManagement}</h1>
        <p className="text-muted text-sm mt-1">Manage all notices and their lifecycles.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
          <p className="text-sm text-muted font-medium">Total Notices</p>
          <p className="text-3xl font-bold text-ink">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
          <p className="text-sm text-muted font-medium">Pending Approval</p>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
          <p className="text-sm text-muted font-medium">Published</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.published}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
          <p className="text-sm text-muted font-medium">Feedback</p>
          <p className="text-3xl font-bold text-primary">{stats.feedback}</p>
        </div>
      </div>

      {/* Quick Link to full notice table */}
      <div className="bg-white p-6 rounded-xl border border-line shadow-sm text-center">
        <p className="text-muted mb-4">You are viewing the overview statistics.</p>
        <a href="/dashboard" className="inline-block bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition">
          Go to Notice Table
        </a>
      </div>
    </DashboardLayout>
  );
}