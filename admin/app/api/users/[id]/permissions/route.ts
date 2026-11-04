import { z } from "zod";
import { api, json, parseBody, HttpError, invalidId } from "../../../../../lib/http";
import { User } from "../../../../../models/User";
import { grantsSchema } from "../../../../../lib/schemas";
import { diffPermissions, normalizePermissions } from "../../../../../lib/permissions";
import { publicUser } from "../../../../../lib/serialize";
import { logActivity } from "../../../../../lib/activity";

const body = z.object({ permissions: grantsSchema });

/** Owner-only. Replaces a manager's full permission set (so any action can be added or removed independently). */
export const PUT = api<{ id: string }>("owner", async ({ req, user, params }) => {
  invalidId(params.id);
  const input = await parseBody(req, body);
  const next = normalizePermissions(input.permissions);

  const doc = await User.findById(params.id);
  if (!doc) throw new HttpError(404, "Not found", "NOT_FOUND");
  if (doc.role === "owner") throw new HttpError(403, "The Owner account cannot be modified here", "OWNER_PROTECTED");

  const before = (doc.permissions ?? []).map((p) => ({ scope: p.scope, actions: [...p.actions] }));
  const { granted, removed } = diffPermissions(before, next);
  doc.set("permissions", next);
  await doc.save();

  const base = { resourceType: "user", resourceId: String(doc._id), resourceLabel: doc.name };
  if (granted.length) await logActivity(user, { ...base, action: "permission.granted", details: { granted } });
  if (removed.length) await logActivity(user, { ...base, action: "permission.removed", details: { removed } });
  return json({ user: publicUser(doc.toObject()) });
});
