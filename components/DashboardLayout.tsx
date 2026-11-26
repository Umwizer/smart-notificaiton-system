"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { t } = useLang();
  const pathname = usePathname();

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const isDistrict = user.role === "district";
  const isOfficial = user.role !== "resident";

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "🏠" },
    { name: "Notifications", href: "/dashboard/notices", icon: "📢", show: isOfficial },
    { name: "Approvals", href: "/dashboard/approvals", icon: "✅", show: isOfficial },
    { name: "Feedback", href: "/dashboard/feedback", icon: "💬", show: isOfficial },
    { name: "Messages", href: "/messages", icon: "✉️" },
    { name: "Analytics", href: "/analytics", icon: "📊", show: isAdmin || isDistrict },
    { name: "User Management", href: "/admin/users", icon: "👥", show: isAdmin },
    { name: "Audit Log", href: "/admin/audit", icon: "🔒", show: isAdmin },
  ];

  return (
    <div className="min-h-screen bg-paper flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-white flex-col shadow-lg hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <p className="font-heading font-bold text-lg">{t.brand}</p>
          <p className="text-xs text-blue-200 mt-1">{t.district}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.filter(item => item.show !== false).map(item => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition ${
                pathname === item.href ? "bg-white/20" : "hover:bg-white/10 text-blue-100"
              }`}
            >
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-blue-200 mb-1">Logged in as</p>
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-blue-200 mb-3">{t.labels.roles[user.role]}</p>
          <button onClick={signOut} className="w-full text-left text-sm text-red-300 hover:text-red-100">Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR (Mobile + Announcements) */}
        <header className="bg-white border-b border-line px-6 py-3 flex justify-between items-center shadow-sm md:hidden">
          <p className="font-bold text-primary">{t.brand}</p>
          <button onClick={signOut} className="text-sm text-alert">Log out</button>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}