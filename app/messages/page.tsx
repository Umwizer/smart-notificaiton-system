"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { readDB } from "@/lib/mockStore";
import { sendDirectMessage, getMessagesForUser, sendBroadcast } from "@/lib/noticeService";
import Link from "next/link";

export default function MessagesWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <MessagesPage />
    </Suspense>
  );
}

function MessagesPage() {
  const { user, ready } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const [messages, setMessages] = useState(() => user ? getMessagesForUser(user.id) : []);
  const [newMessage, setNewMessage] = useState("");
  
  // For Admins: Broadcast state
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) return null;

  // Find the official ID to message if user is a resident
  const db = readDB();
  let recipientId = "";
  if (user.role === "resident") {
    const official = db.users.find(u => 
      u.role === "sector" && u.area.sector === user.area.sector
    ) || db.users.find(u => u.role === "district");
    recipientId = official?.id || "";
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    // Resident sends to official, official sends to resident
    const targetId = user.role === "resident" ? recipientId : "u-res1"; // Mocking target for demo
    sendDirectMessage(user.id, targetId, newMessage);
    
    setMessages(getMessagesForUser(user.id));
    setNewMessage("");
  }

  function handleBroadcast(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !broadcastText.trim()) return;
    sendBroadcast(user.id, broadcastText);
    setBroadcastSent(true);
    setBroadcastText("");
  }

  return (
    <div className="min-h-screen bg-paper p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-ink">Messages</h1>
        <Link href="/dashboard" className="text-sm text-primary font-semibold hover:underline">&larr; Back to Dashboard</Link>
      </div>

      {/* ADMIN BROADCAST SECTION */}
      {user.role === "admin" && (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-line p-6 mb-6">
          <h2 className="font-semibold text-ink mb-2">Admin System Broadcast</h2>
          <p className="text-sm text-muted mb-4">This message will be shown to all users on their dashboard.</p>
          {broadcastSent && <div className="p-2 mb-2 bg-emerald-50 text-emerald-700 text-sm rounded">Broadcast sent successfully!</div>}
          <form onSubmit={handleBroadcast} className="flex gap-2">
            <input 
              type="text" 
              value={broadcastText}
              onChange={e => setBroadcastText(e.target.value)}
              placeholder="Type urgent announcement..."
              className="flex-1 rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button type="submit" className="bg-alert text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700">Broadcast</button>
          </form>
        </div>
      )}

      {/* CHAT INTERFACE */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-line overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 bg-primary text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {user.role === "resident" ? "O" : "R"}
          </div>
          <div>
            <p className="font-semibold">{user.role === "resident" ? "Sector Official" : "Resident Chat"}</p>
            <p className="text-xs text-blue-100">Direct Message</p>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted text-sm mt-10">No messages yet. Start the conversation!</div>
          ) : (
            messages.map(m => {
              const isMe = m.fromId === user.id;
              return (
                <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    isMe ? "bg-primary text-white rounded-br-none" : "bg-white border border-line text-ink rounded-bl-none"
                  }`}>
                    {!isMe && <p className="text-xs font-semibold mb-1 opacity-70">{m.otherUserName}</p>}
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-200" : "text-muted"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-line flex gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-dark">Send</button>
        </form>
      </div>
    </div>
  );
}