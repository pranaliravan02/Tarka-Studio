import { connectDb } from "./db";
import { dummyHash, verifyPassword } from "./password";
import { checkLimit, clearLimit, recordFailure } from "./rateLimit";
import { logActivity } from "./activity";
import { User } from "../models/User";

const WINDOW = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export interface SignedInUser {
  id: string;
  name: string;
  email: string;
}

/**
 * The credentials check behind Auth.js. Returns null for every failure mode
 * (unknown email, wrong password, deactivated, rate-limited) so callers can't tell them apart.
 */
export async function authorizeCredentials(
  rawEmail: unknown,
  rawPassword: unknown,
  ip = "unknown",
): Promise<SignedInUser | null> {
  if (typeof rawEmail !== "string" || typeof rawPassword !== "string") return null;
  if (rawEmail.length > 254 || rawPassword.length > 128) return null;

  const email = rawEmail.trim().toLowerCase();
  const key = `${email}|${ip}`;
  if (!checkLimit(key, MAX_FAILURES).allowed) return null;

  await connectDb();
  const user = await User.findOne({ email }).select("+passwordHash");
  // Always run a bcrypt compare so timing doesn't reveal whether the email exists.
  const ok = await verifyPassword(rawPassword, user?.passwordHash ?? (await dummyHash()));
  if (!user || !ok || !user.active) {
    recordFailure(key, WINDOW);
    return null;
  }

  clearLimit(key);
  user.lastLoginAt = new Date();
  await user.save();
  await logActivity({ id: String(user._id), name: user.name }, { action: "auth.login" });
  return { id: String(user._id), name: user.name, email: user.email };
}
