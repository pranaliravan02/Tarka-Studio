import mongoose from "mongoose";
import { env } from "./env";

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { __tarkaMongo?: Cache };
const cache: Cache = (g.__tarkaMongo ??= { conn: null, promise: null });

/** Reuses one connection across hot reloads and serverless invocations. */
export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(env().MONGODB_URI, { bufferCommands: false });
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
