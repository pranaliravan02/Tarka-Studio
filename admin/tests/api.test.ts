import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { encode } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { COOKIE, ctx, makeReq, OWNER, setupEnv, teardownEnv } from "./helpers";

type Handler = (req: any, c?: any) => Promise<Response>;
let authHandlers: { GET: Handler; POST: Handler }, me: Handler, usersRoute: { GET: Handler; POST: Handler };
let userRoute: { GET: Handler; PATCH: Handler }, permsRoute: { PUT: Handler };
let User: any, ActivityLog: any, hashPassword: (p: string) => Promise<string>, resetAllLimits: () => void;
let ownerCookie: string, ownerId: string;

const MGR_PW = "manager-password-123";

/** Real Auth.js flow: GET /csrf, then POST /callback/credentials. Returns status, session cookie value (if any) and redirect. */
async function signInFlow(email: string, password: string, ip = "1.1.1.1") {
  const base = "http://localhost:3001/api/auth";
  const csrfRes = await authHandlers.GET(new NextRequest(`${base}/csrf`));
  const { csrfToken } = await csrfRes.json();
  const csrfCookie = (csrfRes.headers.getSetCookie?.() ?? []).map((c: string) => c.split(";")[0]).join("; ");
  const res = await authHandlers.POST(
    new NextRequest(`${base}/callback/credentials`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", cookie: csrfCookie, "x-forwarded-for": ip, origin: ORIGIN_SELF, host: "localhost:3001" },
      body: new URLSearchParams({ email, password, csrfToken, redirect: "false", json: "true" }).toString(),
    }),
  );
  const set = res.headers.getSetCookie?.() ?? [];
  const sessionLine = set.find((c: string) => c.startsWith(`${COOKIE}=`));
  const cookie = sessionLine ? sessionLine.split(";")[0].slice(COOKIE.length + 1) : undefined;
  return { status: res.status, cookie, setCookie: sessionLine ?? "", location: res.headers.get("location") ?? "" };
}
const ORIGIN_SELF = "http://localhost:3001";
const loginAs = async (email: string, password: string, ip?: string) => (await signInFlow(email, password, ip)).cookie;
const mintToken = (sub: string, secret = process.env.AUTH_SECRET!) =>
  encode({ token: { sub }, secret, salt: COOKIE });

async function createManager(email: string, permissions: any[] = []) {
  const res = await usersRoute.POST(
    makeReq("POST", "/api/users", { cookie: ownerCookie, body: { name: "Mgr " + email, email, password: MGR_PW, permissions } }),
  );
  return { res, body: await res.clone().json() };
}

beforeAll(async () => {
  await setupEnv();
  authHandlers = await import("../app/api/auth/[...nextauth]/route");
  me = (await import("../app/api/auth/me/route")).GET;
  usersRoute = await import("../app/api/users/route");
  userRoute = await import("../app/api/users/[id]/route");
  permsRoute = await import("../app/api/users/[id]/permissions/route");
  ({ User } = await import("../models/User"));
  ({ ActivityLog } = await import("../models/ActivityLog"));
  ({ hashPassword } = await import("../lib/password"));
  ({ resetAllLimits } = await import("../lib/rateLimit"));
  const { connectDb } = await import("../lib/db");
  await connectDb();
  await User.syncIndexes();
  const owner = await User.create({
    name: "Owner", email: OWNER.email, passwordHash: await hashPassword(OWNER.password), role: "owner", active: true,
  });
  ownerId = String(owner._id);
  ownerCookie = (await loginAs(OWNER.email, OWNER.password))!;
});

afterAll(teardownEnv);
beforeEach(() => resetAllLimits());

describe("authentication (Auth.js)", () => {
  it("signs in with correct credentials and sets an httpOnly, SameSite=Lax session cookie", async () => {
    const r = await signInFlow(OWNER.email, OWNER.password);
    expect(r.cookie).toBeTruthy();
    expect(r.setCookie.toLowerCase()).toMatch(/httponly/);
    expect(r.setCookie.toLowerCase()).toMatch(/samesite=lax/);
    expect((await me(makeReq("GET", "/api/auth/me", { cookie: r.cookie }))).status).toBe(200);
  });

  it("rejects wrong password and unknown email without issuing a session", async () => {
    const a = await signInFlow(OWNER.email, "wrong-password-xyz");
    const b = await signInFlow("nobody@tarka.test", "wrong-password-xyz");
    expect(a.cookie).toBeUndefined();
    expect(b.cookie).toBeUndefined();
    expect(a.location).toBe(b.location);
  });

  it("rate-limits repeated failures, even for the correct password afterwards", async () => {
    for (let i = 0; i < 5; i++) await signInFlow(OWNER.email, "bad-password-000", "9.9.9.9");
    expect((await signInFlow(OWNER.email, OWNER.password, "9.9.9.9")).cookie).toBeUndefined();
    expect((await signInFlow(OWNER.email, OWNER.password, "8.8.8.8")).cookie).toBeTruthy(); // other IP unaffected
  });

  it("/me requires a valid session; rejects garbage, wrong-secret and unknown-user tokens", async () => {
    expect((await me(makeReq("GET", "/api/auth/me"))).status).toBe(401);
    expect((await me(makeReq("GET", "/api/auth/me", { cookie: "garbage" }))).status).toBe(401);
    const forged = await mintToken(ownerId, "a-different-secret-a-different-secret-0000");
    expect((await me(makeReq("GET", "/api/auth/me", { cookie: forged }))).status).toBe(401);
    const ghost = await mintToken("64b7f0c2a1b2c3d4e5f60718");
    expect((await me(makeReq("GET", "/api/auth/me", { cookie: ghost }))).status).toBe(401);
    expect((await me(makeReq("GET", "/api/auth/me", { cookie: await mintToken(ownerId) }))).status).toBe(200);
  });

  it("accepts mutating requests from the dashboard's own origin (Host match)", async () => {
    const req = new NextRequest("http://localhost:3001/api/users", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost:3001", host: "localhost:3001", cookie: `${COOKIE}=${ownerCookie}` },
      body: JSON.stringify({ name: "Same Origin", email: "same@tarka.test", password: MGR_PW }),
    });
    expect((await usersRoute.POST(req)).status).toBe(201);
  });

  it("rejects mutating API requests from a disallowed Origin", async () => {
    const res = await usersRoute.POST(makeReq("POST", "/api/users", { cookie: ownerCookie, origin: "https://evil.example", body: { name: "x", email: "e@tarka.test", password: MGR_PW } }));
    expect(res.status).toBe(403);
    expect(await User.countDocuments({ email: "e@tarka.test" })).toBe(0);
  });
});

describe("owner-only management & authorization", () => {
  it("owner creates a manager with normalized permissions and an audit trail", async () => {
    const { res, body } = await createManager("a@tarka.test", [{ scope: "photography", actions: ["publish", "create"] }]);
    expect(res.status).toBe(201);
    expect(body.user.role).toBe("manager");
    expect(body.user.permissions).toEqual([{ scope: "photography", actions: ["view", "create", "publish"] }]);
    expect(JSON.stringify(body)).not.toMatch(/passwordHash/);
    const actions = (await ActivityLog.find({ resourceLabel: "Mgr a@tarka.test" }).lean()).map((l: any) => l.action);
    expect(actions).toEqual(expect.arrayContaining(["manager.created", "permission.granted"]));
  });

  it("validates input: weak password, bad email, unknown scope, duplicate email", async () => {
    const weak = await usersRoute.POST(makeReq("POST", "/api/users", { cookie: ownerCookie, body: { name: "x", email: "w@tarka.test", password: "short" } }));
    expect(weak.status).toBe(400);
    const bad = await usersRoute.POST(makeReq("POST", "/api/users", { cookie: ownerCookie, body: { name: "x", email: "not-an-email", password: MGR_PW } }));
    expect(bad.status).toBe(400);
    const scope = await createManager("s@tarka.test", [{ scope: "nope", actions: ["view"] }]);
    expect(scope.res.status).toBe(400);
    await createManager("dup@tarka.test");
    expect((await createManager("dup@tarka.test")).res.status).toBe(409);
  });

  it("managers are blocked from every owner-only endpoint (enforced server-side)", async () => {
    const { body } = await createManager("m1@tarka.test", [{ scope: "marketing", actions: ["view", "edit"] }]);
    const cookie = (await loginAs("m1@tarka.test", MGR_PW))!;
    const id = body.user.id;
    expect((await usersRoute.GET(makeReq("GET", "/api/users", { cookie }))).status).toBe(403);
    expect((await usersRoute.POST(makeReq("POST", "/api/users", { cookie, body: { name: "x", email: "z@tarka.test", password: MGR_PW } }))).status).toBe(403);
    // self-escalation attempt
    const esc = await permsRoute.PUT(makeReq("PUT", `/api/users/${id}/permissions`, { cookie, body: { permissions: [{ scope: "product-design", actions: ["delete"] }] } }), ctx(id));
    expect(esc.status).toBe(403);
    expect((await userRoute.PATCH(makeReq("PATCH", `/api/users/${ownerId}`, { cookie, body: { active: false } }), ctx(ownerId))).status).toBe(403);
    const fresh = await User.findById(id).lean();
    expect(fresh.permissions).toEqual([{ scope: "marketing", actions: ["view", "edit"] }]);
  });

  it("unauthenticated callers get 401 on management endpoints", async () => {
    expect((await usersRoute.GET(makeReq("GET", "/api/users"))).status).toBe(401);
  });

  it("owner account is protected from edits, deactivation and permission changes", async () => {
    expect((await userRoute.PATCH(makeReq("PATCH", `/api/users/${ownerId}`, { cookie: ownerCookie, body: { active: false } }), ctx(ownerId))).status).toBe(403);
    expect((await permsRoute.PUT(makeReq("PUT", `/api/users/${ownerId}/permissions`, { cookie: ownerCookie, body: { permissions: [] } }), ctx(ownerId))).status).toBe(403);
    expect((await User.findById(ownerId).lean()).active).toBe(true);
  });

  it("role cannot be changed via PATCH, and a second owner cannot exist", async () => {
    const { body } = await createManager("m2@tarka.test");
    await userRoute.PATCH(makeReq("PATCH", `/api/users/${body.user.id}`, { cookie: ownerCookie, body: { role: "owner", name: "Renamed" } }), ctx(body.user.id));
    expect((await User.findById(body.user.id).lean()).role).toBe("manager");
    await expect(
      User.create({ name: "Second", email: "second-owner@tarka.test", passwordHash: "x", role: "owner" }),
    ).rejects.toThrow();
  });

  it("permission changes take effect and log granted/removed separately", async () => {
    const { body } = await createManager("m3@tarka.test", [{ scope: "marketing", actions: ["view", "edit"] }]);
    const id = body.user.id;
    const res = await permsRoute.PUT(
      makeReq("PUT", `/api/users/${id}/permissions`, { cookie: ownerCookie, body: { permissions: [{ scope: "marketing", actions: ["publish"] }] } }),
      ctx(id),
    );
    expect(res.status).toBe(200);
    expect((await res.json()).user.permissions).toEqual([{ scope: "marketing", actions: ["view", "publish"] }]);
    const logs = await ActivityLog.find({ resourceId: id }).lean();
    const grant = logs.find((l: any) => l.action === "permission.granted" && l.details.granted.includes("marketing:publish"));
    const removed = logs.find((l: any) => l.action === "permission.removed");
    expect(grant).toBeTruthy();
    expect(removed.details.removed).toEqual(["marketing:edit"]);
  });

  it("deactivation blocks login AND kills an already-issued session immediately; reactivation restores", async () => {
    const { body } = await createManager("m4@tarka.test");
    const id = body.user.id;
    const cookie = (await loginAs("m4@tarka.test", MGR_PW))!;
    expect((await me(makeReq("GET", "/api/auth/me", { cookie }))).status).toBe(200);

    await userRoute.PATCH(makeReq("PATCH", `/api/users/${id}`, { cookie: ownerCookie, body: { active: false } }), ctx(id));
    expect((await me(makeReq("GET", "/api/auth/me", { cookie }))).status).toBe(401);
    expect(await loginAs("m4@tarka.test", MGR_PW)).toBeUndefined();

    await userRoute.PATCH(makeReq("PATCH", `/api/users/${id}`, { cookie: ownerCookie, body: { active: true } }), ctx(id));
    expect((await me(makeReq("GET", "/api/auth/me", { cookie }))).status).toBe(200);
    const actions = (await ActivityLog.find({ resourceId: id }).lean()).map((l: any) => l.action);
    expect(actions).toEqual(expect.arrayContaining(["manager.deactivated", "manager.activated"]));
  });

  it("malformed ids return 404, malformed JSON returns 400", async () => {
    expect((await userRoute.GET(makeReq("GET", "/api/users/not-an-id", { cookie: ownerCookie }), ctx("not-an-id"))).status).toBe(404);
    const bad = new (await import("next/server")).NextRequest("http://localhost:3001/api/users", {
      method: "POST", headers: { origin: "http://localhost:5173", cookie: `${COOKIE}=${ownerCookie}` }, body: "{not json",
    });
    expect((await usersRoute.POST(bad)).status).toBe(400);
  });
});

describe("audit log integrity", () => {
  it("entries cannot be updated or deleted", async () => {
    const entry = await ActivityLog.findOne().lean();
    await expect(ActivityLog.updateOne({ _id: entry._id }, { action: "tampered" })).rejects.toThrow(/append-only/);
    await expect(ActivityLog.deleteMany({})).rejects.toThrow(/append-only/);
    await expect(ActivityLog.findOneAndUpdate({ _id: entry._id }, { action: "x" })).rejects.toThrow(/append-only/);
    expect(await ActivityLog.countDocuments()).toBeGreaterThan(0);
  });
});
