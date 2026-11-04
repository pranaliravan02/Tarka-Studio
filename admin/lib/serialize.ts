import type { UserDoc } from "../models/User";

/** Public shape of a user. Never includes the password hash. */
export function publicUser(doc: Partial<UserDoc> & { _id: unknown }) {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    active: doc.active,
    permissions: (doc.permissions ?? []).map((p) => ({ scope: p.scope, actions: [...p.actions] })),
    lastLoginAt: doc.lastLoginAt ?? null,
    createdAt: (doc as { createdAt?: Date }).createdAt ?? null,
  };
}
