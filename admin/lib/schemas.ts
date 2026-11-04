import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "./password";

export const emailSchema = z.email().max(254);
export const passwordSchema = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(128);
export const nameSchema = z.string().trim().min(1).max(120);
export const grantsSchema = z.array(
  z.object({ scope: z.string(), actions: z.array(z.string()) }),
).max(100);
