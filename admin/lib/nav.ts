import { can, SCOPES, type Scope } from "./permissions";
import type { AuthUser } from "./users";

export interface NavItem {
  label: string;
  href: string;
  /** false = page not built yet: rendered disabled with a "Soon" tag, never a dead link. */
  ready: boolean;
  children?: NavItem[];
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

const portfolio = (label: string, scope: Scope, href: string): NavItem => ({ label, href, ready: false });

/** Sidebar structure, filtered by what this user may see. Owner sees everything. */
export function buildNav(user: AuthUser): NavSection[] {
  const view = (scope: Scope) => can(user, scope, "view");
  const owner = user.role === "owner";
  const sections: NavSection[] = [{ title: "", items: [{ label: "Overview", href: "/dashboard", ready: true }] }];

  const videoScopes: [Scope, string][] = [
    ["video-ai", "AI-Generated Videos"],
    ["video-stop-motion", "Stop-Motion Videos"],
    ["video-marketing", "Marketing Content Videos"],
    ["video-saas", "SaaS Videos"],
    ["video-motion-graphics", "Motion Graphics"],
  ];
  const videoChildren = videoScopes.filter(([s]) => view(s)).map(([s, l]) => portfolio(l, s, `/dashboard/projects/${s}`));

  const items: NavItem[] = [];
  const anyPortfolio = (Object.keys(SCOPES) as Scope[]).some((s) => SCOPES[s].group === "portfolio" && view(s));
  if (anyPortfolio) items.push({ label: "All Projects", href: "/dashboard/projects", ready: false });
  const single: [Scope, string][] = [
    ["product-design", "Product Design"],
    ["graphic-design", "Graphic Design"],
    ["ui-ux", "UI/UX Design"],
    ["web-development", "Web Development"],
    ["marketing", "Marketing"],
  ];
  for (const [s, l] of single) if (view(s)) items.push(portfolio(l, s, `/dashboard/projects/${s}`));
  if (videoChildren.length) {
    items.push({ label: "Video Generation", href: "/dashboard/projects/video", ready: false, children: videoChildren });
  }
  if (view("photography")) items.push(portfolio("Photography", "photography", "/dashboard/projects/photography"));
  if (items.length) sections.push({ title: "Portfolio", items });

  if (view("clients")) {
    const c: NavItem[] = [{ label: "All Clients", href: "/dashboard/clients", ready: false }];
    if (can(user, "clients", "create")) c.push({ label: "Add Client", href: "/dashboard/clients/new", ready: false });
    if (can(user, "clients", "edit")) c.push({ label: "Client Strip", href: "/dashboard/clients/strip", ready: false });
    sections.push({ title: "Clients", items: c });
  }

  if (view("media")) {
    sections.push({
      title: "Media Library",
      items: ["Images", "Videos", "PDFs", "Project Covers", "Logos"].map((l) => ({
        label: l,
        href: `/dashboard/media/${l.toLowerCase().replace(/\s+/g, "-")}`,
        ready: false,
      })),
    });
  }

  if (owner) {
    sections.push({ title: "User Management", items: [{ label: "Managers & Permissions", href: "/dashboard/managers", ready: true }] });
    sections.push({ title: "Activity", items: [{ label: "Activity Log", href: "/dashboard/activity", ready: false }] });
  }

  const settings: NavItem[] = [];
  if (owner) settings.push({ label: "Dashboard Settings", href: "/dashboard/settings", ready: false });
  settings.push({ label: "Account Settings", href: "/dashboard/account", ready: true });
  sections.push({ title: "Settings", items: settings });
  return sections;
}
