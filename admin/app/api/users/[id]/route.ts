import { z } from "zod";
import { api, json, parseBody, HttpError, invalidId } from "../../../../lib/http";
import { User } from "../../../../models/User";
import { hashPassword } from "../../../../lib/password";
import { nameSchema, passwordSchema } from "../../../../lib/schemas";
import { publicUser } from "../../../../lib/serialize";
import { logActivity } from "../../../../lib/activity";

async function loadManager(id: string) {
  invalidId(id);
  const doc = await User.findById(id);
  if (!doc) throw new HttpError(404, "Not found", "NOT_FOUND");
  // The Owner account can never be modified through these endpoints.
  if (doc.role === "owner") throw new HttpError(403, "The Owner account cannot be modified here", "OWNER_PROTECTED");
  return doc;
}

export const GET = api<{ id: string }>("owner", async ({ params }) => {
  const doc = await loadManager(params.id);
  return json({ user: publicUser(doc.toObject()) });
});

const patchBody = z
  .object({ name: nameSchema, active: z.boolean(), password: passwordSchema })
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");

export const PATCH = api<{ id: string }>("owner", async ({ req, user, params }) => {
  const input = await parseBody(req, patchBody);
  const doc = await loadManager(params.id);
  const changes: string[] = [];

  if (input.name !== undefined && input.name !== doc.name) {
    doc.name = input.name;
    changes.push("name");
  }
  if (input.password !== undefined) {
    doc.passwordHash = await hashPassword(input.password);
    changes.push("password");
  }
  const activeChanged = input.active !== undefined && input.active !== doc.active;
  if (activeChanged) doc.active = input.active!;
  await doc.save();

  const base = { resourceType: "user", resourceId: String(doc._id), resourceLabel: doc.name };
  if (activeChanged) {
    await logActivity(user, { ...base, action: doc.active ? "manager.activated" : "manager.deactivated" });
  }
  if (changes.length) {
    await logActivity(user, { ...base, action: "manager.updated", details: { fields: changes } });
  }
  return json({ user: publicUser(doc.toObject()) });
});
