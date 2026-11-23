"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { readDB } from "@/lib/mockStore";
import { markAsRead, addFeedback } from "@/lib/noticeService";
import type { Notice } from "@/lib/types";
import Link from "next/link";

export default function NoticeDetailWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <NoticeDetailPage />
    </Suspense>
  );
}

function NoticeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  
  const [notice] = useState<Notice | null>(() => {
    if (!id) return null;
    const db = readDB();
    return db.notices.find(n => n.id === id) || null;
  });

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    if (notice && user && user.role === "resident") {
      markAsRead(notice.id, user.id);
    }
  }, [notice, user]);

  if (!notice) return <div className="min-h-screen flex items-center justify-center text-muted">Notice not found.</div>;

  function handleSendFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !feedbackText.trim()) return;
    addFeedback(notice!.id, user.id, feedbackText);
    setFeedbackSent(true);
    setFeedbackText("");
  }

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-line overflow-hidden mt-8">
        
        {notice.priority === "emergency" && (
          <div className="bg-alert text-white px-4 py-2 text-center font-bold tracking-wide text-sm">
            ⚠️ EMERGENCY NOTICE
          </div>
        )}

        <div className="p-6 border-b border-line">
          <div className="flex justify-between items-start mb-4">
            <span className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
              notice.priority === "urgent" ? "bg-amber-100 text-amber-700" : 
              notice.priority === "emergency" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
            }`}>
              {notice.priority}
            </span>
            <span className="text-xs text-muted font-medium">{new Date(notice.createdAt).toLocaleDateString()}</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-ink mb-2">
            {notice.title[lang as "en" | "rw"] || notice.title.en}
          </h1>
          <p className="text-sm text-muted capitalize">Category: {notice.category}</p>
        </div>

        <div className="p-6 text-ink leading-relaxed space-y-4">
          <p className="whitespace-pre-wrap">
            {notice.content[lang as "en" | "rw"] || notice.content.en}
          </p>
          {notice.attachment && (
            <div className="mt-4 p-3 bg-slate-50 border border-line rounded-md flex items-center gap-3">
              <span className="text-2xl">📎</span>
              <div>
                <p className="text-sm font-medium text-primary hover:underline cursor-pointer">{notice.attachment.name}</p>
                <p className="text-xs text-muted">{notice.attachment.size}</p>
              </div>
            </div>
          )}
        </div>

        {user && user.role !== "admin" && (
          <div className="p-6 bg-slate-50 border-t border-line">
            <h3 className="font-semibold text-ink mb-2">Have a question about this notice?</h3>
            {feedbackSent ? (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded text-sm font-medium">
                Your message has been sent to the officials. Thank you!
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Type your question or concern here..." 
                  className="flex-1 rounded-md border border-line px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark transition">
                  Send Question
                </button>
              </form>
            )}
          </div>
        )}

        <div className="p-6 bg-paper border-t border-line flex justify-between items-center">
          <Link href="/dashboard" className="text-primary font-semibold hover:underline">
            &larr; Back to Feed
          </Link>
          
          <button 
            onClick={() => router.push("/dashboard")}
            className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition"
          >
            I have read this
          </button>
        </div>
      </div>
    </div>
  );
}