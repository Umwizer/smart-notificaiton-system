"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { updateProfile, resetPassword, getLoginActivity } from "@/lib/authService";
import { checkPassword } from "@/lib/password";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Link from "next/link";

export default function ProfilePage() {
  const { user, ready, updateUser, signOut } = useAuth();
  const { t, lang, setLang } = useLang();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "activity">("profile");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize form state lazily using a function to avoid the useEffect
  const [form, setForm] = useState(() => ({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  }));
  
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);

  const passCheck = checkPassword(passwords.new);

  // Handle redirect in useEffect safely
  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [user, ready, router]);

  // Prevent rendering if no user
  if (!ready || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;
  }

  // --- Handlers ---
  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return; // Safe null check for TypeScript
    setMsg(null);
    
    const updated = updateProfile(user.id, { ...form });
    if (updated) {
      updateUser(updated);
      setMsg({ type: "success", text: "Profile updated successfully!" });
    }
  }

  function handleChangeLanguage(newLang: "en" | "rw") {
    if (!user) return; // Safe null check for TypeScript
    setLang(newLang);
    
    const updated = updateProfile(user.id, { language: newLang });
    if (updated) updateUser(updated);
  }

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return; // Safe null check for TypeScript
    setMsg(null);
    
    if (!passCheck.valid) return setMsg({ type: "error", text: "Password is too weak." });
    if (passwords.new !== passwords.confirm) return setMsg({ type: "error", text: "Passwords do not match." });

    resetPassword(user.id, passwords.new);
    setMsg({ type: "success", text: "Password updated successfully!" });
    setPasswords({ new: "", confirm: "" });
  }

  const activity = getLoginActivity(user.id);

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
        <Link href="/dashboard" className="font-heading font-semibold text-lg hover:underline">&larr; Back to Dashboard</Link>
        <button onClick={signOut} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">Log out</button>
      </header>

      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-ink mb-2">My Profile</h1>
        <p className="text-muted mb-8">{t.labels.roles[user.role]} · {user.area.sector}</p>

        {/* Tabs */}
        <div className="flex border-b border-line mb-6">
          {(["profile", "security", "activity"] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => { setActiveTab(tab); setMsg(null); }}
              className={`px-4 py-2 font-medium capitalize border-b-2 transition ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Toast */}
        {msg && (
          <div className={`p-3 mb-4 rounded text-sm ${msg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-alert border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-lg shadow-sm border border-line space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink mb-1">Full Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Phone Number</label>
                <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-ink mb-1">Preferred Language</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => handleChangeLanguage("en")} className={`px-4 py-2 rounded-md border ${lang === "en" ? "bg-primary text-white border-primary" : "bg-white text-ink border-line"}`}>English</button>
                  <button type="button" onClick={() => handleChangeLanguage("rw")} className={`px-4 py-2 rounded-md border ${lang === "rw" ? "bg-primary text-white border-primary" : "bg-white text-ink border-line"}`}>Kinyarwanda</button>
                </div>
              </div>
            </div>
            <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition mt-4">Save Changes</button>
          </form>
        )}

        {/* TAB 2: SECURITY */}
        {activeTab === "security" && (
          <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-lg shadow-sm border border-line space-y-4">
            <h2 className="text-lg font-semibold text-ink">Change Password</h2>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">New Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-xs text-muted hover:text-primary">{showPassword ? "Hide" : "Show"}</button>
              </div>
              <PasswordStrength password={passwords.new} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Confirm New Password</label>
              <input type={showPassword ? "text" : "password"} required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full rounded-md border border-line px-3 py-2 outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <button type="submit" disabled={!passCheck.valid} className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-dark transition disabled:opacity-50 mt-4">Update Password</button>
          </form>
        )}

        {/* TAB 3: ACTIVITY */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-lg shadow-sm border border-line overflow-hidden">
            <div className="p-4 border-b border-line bg-paper">
              <h2 className="font-semibold text-ink">Login Activity</h2>
              <p className="text-xs text-muted">A log of your recent sign-ins and failed attempts.</p>
            </div>
            <ul className="divide-y divide-line">
              {activity.length === 0 ? (
                <li className="p-6 text-center text-muted text-sm">No recent activity found.</li>
              ) : (
                activity.map(log => (
                  <li key={log.id} className="p-4 flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${log.action === "login_success" ? "text-emerald-600" : "text-alert"}`}>
                        {log.action === "login_success" ? "Successful Sign In" : "Failed Sign In Attempt"}
                      </p>
                      <p className="text-xs text-muted">{log.detail}</p>
                    </div>
                    <div className="text-xs text-muted">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}