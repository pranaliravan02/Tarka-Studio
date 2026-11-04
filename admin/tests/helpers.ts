import { MongoMemoryServer } from "mongodb-memory-server";
import { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

export const OWNER = { email: "owner@tarka.test", password: "owner-password-123" };
export const ORIGIN = "http://localhost:5173";

let memory: MongoMemoryServer | undefined;

/** Uses TEST_MONGODB_URI if provided (any MongoDB-compatible server), otherwise an in-memory MongoDB. */
export async function setupEnv() {
  let uri = process.env.TEST_MONGODB_URI;
  if (!uri) {
    memory = await MongoMemoryServer.create();
    uri = memory.getUri();
  }
  const sep = uri.endsWith("/") ? "" : "/";
  process.env.MONGODB_URI = `${uri}${sep}tarka_test_${Date.now()}`;
  process.env.AUTH_SECRET = "test-secret-test-secret-test-secret-1234";
  process.env.ALLOWED_ORIGINS = ORIGIN;
}

export async function teardownEnv() {
  const mongoose = (await import("mongoose")).default;
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
  await memory?.stop();
}

interface Opts {
  body?: unknown;
  cookie?: string;
  origin?: string | null;
  ip?: string;
}

export function makeReq(method: string, path: string, opts: Opts = {}) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (opts.cookie) headers.cookie = `${COOKIE}=${opts.cookie}`;
  if (opts.origin !== null && method !== "GET") headers.origin = opts.origin ?? ORIGIN;
  if (opts.ip) headers["x-forwarded-for"] = opts.ip;
  return new NextRequest(`http://localhost:3001${path}`, {
    method,
    headers,
    body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
  });
}

export const COOKIE = "tarka.session";
export const sessionOf = (res: Response) => (res as NextResponse).cookies.get(COOKIE)?.value;
export const ctx = (id: string) => ({ params: Promise.resolve({ id }) });
