/**
 * Permission catalog and checks. Single source of truth for what can be granted.
 * Adding a domain or action later = add an entry here; no schema change needed.
 */

export const PROJECT_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "publish",
  "unpublish",
  "reorder",
] as const;

export type Action = "view" | "create" | "edit" | "delete" | "publish" | "unpublish" | "reorder";

export interface ScopeDef {
  label: string;
  group: "portfolio" | "clients" | "media";
  actions: readonly Action[];
}

const project = (label: string): ScopeDef => ({
  label,
  group: "portfolio",
  actions: PROJECT_ACTIONS,
});

export const SCOPES = {
  "product-design": project("Product Design"),
  "graphic-design": project("Graphic Design"),
  "ui-ux": project("UI/UX Design"),
  "web-development": project("Web Development"),
  marketing: project("Marketing"),
  "video-ai": project("Video · AI-Generated"),
  "video-stop-motion": project("Video · Stop-Motion"),
  "video-marketing": project("Video · Marketing Content"),
  "video-saas": project("Video · SaaS"),
  "video-motion-graphics": project("Video · Motion Graphics"),
  photography: project("Photography"),
  // Edit covers logo changes and Client Strip visibility.
  clients: {
    label: "Clients",
    group: "clients",
    actions: ["view", "create", "edit", "delete"],
  },
  media: { label: "Media Library", group: "media", actions: ["view", "create", "delete"] },
} as const satisfies Record<string, ScopeDef>;

export type Scope = keyof typeof SCOPES;
export const SCOPE_IDS = Object.keys(SCOPES) as Scope[];
export const PROJECT_SCOPE_IDS = SCOPE_IDS.filter((s) => SCOPES[s].group === "portfolio");

export interface PermissionGrant {
  scope: string;
  actions: string[];
}

export interface PrincipalLike {
  role: "owner" | "manager";
  active: boolean;
  permissions: readonly PermissionGrant[];
}

export function isScope(value: string): value is Scope {
  return Object.prototype.hasOwnProperty.call(SCOPES, value);
}

/** Owner can do everything; managers only what is explicitly granted; inactive accounts nothing. */
export function can(user: PrincipalLike, scope: Scope, action: Action): boolean {
  if (!user.active) return false;
  if (user.role === "owner") return true;
  const grant = user.permissions.find((p) => p.scope === scope);
  return !!grant && grant.actions.includes(action);
}

export class PermissionInputError extends Error {}

/**
 * Validates and canonicalises a permission set from client input:
 * unknown scopes/actions are rejected, duplicates merged, empty grants dropped,
 * and any non-view action implies view (a manager can't edit what they can't see).
 */
export function normalizePermissions(input: readonly PermissionGrant[]): PermissionGrant[] {
  const merged = new Map<Scope, Set<Action>>();
  for (const grant of input) {
    if (!isScope(grant.scope)) throw new PermissionInputError(`Unknown permission scope: ${grant.scope}`);
    const allowed = SCOPES[grant.scope].actions;
    const set = merged.get(grant.scope) ?? new Set<Action>();
    for (const action of grant.actions) {
      if (!(allowed as readonly string[]).includes(action)) {
        throw new PermissionInputError(`Action "${action}" is not valid for ${grant.scope}`);
      }
      set.add(action as Action);
    }
    merged.set(grant.scope, set);
  }
  const out: PermissionGrant[] = [];
  for (const scope of SCOPE_IDS) {
    const set = merged.get(scope);
    if (!set || set.size === 0) continue;
    set.add("view");
    out.push({ scope, actions: SCOPES[scope].actions.filter((a) => set.has(a)) });
  }
  return out;
}

const flatten = (grants: readonly PermissionGrant[]) =>
  new Set(grants.flatMap((g) => g.actions.map((a) => `${g.scope}:${a}`)));

/** Which `scope:action` pairs were added/removed — used for audit entries. */
export function diffPermissions(before: readonly PermissionGrant[], after: readonly PermissionGrant[]) {
  const b = flatten(before);
  const a = flatten(after);
  return {
    granted: [...a].filter((x) => !b.has(x)),
    removed: [...b].filter((x) => !a.has(x)),
  };
}

export const permissionCatalog = () =>
  SCOPE_IDS.map((id) => ({ id, label: SCOPES[id].label, group: SCOPES[id].group, actions: SCOPES[id].actions }));

/** Public-facing domains (the six on the website). One domain can span several permission scopes. */
export const DOMAINS = [
  { id: "product-design", label: "Product Design", scopes: ["product-design"] },
  { id: "graphic-design", label: "Graphic Design", scopes: ["graphic-design"] },
  { id: "uiux-web", label: "UI/UX & Web", scopes: ["ui-ux", "web-development"] },
  { id: "marketing", label: "Marketing", scopes: ["marketing"] },
  {
    id: "video-generation",
    label: "Video Generation",
    scopes: ["video-ai", "video-stop-motion", "video-marketing", "video-saas", "video-motion-graphics"],
  },
  { id: "photography", label: "Photography", scopes: ["photography"] },
] as const satisfies readonly { id: string; label: string; scopes: readonly Scope[] }[];
