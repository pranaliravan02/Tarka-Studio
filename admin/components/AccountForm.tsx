"use client";

import { useState } from "react";

export default function AccountForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) return setMsg({ kind: "error", text: "The new passwords don't match." });
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      const issues = Array.isArray(data.issues) ? ": " + data.issues.map((i: { message: string }) => i.message).join(", ") : "";
      return setMsg({ kind: "error", text: (data.error ?? "Could not change password") + issues });
    }
    setCurrent(""); setNext(""); setConfirm("");
    setMsg({ kind: "ok", text: "Password updated." });
  }

  return (
    <form onSubmit={submit} className="card stack" style={{ maxWidth: 520 }}>
      <div className="card__title" style={{ margin: 0 }}><h2>Change password</h2></div>
      {msg && <div className={`notice ${msg.kind === "error" ? "notice--error" : ""}`} role={msg.kind === "error" ? "alert" : "status"}>{msg.text}</div>}
      <div className="field"><label htmlFor="cur">Current password</label>
        <input id="cur" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" /></div>
      <div className="field"><label htmlFor="new">New password</label>
        <input id="new" type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={12} maxLength={128} autoComplete="new-password" />
        <small>At least 12 characters.</small></div>
      <div className="field"><label htmlFor="conf">Confirm new password</label>
        <input id="conf" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" /></div>
      <div><button className="btn btn--primary" disabled={busy}>{busy ? "Saving…" : "Update password"}</button></div>
    </form>
  );
}
