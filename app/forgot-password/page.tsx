"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import AuthCard from "@/components/auth/AuthCard";
import { issueOtp, verifyOtp } from "@/lib/otp";
import { findUserForReset, resetPassword } from "@/lib/authService";
import { checkPassword } from "@/lib/password";
import PasswordStrength from "@/components/auth/PasswordStrength";

export default function ForgotPasswordPage() {
  const { t } = useLang();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const passCheck = checkPassword(newPassword);

  // Step 1: Check if user exists, then issue OTP
  function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    const user = findUserForReset(identifier);
    if (!user) {
      // For security, don't reveal if user exists. Just pretend we sent it.
      setStep(2);
      return;
    }

    // Use email if they have one, otherwise use phone
    const target = user.email || user.phone;
    const rec = issueOtp("reset", target, user.email ? "email" : "sms", { userId: user.id });
    setDemoCode(rec.code);
    setStep(2);
  }

  // Step 2: Verify the 6-digit code
  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = verifyOtp("reset", code);
    
    if (res.status === "ok") {
      setStep(3);
    } else if (res.status === "wrong") {
      setError(`Incorrect code. ${res.attemptsLeft} attempts left.`);
    } else {
      setError("Invalid or expired code. Please try again.");
    }
  }

  // Step 3: Save new password
  function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!passCheck.valid) {
      setError("Password does not meet requirements.");
      return;
    }

    const user = findUserForReset(identifier);
    if (user) {
      resetPassword(user.id, newPassword);
      router.push("/login");
    }
  }

  return (
    <AuthCard title="Reset Password" subtitle="Recover access to your account">
      
      {/* STEP 1: Enter Email/Phone */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">{t.auth.identifierLabel}</label>
            <input 
              required 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              placeholder="e.g. 0788000011 or admin@scns.rw"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition">
            Send Reset Code
          </button>
        </form>
      )}

      {/* STEP 2: Enter OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-muted mb-2">We sent a 6-digit code to {identifier}</p>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Verification Code</label>
            <input 
              required 
              maxLength={6} 
              value={code} 
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} 
              className="w-full text-center tracking-[0.5em] text-lg rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" 
            />
          </div>
          {demoCode && (
            <div className="p-2 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
              Demo Code: {demoCode}
            </div>
          )}
          {error && <div className="p-2 bg-red-50 text-alert text-sm rounded">{error}</div>}
          <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition">
            Verify Code
          </button>
        </form>
      )}

      {/* STEP 3: Enter New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-xs text-muted hover:text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <PasswordStrength password={newPassword} />
          </div>
          {error && <div className="p-2 bg-red-50 text-alert text-sm rounded">{error}</div>}
          <button 
            type="submit" 
            disabled={!passCheck.valid}
            className="w-full bg-primary text-white py-2.5 rounded-md font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            Save New Password
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-primary font-semibold hover:underline">Back to login</Link>
      </div>
    </AuthCard>
  );
}