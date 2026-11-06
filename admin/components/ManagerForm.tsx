"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PermissionMatrix, { type CatalogScope, type Grants } from "./PermissionMatrix";

interface Props {
  mode: "create" | "edit";
  catalog: CatalogScope[];
  initial?: { id: string; name: string; email: string; active: boolean; permissions: { scope: string; actions: string[] }[] };
}

async function call(url: string, method: string, body: unknown) {
  const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issues = Array.isArray(data.issues) ? ": " + data.issues.map((i: { message: string }) => i.message).join(", ") : "";
    throw new Error((data.error ?? "Request failed") + issues);
  }
  return data;
}

export default function ManagerForm({ mode, catalog, initial }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(initial?.active ?? true);
  const [grants, setGrants] = useState<Grants>(
    Object.fromEntries((initial?.permissions ?? []).map((p) => [p.scope, p.actions])),
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const toList = () => Object.entries(grants).filter(([, a]) => a.length).map(([scope, actions]) => ({ scope, actions }));

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      if (mode === "create") {
        const { user } = await call("/api/users", "POST", { name, email, password, permissions: toList() });
        router.push(`/dashboard/managers/${user.id}`);
        return;
      }
      const id = initial!.id;
      const patch: Record<string, string> = {};
      if (name !== initial!.name) patch.name = name;
      if (password) patch.password = password;
      if (Object.keys(patch).length) await call(`/api/users/${id}`, "PATCH", patch);
      await call(`/api/users/${id}/permissions`, "PUT", { permissions: toList() });
      setPassword("");
      setMsg({ kind: "ok", text: "Changes saved." });
      router.refresh();
    });
  };

  const toggleActive = () =>
    run(async () => {
      if (active && !window.confirm(`Deactivate ${initial!.name}? They will be signed out immediately.`)) return;
      await call(`/api/users/${initial!.id}`, "PATCH", { active: !active });
      setActive(!active);
      setMsg({ kind: "ok", text: active ? "Manager deactivated." : "Manager reactivated." });
      router.refresh();
    });

  return (
    <form onSubmit={submit} className="stack">
      {msg && (
        <div className={`notice ${msg.kind === "error" ? "notice--error" : ""}`} role={msg.kind === "error" ? "alert" : "status"}>
          {msg.text}
        </div>
      )}
      <div className="card stack">
        <div className="card__title" style={{ margin: 0 }}>
          <h2>Account</h2>
          {mode === "edit" && <span className={`tag ${active ? "tag--on" : ""}`}>{active ? "Active" : "Deactivated"}</span>}
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required readOnly={mode === "edit"} />
          </div>
          <div className="field">
            <label htmlFor="password">{mode === "create" ? "Password" : "Reset password"}</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required={mode === "create"} minLength={12} maxLength={128} autoComplete="new-password"
              placeholder={mode === "edit" ? "Leave blank to keep current" : ""} />
            <small>At least 12 characters.</small>
          </div>
        </div>
      </div>

      <div className="stack">
        <div>
          <h2 className="display" style={{ fontSize: 24 }}>Permissions</h2>
          <p style={{ color: "var(--muted)", marginTop: 6 }}>
            Choose exactly what this manager can do, section by section. Granting any action also grants View.
          </p>
        </div>
        <PermissionMatrix catalog={catalog} value={grants} onChange={setGrants} disabled={busy} />
      </div>

      <div className="row-between">
        <div className="actions">
          <button className="btn btn--primary" disabled={busy}>
            {busy ? "Saving…" : mode === "create" ? "Create manager" : "Save changes"}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => router.push("/dashboard/managers")} disabled={busy}>
            Back
          </button>
        </div>
        {mode === "edit" && (
          <button type="button" className="btn" onClick={toggleActive} disabled={busy}>
            {active ? "Deactivate account" : "Reactivate account"}
          </button>
        )}
      </div>
    </form>
  );
}
