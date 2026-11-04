import { ActivityLog } from "../models/ActivityLog";
import type { AuthUser } from "./http";

export interface ActivityInput {
  action: string;
  resourceType?: string;
  resourceId?: string;
  resourceLabel?: string;
  domain?: string;
  details?: Record<string, unknown>;
}

/** Append-only audit record. A logging failure must never break the action itself. */
export async function logActivity(user: Pick<AuthUser, "id" | "name">, entry: ActivityInput) {
  try {
    await ActivityLog.create({ userId: user.id, userName: user.name, ...entry });
  } catch (err) {
    console.error("[activity] failed to write audit entry", err);
  }
}
