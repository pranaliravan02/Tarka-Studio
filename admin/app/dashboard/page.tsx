import type { Metadata } from "next";
import { requireUser } from "../../lib/session";
import { can, PROJECT_SCOPE_IDS } from "../../lib/permissions";
import { getOverview, type ProjectRow } from "../../lib/stats";
import { actionLabel, timeAgo } from "../../lib/format";
import { DisabledButton, EmptyState, LinkButton, PageHead, StatCard, StatusDot } from "../../components/ui";

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

function ProjectList({ rows, empty }: { rows: ProjectRow[]; empty: string }) {
  if (!rows.length) return <EmptyState title="Nothing here yet" text={empty} />;
  return (
    <div className="list">
      {rows.map((p) => (
        <div key={p.id} className="list__row">
          <div className="list__main">
            <div className="list__title">{p.title}</div>
            <div className="list__meta">{p.domainLabel}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <StatusDot status={p.status} />
            <div className="mono">{timeAgo(p.updatedAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function OverviewPage() {
  const user = await requireUser();
  const o = await getOverview(user);
  const { totals } = o;
  const pct = (n: number) => (totals.projects ? (n / totals.projects) * 100 : 0);
  const max = Math.max(1, ...o.byScope.map((s) => s.count));
  const first = user.name.split(" ")[0];
  const canCreate = PROJECT_SCOPE_IDS.some((s) => can(user, s, "create"));

  return (
    <>
      <PageHead
        eyebrow={user.role === "owner" ? "Owner overview" : "Your workspace"}
        title={`Hello, ${first}.`}
        actions={
          <>
            {user.role === "owner" && <LinkButton href="/dashboard/managers" primary>Manage team</LinkButton>}
            {canCreate && <DisabledButton>New project</DisabledButton>}
          </>
        }
      >
        {o.byScope.length === 0
          ? "You don't have access to any portfolio sections yet. Ask the Owner to grant access."
          : totals.projects
            ? `${totals.published} of ${totals.projects} projects are live on the public site.`
            : "Your portfolio is empty. Projects you add will appear here, live from the database."}
      </PageHead>

      <section className="grid grid--stats" aria-label="Key numbers">
        <StatCard label="Total projects" value={totals.projects} />
        <StatCard label="Published" value={totals.published} hint="Live on the website" />
        <StatCard label="Drafts" value={totals.draft} />
        <StatCard label="Unpublished" value={totals.unpublished} />
        <StatCard label="Domains" value={o.domains} />
        <StatCard label="Videos" value={o.videos} />
        <StatCard label="PDF projects" value={o.pdfProjects} hint="Product Design" />
        {o.clients !== null && <StatCard label="Clients" value={o.clients} />}
        {o.managers !== null && <StatCard label="Managers" value={o.managers} />}
      </section>

      <section className="grid grid--two">
        <div className="card card--start">
          <div className="card__title"><h2>Publication status</h2><span className="eyebrow">{totals.projects} total</span></div>
          {totals.projects ? (
            <>
              <div className="status-bar" role="img" aria-label={`${totals.published} published, ${totals.draft} drafts, ${totals.unpublished} unpublished`}>
                <i style={{ width: `${pct(totals.published)}%`, background: "var(--blue-light)" }} />
                <i style={{ width: `${pct(totals.draft)}%`, background: "var(--white)" }} />
                <i style={{ width: `${pct(totals.unpublished)}%`, background: "var(--muted)" }} />
              </div>
              <div className="legend">
                <span><span className="dot dot--published" />Published {totals.published}</span>
                <span><span className="dot dot--draft" />Draft {totals.draft}</span>
                <span><span className="dot dot--unpublished" />Unpublished {totals.unpublished}</span>
              </div>
            </>
          ) : (
            <EmptyState title="No projects yet" text="Once projects exist, you'll see how many are live, drafted or hidden." />
          )}
        </div>

        <div className="card">
          <div className="card__title"><h2>Projects by section</h2></div>
          {o.byScope.length ? (
            <div className="bars">
              {o.byScope.map((s) => (
                <div key={s.scope} className="bar">
                  <span>{s.label}</span>
                  <span className="bar__track"><span className="bar__fill" style={{ width: `${(s.count / max) * 100}%` }} /></span>
                  <span>{s.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No sections assigned" text="The Owner hasn't given you access to any portfolio section yet." />
          )}
        </div>
      </section>

      <section className="grid grid--two">
        <div className="card">
          <div className="card__title"><h2>Recently uploaded</h2></div>
          <ProjectList rows={o.recentUploaded} empty="Newly added projects show up here." />
        </div>
        <div className="card">
          <div className="card__title"><h2>Recently modified</h2></div>
          <ProjectList rows={o.recentModified} empty="Edits to existing projects show up here." />
        </div>
        <div className="card">
          <div className="card__title"><h2>Recent publishing</h2></div>
          <ProjectList rows={o.recentPublishing} empty="Projects you publish will be listed here." />
        </div>
        {o.recentActivity && (
          <div className="card">
            <div className="card__title"><h2>Team activity</h2><span className="eyebrow">Latest</span></div>
            {o.recentActivity.length ? (
              <div className="list">
                {o.recentActivity.map((a) => (
                  <div key={a.id} className="list__row">
                    <div className="list__main">
                      <div className="list__title">{a.userName} <span style={{ color: "var(--muted)" }}>{actionLabel(a.action).toLowerCase()}</span> {a.resourceLabel}</div>
                    </div>
                    <span className="mono">{timeAgo(a.createdAt)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No activity yet" text="Sign-ins, edits and permission changes will be recorded here." />
            )}
          </div>
        )}
      </section>
    </>
  );
}
