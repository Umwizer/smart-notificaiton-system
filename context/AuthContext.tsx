"use client";

import { createContext, useCallback, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { MFA_ROLES } from "@/lib/constants";
import { readDB } from "@/lib/mockStore";
import { issueOtp } from "@/lib/otp";
import type { User } from "@/lib/types";
import { attemptLogin, type LoginResult } from "@/lib/authService";

const SESSION_KEY = "scn-session";

// --- CHANGE TIMERS HERE ---
const TIMEOUT_MS = 2.5 * 60 * 1000; // 2 minutes and 30 seconds (150,000 ms)
const WARNING_MS = TIMEOUT_MS - 30000; // Warn 30 seconds before logout

export type SignInResult =
  | Extract<LoginResult, { ok: false }>
  | { ok: true; user: User; needsMfa: boolean };

interface AuthValue {
  user: User | null;
  ready: boolean;
  signIn: (identifier: string, password: string) => SignInResult;
  startSession: (userId: string) => User | null;
  signOut: () => void;
  updateUser: (updatedUser: User) => void;
  showTimeoutWarning: boolean;
  resetTimer: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
    setShowTimeoutWarning(false);
    if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
  }, []);

  const resetTimer = useCallback(() => {
    if (!user) return;
    
    if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
    
    setShowTimeoutWarning(false);

    warningTimerRef.current = window.setTimeout(() => {
      setShowTimeoutWarning(true);
    }, WARNING_MS);

    logoutTimerRef.current = window.setTimeout(() => {
      signOut();
    }, TIMEOUT_MS);
  }, [user, signOut]);

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    
    if (user) {
      events.forEach(e => window.addEventListener(e, resetTimer));
    }
    
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (warningTimerRef.current) window.clearTimeout(warningTimerRef.current);
      if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
    };
  }, [user, resetTimer]);

  const startSession = useCallback((userId: string) => {
    const found = readDB().users.find((u) => u.id === userId) ?? null;
    if (found) {
      sessionStorage.setItem(SESSION_KEY, found.id);
      setUser(found);
      resetTimer();
    }
    return found;
  }, [resetTimer]);

  // Initialize session ONCE on mount
  useEffect(() => {
    const initSession = () => {
      try {
        const id = sessionStorage.getItem(SESSION_KEY);
        if (id) {
          const found = readDB().users.find((u) => u.id === id) ?? null;
          if (found) {
            setUser(found);
            // We don't call resetTimer here because the user state update 
            // will trigger the activity listener useEffect above which starts the timer.
          }
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setReady(true); // ALWAYS set ready, even if no user
      }
    };
    initSession();

  }, []); 

  const signIn = useCallback((identifier: string, password: string): SignInResult => {
      const res = attemptLogin(identifier, password);
      if (!res.ok) return res;
      if (MFA_ROLES.includes(res.user.role)) {
        issueOtp("mfa", res.user.email, "email", { userId: res.user.id });
        return { ok: true, user: res.user, needsMfa: true };
      }
      startSession(res.user.id);
      return { ok: true, user: res.user, needsMfa: false };
    }, [startSession]);

  const updateUser = useCallback((updatedUser: User) => {
    sessionStorage.setItem(SESSION_KEY, updatedUser.id);
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, startSession, signOut, updateUser, showTimeoutWarning, resetTimer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}