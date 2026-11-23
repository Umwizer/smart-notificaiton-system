"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createNotice, submitForApproval } from "@/lib/noticeService";
import { AREAS } from "@/lib/bugesera";
import Link from "next/link";

type Channel = "sms" | "push" | "email" | "ussd";

export default function CreateNoticePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    titleEn: "", titleRw: "",
    contentEn: "", contentRw: "",
    category: "health", priority: "normal",
    targetSector: user?.area.sector || "",
    targetCell: user?.area.cell || "",
    targetVillage: user?.area.village || "",
    channels: ["sms", "push"] as Channel[],
    attachmentName: "",
    attachmentSize: "",
  });
  const [busy, setBusy] = useState(false);

  if (!user || user.role === "resident") return null;

  const sectors = Object.keys(AREAS);
  const cells = form.targetSector ? Object.keys(AREAS[form.targetSector]) : [];
  const villages = form.targetSector && form.targetCell ? AREAS[form.targetSector][form.targetCell] : [];

  function update(field: string, val: string) {
    setForm(prev => {
      const next = { ...prev, [field]: val };
      if (field === "targetSector") { next.targetCell = ""; next.targetVillage = ""; }
      if (field === "targetCell") { next.targetVillage = ""; }
      return next;
    });
  }

  function handleSubmit(action: "draft" | "submit") {
    if (!user) return;

    if (!form.titleEn.trim() || !form.contentEn.trim()) {
      alert("Please fill in at least the English Title and Message before saving.");
      return;
    }

    setBusy(true);

    const category = form.category as "health" | "security" | "weather" | "events" | "administrative";
    const priority = form.priority as "normal" | "urgent" | "emergency";

    const notice = createNotice(user, {
      title: { en: form.titleEn.trim(), rw: form.titleRw.trim() || form.titleEn.trim() },
      content: { en: form.contentEn.trim(), rw: form.contentRw.trim() || form.contentEn.trim() },
      category,
      priority,
      target: { 
        district: "Bugesera", 
        sector: form.targetSector || undefined, 
        cell: form.targetCell || undefined, 
        village: form.targetVillage || undefined 
      },
      channels: form.channels,
      attachment: form.attachmentName ? { name: form.attachmentName, size: form.attachmentSize } : undefined,
    });

    if (action === "submit") {
      submitForApproval(notice.id, user.id);
    }
    
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-line overflow-hidden">
        <div className="bg-primary text-white p-6 flex justify-between items-center">
          <h1 className="text-2xl font-heading font-semibold">Create New Notice</h1>
          <Link href="/dashboard" className="text-sm text-white/80 hover:text-white">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="font-semibold text-ink border-b border-line pb-2">English Content</h2>
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">
                  Title <span className="text-alert">*</span>
                </label>
                <input 
                  required
                  value={form.titleEn} 
                  onChange={e => update("titleEn", e.target.value)} 
                  className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="e.g. Water Maintenance" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">
                  Message <span className="text-alert">*</span>
                </label>
                <textarea 
                  required
                  rows={4} 
                  value={form.contentEn} 
                  onChange={e => update("contentEn", e.target.value)} 
                  className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Write the details here..." 
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="font-semibold text-ink border-b border-line pb-2">Kinyarwanda Content</h2>
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">Umutwe</label>
                <input 
                  value={form.titleRw} 
                  onChange={e => update("titleRw", e.target.value)} 
                  className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Urugero: Ibikorwa byo gusana amazi" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">Ubutumwa</label>
                <textarea 
                  rows={4} 
                  value={form.contentRw} 
                  onChange={e => update("contentRw", e.target.value)} 
                  className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" 
                  placeholder="Andika amakuru arambuye hano..." 
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Category</label>
              <select value={form.category} onChange={e => update("category", e.target.value)} className="w-full rounded-md border border-line px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                <option value="health">Health</option>
                <option value="security">Security</option>
                <option value="weather">Weather</option>
                <option value="events">Community Events</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Priority</label>
              <select value={form.priority} onChange={e => update("priority", e.target.value)} className="w-full rounded-md border border-line px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink mb-1 block">Target Sector</label>
              <select value={form.targetSector} onChange={e => update("targetSector", e.target.value)} className="w-full rounded-md border border-line px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                <option value="">All Sectors</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {form.targetSector && (
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">Target Cell</label>
                <select value={form.targetCell} onChange={e => update("targetCell", e.target.value)} className="w-full rounded-md border border-line px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Cells</option>
                  {cells.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            {form.targetCell && (
              <div>
                <label className="text-sm font-medium text-ink mb-1 block">Target Village</label>
                <select value={form.targetVillage} onChange={e => update("targetVillage", e.target.value)} className="w-full rounded-md border border-line px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                  <option value="">All Villages</option>
                  {villages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            )}
            <div className="col-span-1 md:col-span-3">
              <label className="text-sm font-medium text-ink mb-1 block">Attachment (Simulated)</label>
              <input 
                type="file" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm(prev => ({
                      ...prev,
                      attachmentName: file.name,
                      attachmentSize: (file.size / 1024).toFixed(1) + " KB"
                    }));
                  }
                }}
                className="w-full rounded-md border border-line px-3 py-2 bg-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {form.attachmentName && (
                <p className="text-xs text-emerald-600 mt-1">✓ Attached: {form.attachmentName} ({form.attachmentSize})</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-line">
            <button 
              onClick={() => handleSubmit("draft")} 
              disabled={busy} 
              className="px-6 py-2.5 rounded-md border border-line font-semibold hover:bg-paper transition disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button 
              onClick={() => handleSubmit("submit")} 
              disabled={busy} 
              className="px-6 py-2.5 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition disabled:opacity-50"
            >
              Submit for Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}