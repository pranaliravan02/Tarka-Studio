import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  NODE_ENV: z.string().default("development"),
});

export type Env = z.infer<typeof schema> & { allowedOrigins: string[] };

let cached: Env | undefined;

/** Validated server environment. Throws a clear error if misconfigured. Never import from client code. */
export function env(): Env {
  if (!cached) {
    const parsed = schema.parse(process.env);
    cached = {
      ...parsed,
      allowedOrigins: parsed.ALLOWED_ORIGINS.split(",")
        .map((o) => o.trim())
        .filter(Boolean),
    };
  }
  return cached;
}
