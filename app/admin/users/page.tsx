"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { readDB, writeDB } from "@/lib/mockStore";
import DashboardLayout from "@/components/DashboardLayout";
import type { User } from "@/lib/types";
// import Link from "next/link";

export default function UserManagementPage() {
  const { user, ready } = useAuth();
  const [users, setUsers] = useState<User[]>(() => readDB().users);

  if (!ready || !user || user.role !== "admin") return null;

  function toggleStatus(userId: string) {
    const db = readDB();
    const u = db.users.find(x => x.id === userId);
    if (u) {
      u.status = u.status === "active" ? "suspended" : "active";
      writeDB(db);
      setUsers([...db.users]);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-ink">User Management</h1>
        <p className="text-muted text-sm mt-1">Manage accounts, roles, and access permissions.</p>
      </div>

      <div className="bg-white rounded-lg border border-line shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper border-b border-line text-muted font-medium">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-paper/50">
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 capitalize text-muted">{u.role}</td>
                <td className="px-4 py-3 text-muted">{u.area.sector || "N/A"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => toggleStatus(u.id)}
                    className={`text-xs px-3 py-1 rounded font-semibold ${
                      u.status === "active" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {u.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}