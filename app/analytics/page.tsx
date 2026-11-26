"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";
import { readDB } from "@/lib/mockStore";

export default function AnalyticsPage() {
  const { user, ready } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();

  if (!ready) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  if (!user || (user.role !== "admin" && user.role !== "district")) {
    if (typeof window !== "undefined") router.replace("/dashboard");
    return null;
  }

  const db = readDB();

  // --- CALCULATE METRICS ---
  const totalNotices = db.notices.length;
  const publishedNotices = db.notices.filter(n => n.status === "published");
  const totalResidents = db.users.filter(u => u.role === "resident").length;
  
  // Calculate Read Rate
  const totalReads = publishedNotices.reduce((sum, n) => sum + (n.readBy?.length || 0), 0);
  const totalDeliveries = db.deliveries.length;
  const readRate = totalDeliveries > 0 ? Math.round((totalReads / totalDeliveries) * 100) : 0;

  // Notices by Sector
  const sectors = ["Nyamata", "Rilima", "Gashora", "Ruhuha", "Ntarama"];
  const sectorData = sectors.map(s => ({
    name: s,
    count: db.notices.filter(n => n.target.sector === s).length
  }));
  const maxSectorCount = Math.max(...sectorData.map(s => s.count), 1);

  // Delivery by Channel
  const channels = ["sms", "push", "email", "ussd"];
  const channelData = channels.map(c => ({
    name: c,
    delivered: db.deliveries.filter(d => d.channel === c && d.status === "delivered").length,
    failed: db.deliveries.filter(d => d.channel === c && d.status === "failed").length,
  }));

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="font-heading font-semibold text-lg">{t.brand}</div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition">Back to Dashboard</Link>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-ink">System Analytics</h1>
          <p className="text-muted text-sm mt-1">Overview of notification performance and engagement.</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <p className="text-sm font-medium text-muted mb-1">Total Notices</p>
            <p className="text-3xl font-bold text-ink">{totalNotices}</p>
            <p className="text-xs text-emerald-600 mt-2">↑ {publishedNotices.length} published</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <p className="text-sm font-medium text-muted mb-1">Registered Residents</p>
            <p className="text-3xl font-bold text-ink">{totalResidents}</p>
            <p className="text-xs text-muted mt-2">Across all sectors</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <p className="text-sm font-medium text-muted mb-1">Read Rate</p>
            <p className="text-3xl font-bold text-primary">{readRate}%</p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${readRate}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <p className="text-sm font-medium text-muted mb-1">Total Deliveries</p>
            <p className="text-3xl font-bold text-ink">{totalDeliveries}</p>
            <p className="text-xs text-muted mt-2">Across all channels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* NOTICES BY SECTOR CHART */}
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <h2 className="text-lg font-semibold text-ink mb-6">Notices by Sector</h2>
            <div className="space-y-4">
              {sectorData.map(s => (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="w-24 text-sm font-medium text-muted text-right">{s.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-md h-8 overflow-hidden">
                    <div 
                      className="bg-primary h-full flex items-center px-2 text-xs text-white font-bold"
                      style={{ width: `${(s.count / maxSectorCount) * 100}%`, minWidth: s.count > 0 ? "2rem" : "0" }}
                    >
                      {s.count > 0 && s.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DELIVERY STATUS BY CHANNEL */}
          <div className="bg-white p-6 rounded-xl border border-line shadow-sm">
            <h2 className="text-lg font-semibold text-ink mb-6">Delivery Success by Channel</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="text-left py-2">Channel</th>
                  <th className="text-right py-2 text-emerald-600">Delivered</th>
                  <th className="text-right py-2 text-alert">Failed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {channelData.map(c => (
                  <tr key={c.name}>
                    <td className="py-3 capitalize font-medium text-ink">{c.name}</td>
                    <td className="py-3 text-right font-semibold text-emerald-600">{c.delivered}</td>
                    <td className="py-3 text-right font-semibold text-alert">{c.failed > 0 ? c.failed : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* TOP PERFORMING NOTICES */}
        <div className="mt-8 bg-white rounded-xl border border-line shadow-sm overflow-hidden">
          <div className="p-6 border-b border-line">
            <h2 className="text-lg font-semibold text-ink">Top Performing Notices</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-paper text-muted font-medium border-b border-line">
              <tr>
                <th className="px-6 py-3">Notice Title</th>
                <th className="px-6 py-3">Target Area</th>
                <th className="px-6 py-3">Total Reads</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {publishedNotices
                .sort((a, b) => (b.readBy?.length || 0) - (a.readBy?.length || 0))
                .slice(0, 5)
                .map(n => (
                <tr key={n.id} className="hover:bg-paper/50">
                  <td className="px-6 py-4 font-medium text-ink">{n.title[lang as "en"|"rw"] || n.title.en}</td>
                  <td className="px-6 py-4 text-muted">{n.target.sector || "All Sectors"}</td>
                  <td className="px-6 py-4 font-bold text-primary">{n.readBy?.length || 0} reads</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-semibold uppercase bg-emerald-100 text-emerald-700">
                      {n.status}
                    </span>
                  </td>
                </tr>
              ))}
              {publishedNotices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted">No published notices yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}