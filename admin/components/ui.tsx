import type { ReactNode } from "react";
import Link from "next/link";

export function PageHead({ eyebrow, title, em, children, actions }: {
  eyebrow: string; title: string; em?: string; children?: ReactNode; actions?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow"><b>●</b>&nbsp; {eyebrow}</p>
        <h1 className="display">{title}{em && <> <em>{em}</em></>}</h1>
        {children && <p>{children}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </header>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="card card--hover stat">
      <span className="eyebrow">{label}</span>
      <span className="stat__value">{value}</span>
      {hint && <span className="stat__hint">{hint}</span>}
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">◇</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function StatusDot({ status }: { status: "draft" | "published" | "unpublished" }) {
  return (
    <span className="mono" style={{ textTransform: "capitalize" }}>
      <span className={`dot dot--${status}`} />
      {status}
    </span>
  );
}

export const LinkButton = ({ href, children, primary }: { href: string; children: ReactNode; primary?: boolean }) => (
  <Link href={href} className={`btn ${primary ? "btn--primary" : ""}`}>{children}</Link>
);

export const DisabledButton = ({ children }: { children: ReactNode }) => (
  <span className="btn" aria-disabled="true" style={{ opacity: 0.4, cursor: "not-allowed" }} title="Arrives in a later phase">
    {children}
  </span>
);
