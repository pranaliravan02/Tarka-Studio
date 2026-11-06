import { connectDb } from "./db";
import { can, DOMAINS, SCOPES, type Scope } from "./permissions";
import type { AuthUser } from "./users";
import { Project } from "../models/Project";
import { Client } from "../models/Client";
import { User } from "../models/User";
import { ActivityLog } from "../models/ActivityLog";

export interface ProjectRow {
  id: string;
  title: string;
  domain: string;
  domainLabel: string;
  status: "draft" | "published" | "unpublished";
  updatedAt: Date;
  createdAt: Date;
}
export interface ActivityRow {
  id: string;
  userName: string;
  action: string;
  resourceLabel?: string;
  createdAt: Date;
}

export interface Overview {
  totals: { projects: number; published: number; draft: number; unpublished: number };
  domains: number;
  videos: number;
  pdfProjects: number;
  clients: number | null; // null = this user may not view clients
  managers: number | null; // null = owner only
  byScope: { scope: Scope; label: string; count: number }[];
  recentUploaded: ProjectRow[];
  recentModified: ProjectRow[];
  recentPublishing: ProjectRow[];
  recentActivity: ActivityRow[] | null; // null = owner only
}

/** Everything on the overview comes from MongoDB, scoped to what this user is allowed to view. */
export async function getOverview(user: AuthUser): Promise<Overview> {
  await connectDb();
  const viewable = (Object.keys(SCOPES) as Scope[]).filter(
    (s) => SCOPES[s].group === "portfolio" && can(user, s, "view"),
  );
  const match = { domain: { $in: viewable } };

  const [grouped, recentUploaded, recentModified, recentPublishing, clients, managers, activity] = await Promise.all([
    Project.aggregate<{ _id: { domain: string; status: string }; n: number }>([
      { $match: match },
      { $group: { _id: { domain: "$domain", status: "$status" }, n: { $sum: 1 } } },
    ]),
    Project.find(match).sort({ createdAt: -1 }).limit(5).lean(),
    Project.find(match).sort({ updatedAt: -1 }).limit(5).lean(),
    Project.find({ ...match, status: "published" }).sort({ publishedAt: -1, updatedAt: -1 }).limit(5).lean(),
    can(user, "clients", "view") ? Client.countDocuments() : Promise.resolve(null),
    user.role === "owner" ? User.countDocuments({ role: "manager" }) : Promise.resolve(null),
    user.role === "owner" ? ActivityLog.find().sort({ createdAt: -1 }).limit(8).lean() : Promise.resolve(null),
  ]);

  const totals = { projects: 0, published: 0, draft: 0, unpublished: 0 };
  const perScope = new Map<string, number>();
  for (const g of grouped) {
    totals.projects += g.n;
    if (g._id.status in totals) totals[g._id.status as "published" | "draft" | "unpublished"] += g.n;
    perScope.set(g._id.domain, (perScope.get(g._id.domain) ?? 0) + g.n);
  }

  const label = (scope: string) => (scope in SCOPES ? SCOPES[scope as Scope].label : scope);
  const row = (p: (typeof recentUploaded)[number]): ProjectRow => ({
    id: String(p._id),
    title: p.title,
    domain: p.domain,
    domainLabel: label(p.domain),
    status: p.status ?? "draft",
    updatedAt: p.updatedAt,
    createdAt: p.createdAt,
  });

  return {
    totals,
    domains: DOMAINS.filter((d) => d.scopes.some((s) => viewable.includes(s))).length,
    videos: viewable.filter((s) => s.startsWith("video-")).reduce((n, s) => n + (perScope.get(s) ?? 0), 0),
    pdfProjects: perScope.get("product-design") ?? 0, // Product Design work is delivered as PDFs
    clients,
    managers,
    byScope: viewable.map((s) => ({ scope: s, label: label(s), count: perScope.get(s) ?? 0 })),
    recentUploaded: recentUploaded.map(row),
    recentModified: recentModified.map(row),
    recentPublishing: recentPublishing.map(row),
    recentActivity: activity?.map((a) => ({
      id: String(a._id),
      userName: a.userName,
      action: a.action,
      resourceLabel: a.resourceLabel ?? undefined,
      createdAt: a.createdAt,
    })) ?? null,
  };
}
