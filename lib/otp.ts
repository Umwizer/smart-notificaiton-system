// One-time codes for registration, password reset and the officials' security step.
// Prototype: codes are kept in the browser tab and shown on screen (simulated email/SMS).

export type OtpPurpose = "register" | "reset" | "mfa";
export type OtpChannel = "email" | "sms";

export const OTP_TTL_MS = 5 * 60 * 1000; // code lives 5 minutes
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_RESEND_MS = 30 * 1000; // wait 30 seconds before a new code

export interface OtpRecord {
  code: string;
  target: string;
  channel: OtpChannel;
  payload: unknown;
  expiresAt: number;
  sentAt: number;
  attempts: number;
}

export type OtpResult =
  | { status: "ok" }
  | { status: "wrong"; attemptsLeft: number }
  | { status: "expired" | "locked" | "none" };

const key = (purpose: OtpPurpose) => `scn-otp-${purpose}`;

function randomCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 900000;
  return String(100000 + n);
}

function save(purpose: OtpPurpose, rec: OtpRecord) {
  sessionStorage.setItem(key(purpose), JSON.stringify(rec));
}

export function getOtp(purpose: OtpPurpose): OtpRecord | null {
  try {
    const raw = sessionStorage.getItem(key(purpose));
    return raw ? (JSON.parse(raw) as OtpRecord) : null;
  } catch {
    return null;
  }
}

export function issueOtp(
  purpose: OtpPurpose, target: string, channel: OtpChannel, payload: unknown
): OtpRecord {
  const now = Date.now();
  const rec: OtpRecord = {
    code: randomCode(), target, channel, payload,
    expiresAt: now + OTP_TTL_MS, sentAt: now, attempts: 0,
  };
  save(purpose, rec);
  return rec;
}

export function resendOtp(purpose: OtpPurpose): OtpRecord | null {
  const old = getOtp(purpose);
  if (!old) return null;
  return issueOtp(purpose, old.target, old.channel, old.payload);
}

export function verifyOtp(purpose: OtpPurpose, input: string): OtpResult {
  const rec = getOtp(purpose);
  if (!rec) return { status: "none" };
  if (Date.now() > rec.expiresAt) return { status: "expired" };
  if (rec.attempts >= OTP_MAX_ATTEMPTS) return { status: "locked" };
  if (rec.code !== input) {
    rec.attempts += 1;
    save(purpose, rec);
    return rec.attempts >= OTP_MAX_ATTEMPTS
      ? { status: "locked" }
      : { status: "wrong", attemptsLeft: OTP_MAX_ATTEMPTS - rec.attempts };
  }
  return { status: "ok" };
}

export function clearOtp(purpose: OtpPurpose) {
  sessionStorage.removeItem(key(purpose));
}
