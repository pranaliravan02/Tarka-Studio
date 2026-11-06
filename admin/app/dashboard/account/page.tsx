import type { Metadata } from "next";
import { requireUser } from "../../../lib/session";
import AccountForm from "../../../components/AccountForm";
import { PageHead } from "../../../components/ui";
import { SCOPES, type Scope } from "../../../lib/permissions";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageHead eyebrow="Settings" title="Your" em="account">{user.email}</PageHead>
      <AccountForm />
      {user.role === "manager" && (
        <div className="card" style={{ maxWidth: 520 }}>
          <div className="card__title"><h2>Your access</h2></div>
          {user.permissions.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>The Owner hasn&apos;t granted you access to anything yet.</p>
          ) : (
            <div className="list">
              {user.permissions.map((p) => (
                <div key={p.scope} className="list__row">
                  <span>{SCOPES[p.scope as Scope]?.label ?? p.scope}</span>
                  <span className="mono">{p.actions.join(", ")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
