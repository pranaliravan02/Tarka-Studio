export function timeAgo(date: Date | string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(date).getTime()) / 1000));
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const LABELS: Record<string, string> = {
  "auth.login": "Signed in",
  "manager.created": "Created manager",
  "manager.updated": "Updated manager",
  "manager.activated": "Activated manager",
  "manager.deactivated": "Deactivated manager",
  "permission.granted": "Granted permissions to",
  "permission.removed": "Removed permissions from",
  "project.created": "Uploaded project",
  "project.updated": "Edited project",
  "project.deleted": "Deleted project",
  "project.published": "Published project",
  "project.unpublished": "Unpublished project",
  "project.reordered": "Reordered projects",
  "client.created": "Added client",
  "client.updated": "Edited client",
  "client.logo_changed": "Changed logo for",
};
export const actionLabel = (action: string) => LABELS[action] ?? action;
