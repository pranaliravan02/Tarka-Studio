import type { Metadata } from "next";
import Link from "next/link";
import { requireOwner } from "../../../lib/session";
import { connectDb } from "../../../lib/db";
import { User } from "../../../models/User";
import { timeAgo } from "../../../lib/format";
import { EmptyState, LinkButton, PageHead } from "../../../components/ui";

export const metadata: Metadata = { title: "Managers" };
export const dynamic = "force-dynamic";

export default async function ManagersPage() {
  await requireOwner();
  await connectDb();
  const managers = await User.find({ role: "manager" }).sort({ createdAt: -1 }).lean();

  return (
    <>
      <PageHead
        eyebrow="User management"
        title="Managers &"
        em="permissions"
        actions={<LinkButton href="/dashboard/managers/new" primary>New manager</LinkButton>}
      >
        Only you can create managers and decide what each one may see and do.
      </PageHead>

      {managers.length === 0 ? (
        <EmptyState
          title="No managers yet"
          text="Create a manager account, then choose which sections and actions they can use."
          action={<LinkButton href="/dashboard/managers/new" primary>Create the first manager</LinkButton>}
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Access</th><th>Status</th><th>Last sign-in</th><th /></tr>
            </thead>
            <tbody>
              {managers.map((m) => {
                const actions = (m.permissions ?? []).reduce((n, p) => n + p.actions.length, 0);
                return (
                  <tr key={String(m._id)}>
                    <td>{m.name}</td>
                    <td style={{ color: "var(--muted)" }}>{m.email}</td>
                    <td>{m.permissions?.length ? `${m.permissions.length} sections · ${actions} actions` : "No access"}</td>
                    <td><span className={`tag ${m.active ? "tag--on" : ""}`}>{m.active ? "Active" : "Deactivated"}</span></td>
                    <td className="mono">{m.lastLoginAt ? timeAgo(m.lastLoginAt) : "Never"}</td>
                    <td><Link href={`/dashboard/managers/${m._id}`} className="btn btn--sm">Edit</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
