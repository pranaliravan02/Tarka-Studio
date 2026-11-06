"use server";

import { AuthError } from "next-auth";
import { signIn } from "../../lib/auth";

export async function loginAction(_prev: { error?: string; email?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  try {
    await signIn("credentials", {
      email,
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Invalid email or password, or too many attempts. Try again shortly.", email };
    }
    throw err; // the success redirect is thrown as an error and must propagate
  }
}
