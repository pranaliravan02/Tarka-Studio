import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import mongoose from "mongoose";
import { connectDb } from "./db";
import { env } from "./env";
import { getToken } from "next-auth/jwt";
import { sessionCookieName } from "./authConfig";
import { loadAuthUser, type AuthUser } from "./users";
import { can, PermissionInputError, type Action, type Scope } from "./permissions";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export type { AuthUser };

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** CSRF defence in depth (on top of SameSite=Lax): a browser-sent Origin must be on the allow-list. */
function assertAllowedOrigin(req: NextRequest) {
  if (!MUTATING.has(req.method)) return;
  const origin = req.headers.get("origin");
  if (!origin) return;
  if (env().allowedOrigins.includes(origin)) return;
  // The dashboard itself calls these APIs from the same origin.
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    if (host && new URL(origin).host === host) return;
  } catch {
    /* malformed Origin falls through to rejection */
  }
  throw new HttpError(403, "Origin not allowed", "BAD_ORIGIN");
}

export async function currentUser(req: NextRequest): Promise<AuthUser | null> {
  const cookieName = sessionCookieName();
  const token = await getToken({
    req,
    secret: env().AUTH_SECRET,
    cookieName,
    salt: cookieName,
    secureCookie: env().NODE_ENV === "production",
  });
  return token?.sub ? loadAuthUser(token.sub) : null; // deactivation takes effect immediately
}

export function requirePermission(user: AuthUser, scope: Scope, action: Action) {
  if (!can(user, scope, action)) throw new HttpError(403, "You do not have permission to do this", "FORBIDDEN");
}

export async function parseBody<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON", "BAD_JSON");
  }
  return schema.parse(raw);
}

export const json = (data: unknown, init?: ResponseInit) => NextResponse.json(data, init);

type Auth = "none" | "user" | "owner";
interface Ctx<P> {
  req: NextRequest;
  user: AuthUser;
  params: P;
}

/**
 * Wraps a route handler with: origin check, DB connect, authentication (and owner-only gate),
 * and uniform error responses. Per-action permission checks are done in the handler via requirePermission().
 */
export function api<P = Record<string, string>>(
  auth: Auth,
  handler: (ctx: Ctx<P>) => Promise<Response>,
) {
  return async (req: NextRequest, routeCtx?: { params: Promise<P> }): Promise<Response> => {
    try {
      assertAllowedOrigin(req);
      await connectDb();
      let user = null as AuthUser | null;
      if (auth !== "none") {
        user = await currentUser(req);
        if (!user) throw new HttpError(401, "Authentication required", "UNAUTHENTICATED");
        if (auth === "owner" && user.role !== "owner") {
          throw new HttpError(403, "Only the Owner can do this", "OWNER_ONLY");
        }
      }
      const params = (routeCtx ? await routeCtx.params : {}) as P;
      return await handler({ req, user: user as AuthUser, params });
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export function errorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return json({ error: err.message, code: err.code }, { status: err.status });
  }
  if (err instanceof ZodError) {
    return json(
      {
        error: "Validation failed",
        code: "VALIDATION",
        issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 400 },
    );
  }
  if (err instanceof PermissionInputError) {
    return json({ error: err.message, code: "VALIDATION" }, { status: 400 });
  }
  if ((err as { code?: number })?.code === 11000) {
    return json({ error: "A record with that value already exists", code: "DUPLICATE" }, { status: 409 });
  }
  console.error("[api] unhandled error", err);
  return json({ error: "Something went wrong", code: "INTERNAL" }, { status: 500 });
}

export function invalidId(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, "Not found", "NOT_FOUND");
}
