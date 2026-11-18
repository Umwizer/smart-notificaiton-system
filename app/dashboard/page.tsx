"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { resetPassword } from "@/lib/authService";
import { checkPassword } from "@/lib/password";
import PasswordStrength from "@/components/auth/PasswordStrength";

export default function DashboardRouter() {
  const { user, ready, signOut } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  // Profile state
  const [view, setView] = useState<"feed" | "profile">("feed");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const passCheck = checkPassword(newPassword);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [user, ready, router]);

  if (!ready || !user) return <div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>;

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passCheck.valid) return;
    if (user) {
      resetPassword(user.id, newPassword);
      setMsg("Password updated successfully!");
      setNewPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-primary text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="font-heading font-semibold text-lg">{t.brand}</div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-white/20 px-3 py-1 rounded">{t.labels.roles[user.role]}</span>
          <button onClick={() => setView(view === "feed" ? "profile" : "feed")} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20">
            {view === "feed" ? "My Profile" : "Back to Dashboard"}
          </button>
          <button onClick={signOut} className="text-sm hover:underline">{t.dash.logout}</button>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {view === "profile" ? (
          <div className="bg-white p-6 rounded shadow-sm border border-line max-w-lg mx-auto">
            <h2 className="text-xl font-heading font-bold text-ink mb-4">Profile Management</h2>
            <div className="mb-6 space-y-2 text-sm text-muted">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Area:</strong> {user.area.sector}, {user.area.cell}</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="border-t border-line pt-4 space-y-4">
              <h3 className="font-semibold text-ink">Change Password</h3>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter new password"
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs text-muted hover:text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <PasswordStrength password={newPassword} />
              {msg && <p className="text-emerald-600 text-sm font-medium">{msg}</p>}
              <button 
                type="submit" 
                disabled={!passCheck.valid}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-dark transition disabled:opacity-50"
              >
                Update Password
              </button>
            </form>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-heading font-bold text-ink mb-2">
              {t.dash.welcome}, {user.name}
            </h1>
            <p className="text-muted mb-8">
              {user.role === "resident" ? t.dash.citizenTitle : t.dash.officialTitle}
            </p>

            {user.role === "resident" ? (
              <div className="bg-white p-6 rounded shadow-sm border border-line">
                <h2 className="text-lg font-semibold mb-4 text-primary">Feed</h2>
                <p className="text-muted text-sm">Your targeted area: {user.area.sector}, {user.area.cell}, {user.area.village}</p>
                <div className="mt-4 p-4 border border-dashed border-line text-center text-muted">Notifications will appear here</div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded shadow-sm border border-line">
                <h2 className="text-lg font-semibold mb-4 text-primary">Pending Approvals</h2>
                <p className="text-muted text-sm">You are logged in as {t.labels.roles[user.role]}.</p>
                <div className="mt-4 p-4 border border-dashed border-line text-center text-muted">Notification approval queue will appear here</div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}