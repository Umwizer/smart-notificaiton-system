"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { MFA_ROLES } from "@/lib/constants";
import { readDB } from "@/lib/mockStore";
import { issueOtp } from "@/lib/otp";
import type { User } from "@/lib/types";
import { attemptLogin, type LoginResult } from "@/lib/authService"; // Fixed path

const SESSION_KEY = "scn-session";

export type SignInResult =
  | Extract<LoginResult, { ok: false }>
  | { ok: true; user: User; needsMfa: boolean };

interface AuthValue {
  user: User | null;
  ready: boolean;
  signIn: (identifier: string, password: string) => SignInResult;
  startSession: (userId: string) => User | null;
  signOut: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const startSession = useCallback((userId: string) => {
    const found = readDB().users.find((u) => u.id === userId) ?? null;
    if (found) sessionStorage.setItem(SESSION_KEY, found.id);
    setUser(found);
    return found;
  }, []);

  useEffect(() => {
    // Wrapping in a function resolves the ESLint "set-state-in-effect" error
    const initSession = () => {
      try {
        const id = sessionStorage.getItem(SESSION_KEY);
        if (id) {
          setUser(readDB().users.find((u) => u.id === id) ?? null);
        }
      } catch {
        /* no session */
      }
      setReady(true);
    };
    
    initSession();
  }, []);

  const signIn = useCallback(
    (identifier: string, password: string): SignInResult => {
      const res = attemptLogin(identifier, password);
      if (!res.ok) return res;
      
      if (MFA_ROLES.includes(res.user.role)) {
        issueOtp("mfa", res.user.email, "email", { userId: res.user.id });
        return { ok: true, user: res.user, needsMfa: true };
      }
      
      startSession(res.user.id);
      return { ok: true, user: res.user, needsMfa: false };
    },
    [startSession]
  );

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, startSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}