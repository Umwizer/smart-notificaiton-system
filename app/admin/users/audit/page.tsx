"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { readDB } from "@/lib/mockStore";
import DashboardLayout from "@/components/DashboardLayout";

export default function AuditLogPage() {
  const { user, ready } = useAuth();
  const [logs] = useState(() => {
    const db = readDB();
    return [...db.audit].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  if (!ready || !user || user.role !== "admin") return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-ink">System Audit Log</h1>
        <p className="text-muted text-sm mt-1">Complete history of all actions taken in the system.</p>
      </div>

      <div className="bg-white rounded-lg border border-line shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper border-b border-line text-muted font-medium">
            <tr>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {logs.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted">No audit records found.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-paper/50">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-ink capitalize">{log.action.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-muted">{log.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}