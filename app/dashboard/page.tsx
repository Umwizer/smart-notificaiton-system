"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";
import { readDB } from "@/lib/mockStore";
import { 
  getNoticesForUser, 
  updateNoticeStatus, 
  getFeedbackForOfficial, 
  simulateDelivery,
  replyToFeedback,
  canUserApprove
} from "@/lib/noticeService";
import type { Notice } from "@/lib/types";

export default function DashboardRouter() {
  const { user, ready, signOut } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [view, setView] = useState<"notices" | "feedback">("notices");
  const [feedbackList, setFeedbackList] = useState(() => getFeedbackForOfficial());
  const [selectedNoticeForDelivery, setSelectedNoticeForDelivery] = useState<Notice | null>(null);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotices(getNoticesForUser(user));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFeedbackList(getFeedbackForOfficial());
    }
  }, [user]);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;

  function handleAction(noticeId: string, action: "published" | "rejected") {
    if (!user) return;
    updateNoticeStatus(noticeId, action, user.id);
    if (action === "published") simulateDelivery(noticeId);
    setNotices(getNoticesForUser(user)); 
    setFeedbackList(getFeedbackForOfficial());
  }

  function handleExportCSV() {
    if (!user) return;
    const headers = ["ID", "Title", "Category", "Status", "Priority", "Date"];
    const rows = notices.map(n => {
      const formattedDate = new Date(n.createdAt).toISOString().split('T')[0]; 
      return [
        n.id.padEnd(12), 
        `"${n.title.en.replace(/"/g, '""').padEnd(40)}"`, 
        n.category.padEnd(20), 
        n.status.padEnd(15), 
        n.priority.padEnd(12), 
        `'${formattedDate}` 
      ];
    });
    const csvRows = [headers.join(","), ...rows.map(e => e.join(","))];
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\r\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notices_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredNotices = notices.filter(n => {
    const matchesSearch = n.title[lang as "en"|"rw"].toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || n.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const isOfficial = user.role !== "resident";

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="font-heading font-semibold text-lg">{t.brand}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-white/20 px-3 py-1 rounded hidden sm:inline-block">{t.labels.roles[user.role]}</span>
          <Link href="/profile" className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition">My Profile</Link>
          <button onClick={() => { signOut(); router.push("/login"); }} className="text-sm hover:underline">{t.dash.logout}</button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-ink">
              {isOfficial ? (view === "notices" ? "Notice Management" : "Feedback Inbox") : "Notice Feed"}
            </h1>
            <p className="text-muted text-sm mt-1">
              {isOfficial ? "Create, review, and publish notices for your area." : `Area: ${user.area.sector}, ${user.area.cell}`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isOfficial && (
              <>
                <button onClick={() => setView(view === "notices" ? "feedback" : "notices")} className="px-4 py-2 bg-white border border-line rounded-md text-sm font-semibold hover:bg-paper transition">
                  {view === "notices" ? "View Feedback Inbox" : "Back to Notices"}
                </button>
                <button onClick={handleExportCSV} className="px-4 py-2 bg-white border border-line rounded-md text-sm font-semibold hover:bg-paper transition">
                  Export CSV
                </button>
                <Link href="/dashboard/create" className="bg-primary text-white px-5 py-2.5 rounded-md font-semibold hover:bg-primary-dark transition">
                  + Create Notice
                </Link>
              </>
            )}
          </div>
        </div>

        {view === "notices" && (
          <>
            {isOfficial && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input 
                  type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
                  className="flex-1 rounded-md border border-line px-4 py-2 outline-none focus:ring-2 focus:ring-primary bg-white"
                />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-md border border-line px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-primary">
                  <option value="all">All Statuses</option>
                  <option value="draft">Drafts</option>
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}

            {isOfficial ? (
              <div className="bg-white rounded-lg border border-line overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-paper border-b border-line text-muted font-medium">
                      <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {filteredNotices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted">No notices found.</td>
                        </tr>
                      ) : (
                        filteredNotices.map(n => (
                          <tr key={n.id} className="hover:bg-paper/50">
                            <td 
                              className="px-4 py-3 font-medium text-ink cursor-pointer hover:text-primary hover:underline"
                              onClick={() => setSelectedNoticeForDelivery(n)}
                            >
                              {n.title[lang as "en"|"rw"] || n.title.en}
                            </td>
                            <td className="px-4 py-3 text-muted capitalize">{n.category}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                                n.status === "published" ? "bg-emerald-100 text-emerald-700" :
                                n.status === "pending" ? "bg-amber-100 text-amber-700" :
                                n.status === "rejected" ? "bg-red-100 text-red-700" :
                                "bg-slate-100 text-slate-700"
                              }`}>
                                {n.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-semibold capitalize ${n.priority === "emergency" ? "text-alert" : n.priority === "urgent" ? "text-amber-600" : "text-muted"}`}>
                                {n.priority}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              {n.status === "pending" && canUserApprove(user, n) && (
                                <>
                                  <button onClick={() => handleAction(n.id, "published")} className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">Approve & Publish</button>
                                  <button onClick={() => handleAction(n.id, "rejected")} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">Reject</button>
                                </>
                              )}
                              {n.status === "pending" && !canUserApprove(user, n) && (
                                <span className="text-xs text-amber-600 italic">Awaiting higher approval</span>
                              )}
                              {n.status === "draft" && <span className="text-xs text-muted italic">Draft</span>}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredNotices.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-muted bg-white rounded-lg border border-dashed border-line">
                    No notices available for your area yet.
                  </div>
                ) : (
                  filteredNotices.map(n => (
                    <Link href={`/dashboard/notice/${n.id}`} key={n.id} className="block group">
                      <div className={`bg-white p-5 rounded-xl border transition shadow-sm hover:shadow-md ${
                        n.priority === "emergency" ? "border-alert" : "border-line"
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                            n.priority === "emergency" ? "bg-red-100 text-alert" : 
                            n.priority === "urgent" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                          }`}>
                            {n.priority}
                          </span>
                          <span className="text-xs text-muted">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h3 className="font-heading font-bold text-lg text-ink group-hover:text-primary transition">
                          {n.title[lang as "en"|"rw"] || n.title.en}
                        </h3>
                        <p className="text-sm text-muted mt-2 line-clamp-2">
                          {n.content[lang as "en"|"rw"] || n.content.en}
                        </p>
                        <div className="mt-4 text-primary text-sm font-semibold flex items-center gap-1">
                          Read more &rarr;
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {view === "feedback" && isOfficial && (
          <div className="bg-white rounded-lg border border-line overflow-hidden shadow-sm">
            <div className="p-4 border-b border-line bg-paper">
              <h2 className="font-semibold text-ink">Questions & Concerns from Residents</h2>
            </div>
            <ul className="divide-y divide-line">
              {feedbackList.length === 0 ? (
                <li className="p-8 text-center text-muted">No feedback received yet.</li>
              ) : (
                feedbackList.map(f => (
                  <li key={f.id} className="p-4 hover:bg-paper/50 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-ink">{f.userName}</p>
                        <p className="text-xs text-primary font-medium">Re: {f.noticeTitle}</p>
                      </div>
                      <span className="text-xs text-muted">{new Date(f.createdAt).toLocaleString()}</span>
                    </div>
                    
                    <p className="text-sm text-ink bg-slate-50 p-3 rounded-md border border-line">{f.comment}</p>
                    
                    {f.response ? (
                      <div className="ml-4 p-3 bg-primary/5 border-l-2 border-primary rounded-r-md">
                        <p className="text-xs font-semibold text-primary mb-1">Your Reply:</p>
                        <p className="text-sm text-ink">{f.response}</p>
                      </div>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const reply = (e.currentTarget.elements.namedItem("reply") as HTMLInputElement).value;
                          if (reply.trim()) {
                            replyToFeedback(f.id, reply);
                            const db = readDB();
                            setFeedbackList(getFeedbackForOfficial());
                          }
                        }}
                        className="flex gap-2 mt-2"
                      >
                        <input 
                          name="reply" 
                          type="text" 
                          placeholder="Type your official reply..." 
                          className="flex-1 text-sm rounded-md border border-line px-3 py-2 outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                        <button type="submit" className="bg-primary text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-primary-dark">
                          Reply
                        </button>
                      </form>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>

      {selectedNoticeForDelivery && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-heading font-bold text-ink">Delivery Status</h2>
              <button onClick={() => setSelectedNoticeForDelivery(null)} className="text-muted hover:text-alert font-bold text-xl">&times;</button>
            </div>
            <p className="text-sm text-muted mb-6">Notice: <strong className="text-ink">{selectedNoticeForDelivery.title.en}</strong></p>
            
            <div className="space-y-4">
              {selectedNoticeForDelivery.channels.map(channel => (
                <div key={channel} className="flex justify-between items-center p-3 border border-line rounded-md bg-paper">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium text-ink">{channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold uppercase">Delivered</span>
                    <button className="text-xs text-primary hover:underline">Resend</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setSelectedNoticeForDelivery(null)} className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-dark">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}