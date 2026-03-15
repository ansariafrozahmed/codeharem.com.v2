"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  apiUpdateProfile,
  apiChangePassword,
  apiSendVerification,
  apiVerifyEmail,
} from "@/lib/services/user.service";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-accent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Profile Settings</h1>

      <div className="space-y-8">
        <ProfileInfo user={user} onUpdate={refreshUser} />

        {!user.is_verified && (
          <EmailVerification onVerified={refreshUser} />
        )}

        {user.provider === "EMAIL" && <ChangePassword />}
      </div>
    </div>
  );
}

// ─── Profile Info Section ───

function ProfileInfo({
  user,
  onUpdate,
}: {
  user: { name: string | null; email: string; avatar: string | null; provider: string };
  onUpdate: () => Promise<void>;
}) {
  const [name, setName] = useState(user.name || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await apiUpdateProfile({ name });
      await onUpdate();
      setMessage("Profile updated");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#333] bg-[#242424] p-6">
      <h2 className="mb-4 text-lg font-semibold">General</h2>

      <div className="mb-4 flex items-center gap-4">
        {user.avatar ? (
          <img src={user.avatar} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-bold text-white">
            {(user.name || user.email)[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-medium">{user.name || "No name set"}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
          <p className="mt-1 text-xs text-gray-500">
            Signed in via {user.provider.toLowerCase()}
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm text-gray-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-300">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-gray-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}

// ─── Email Verification Section ───

function EmailVerification({ onVerified }: { onVerified: () => Promise<void> }) {
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleSendCode() {
    setError("");
    setMessage("");
    setSending(true);

    try {
      await apiSendVerification();
      setCodeSent(true);
      setMessage("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setVerifying(true);

    try {
      await apiVerifyEmail(code);
      await onVerified();
      setMessage("Email verified successfully!");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-6">
      <div className="mb-4 flex items-center gap-2">
        <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-lg font-semibold text-yellow-500">Email not verified</h2>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        Verify your email to access all features.
      </p>

      {message && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {!codeSent ? (
        <button
          onClick={handleSendCode}
          disabled={sending}
          className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send verification code"}
        </button>
      ) : (
        <form onSubmit={handleVerify} className="flex gap-3">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="6-digit code"
            className="w-40 rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-center text-sm tracking-widest text-white outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={verifying || code.length !== 6}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {verifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            onClick={handleSendCode}
            disabled={sending}
            className="text-sm text-gray-400 hover:text-white"
          >
            Resend
          </button>
        </form>
      )}
    </section>
  );
}

// ─── Change Password Section ───

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await apiChangePassword(currentPassword, newPassword);
      setMessage("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-[#333] bg-[#242424] p-6">
      <h2 className="mb-4 text-lg font-semibold">Change Password</h2>

      {message && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="mb-1 block text-sm text-gray-300">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="mb-1 block text-sm text-gray-300">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </section>
  );
}
