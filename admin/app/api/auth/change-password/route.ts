import { z } from "zod";
import { api, json, parseBody, HttpError } from "../../../../lib/http";
import { User } from "../../../../models/User";
import { hashPassword, verifyPassword } from "../../../../lib/password";
import { passwordSchema } from "../../../../lib/schemas";

const body = z.object({ currentPassword: z.string().max(128), newPassword: passwordSchema });

export const POST = api("user", async ({ req, user }) => {
  const { currentPassword, newPassword } = await parseBody(req, body);
  const doc = await User.findById(user.id).select("+passwordHash");
  if (!doc || !(await verifyPassword(currentPassword, doc.passwordHash))) {
    throw new HttpError(400, "Current password is incorrect", "BAD_CREDENTIALS");
  }
  doc.passwordHash = await hashPassword(newPassword);
  await doc.save();
  return json({ ok: true });
});
