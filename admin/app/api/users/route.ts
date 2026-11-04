import { z } from "zod";
import { api, json, parseBody } from "../../../lib/http";
import { User } from "../../../models/User";
import { hashPassword } from "../../../lib/password";
import { emailSchema, grantsSchema, nameSchema, passwordSchema } from "../../../lib/schemas";
import { normalizePermissions } from "../../../lib/permissions";
import { publicUser } from "../../../lib/serialize";
import { logActivity } from "../../../lib/activity";

export const GET = api("owner", async () => {
  const users = await User.find({ role: "manager" }).sort({ createdAt: -1 }).lean();
  return json({ users: users.map(publicUser) });
});

const createBody = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  permissions: grantsSchema.default([]),
});

// Only managers can be created here; the single Owner is created by the seed script.
export const POST = api("owner", async ({ req, user }) => {
  const input = await parseBody(req, createBody);
  const permissions = normalizePermissions(input.permissions);
  const doc = await User.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: "manager",
    active: true,
    permissions,
    createdBy: user.id,
  });
  await logActivity(user, {
    action: "manager.created",
    resourceType: "user",
    resourceId: String(doc._id),
    resourceLabel: doc.name,
    details: { email: doc.email },
  });
  if (permissions.length) {
    await logActivity(user, {
      action: "permission.granted",
      resourceType: "user",
      resourceId: String(doc._id),
      resourceLabel: doc.name,
      details: { granted: permissions.flatMap((p) => p.actions.map((a) => `${p.scope}:${a}`)) },
    });
  }
  return json({ user: publicUser(doc.toObject()) }, { status: 201 });
});
