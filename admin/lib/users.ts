import mongoose from "mongoose";
import { connectDb } from "./db";
import { User } from "../models/User";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager";
  active: boolean;
  permissions: { scope: string; actions: string[] }[];
}

/** Fresh read of the account (role, active flag, permissions). Null if missing or deactivated. */
export async function loadAuthUser(id: string): Promise<AuthUser | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectDb();
  const doc = await User.findById(id).lean();
  if (!doc || !doc.active) return null;
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    active: doc.active,
    permissions: (doc.permissions ?? []).map((p) => ({ scope: p.scope, actions: [...p.actions] })),
  };
}
