import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { loadAuthUser, type AuthUser } from "./users";

/** Current signed-in user for Server Components, re-read from MongoDB (never trusts the token's claims). */
export const getSessionUser = cache(async (): Promise<AuthUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  return id ? loadAuthUser(id) : null;
});

/** Every protected page calls this itself: layouts don't re-run on every client navigation. */
export async function requireUser(): Promise<AuthUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireOwner(): Promise<AuthUser> {
  const user = await requireUser();
  if (user.role !== "owner") redirect("/dashboard");
  return user;
}
