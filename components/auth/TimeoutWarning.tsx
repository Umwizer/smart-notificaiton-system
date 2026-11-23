"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TimeoutWarning() {
  const { showTimeoutWarning, resetTimer, signOut } = useAuth();
  const router = useRouter();

  if (!showTimeoutWarning) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-xl font-bold text-ink mb-2">Are you still there?</h2>
        <p className="text-sm text-muted mb-6">You will be logged out in 2 minutes due to inactivity.</p>
        <div className="flex gap-3">
          <button 
            onClick={() => { signOut(); router.push("/login"); }} 
            className="flex-1 py-2 rounded-md border border-line text-ink hover:bg-paper"
          >
            Log out
          </button>
          <button 
            onClick={resetTimer} 
            className="flex-1 py-2 rounded-md bg-primary text-white hover:bg-primary-dark"
          >
            Stay logged in
          </button>
        </div>
      </div>
    </div>
  );
}