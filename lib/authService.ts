import { newId, readDB, writeDB } from "@/lib/mockStore";
import type { DB, User } from "@/lib/types";

export const MAX_FAILED_LOGINS = 5;
export const LOCK_MINUTES = 15;

export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; reason: "invalid"; attemptsLeft: number }
  | { ok: false; reason: "locked"; minutesLeft: number }
  | { ok: false; reason: "suspended" };

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  sector: string;
  cell: string;
  village: string;
  password: string;
  language: "en" | "rw";
}

/** 0788 123 456, +250788123456 and 250788123456 all become 0788123456 */
export function normalizePhone(raw: string): string {
  const p = raw.replace(/[\s-]/g, "");
  if (p.startsWith("+250")) return "0" + p.slice(4);
  if (p.startsWith("250") && p.length === 12) return "0" + p.slice(3);
  return p;
}

export const isValidPhone = (raw: string) => /^07[2389]\d{7}$/.test(normalizePhone(raw));
export const isValidEmail = (raw: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());

function addAudit(db: DB, userId: string, action: string, detail: string) {
  db.audit.push({ id: newId("log"), userId, action, detail, createdAt: new Date().toISOString() });
}

export function findUser(db: DB, identifier: string): User | undefined {
  const id = identifier.trim();
  if (id.includes("@")) return db.users.find((u) => u.email.toLowerCase() === id.toLowerCase());
  const phone = normalizePhone(id);
  return db.users.find((u) => normalizePhone(u.phone) === phone);
}

export function findUserForReset(identifier: string): User | undefined {
  return findUser(readDB(), identifier);
}

export function attemptLogin(identifier: string, password: string): LoginResult {
  const db = readDB();
  const now = Date.now();
  const key = identifier.includes("@") ? identifier.trim().toLowerCase() : normalizePhone(identifier);
  let rec = db.loginAttempts.find((a) => a.email === key);

  if (rec?.lockedUntil) {
    const until = new Date(rec.lockedUntil).getTime();
    if (until > now) return { ok: false, reason: "locked", minutesLeft: Math.ceil((until - now) / 60000) };
    rec.failed = 0; // lock has ended
    rec.lockedUntil = undefined;
  }

  const user = findUser(db, identifier);

  if (!user || user.password !== password) {
    if (!rec) {
      rec = { email: key, failed: 0 };
      db.loginAttempts.push(rec);
    }
    rec.failed += 1;
    addAudit(db, user?.id ?? "unknown", "login_failed", `Failed login for ${key}`);
    if (rec.failed >= MAX_FAILED_LOGINS) {
      rec.lockedUntil = new Date(now + LOCK_MINUTES * 60000).toISOString();
      addAudit(db, user?.id ?? "unknown", "account_locked", `Locked for ${LOCK_MINUTES} minutes after ${rec.failed} failed logins`);
      writeDB(db);
      return { ok: false, reason: "locked", minutesLeft: LOCK_MINUTES };
    }
    writeDB(db);
    return { ok: false, reason: "invalid", attemptsLeft: MAX_FAILED_LOGINS - rec.failed };
  }

  if (user.status === "suspended") return { ok: false, reason: "suspended" };

  if (rec) {
    rec.failed = 0;
    rec.lockedUntil = undefined;
  }
  addAudit(db, user.id, "login_success", "Password accepted");
  writeDB(db);
  return { ok: true, user };
}

export function isRegistrationAvailable(
  phone: string, email: string
): { ok: true } | { ok: false; field: "phone" | "email"; error: "phoneTaken" | "emailTaken" } {
  const db = readDB();
  if (findUser(db, phone)) return { ok: false, field: "phone", error: "phoneTaken" };
  if (email.trim() && findUser(db, email)) return { ok: false, field: "email", error: "emailTaken" };
  return { ok: true };
}

export function registerResident(input: RegisterInput): { ok: true; user: User } | { ok: false; error: "phoneTaken" | "emailTaken" } {
  const avail = isRegistrationAvailable(input.phone, input.email);
  if (!avail.ok) return { ok: false, error: avail.error };

  const db = readDB();
  const user: User = {
    id: newId("u"),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizePhone(input.phone),
    password: input.password,
    role: "resident",
    area: { district: "Bugesera", sector: input.sector, cell: input.cell, village: input.village },
    status: "active",
    language: input.language,
  };
  db.users.push(user);
  addAudit(db, user.id, "resident_registered", `New resident in ${input.sector}, ${input.cell}`);
  writeDB(db);
  return { ok: true, user };
}

export function resetPassword(userId: string, newPassword: string): void {
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return;
  user.password = newPassword;
  db.loginAttempts = db.loginAttempts.filter((a) => a.email !== user.email.toLowerCase() && a.email !== normalizePhone(user.phone));
  addAudit(db, user.id, "password_reset", "Password changed through reset");
  writeDB(db);
}
export function updateProfile(userId: string, data: Partial<User>): User | null {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;
  
  db.users[userIndex] = { ...db.users[userIndex], ...data };
  writeDB(db);
  return db.users[userIndex];
}

export function getLoginActivity(userId: string) {
  const db = readDB();
  // Filter audit logs for this user's login events
  return db.audit
    .filter(a => a.userId === userId && (a.action === "login_success" || a.action === "login_failed"))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}