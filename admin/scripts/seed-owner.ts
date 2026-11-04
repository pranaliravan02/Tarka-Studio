/* Creates the single Owner account. Refuses to run if an Owner already exists (never overwrites). */
import mongoose from "mongoose";
import { connectDb } from "../lib/db";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../lib/password";
import { User } from "../models/User";

async function main() {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD;
  const name = process.env.OWNER_NAME?.trim() || "Owner";
  if (!email || !password) throw new Error("Set OWNER_EMAIL and OWNER_PASSWORD");
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`OWNER_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters`);

  await connectDb();
  if (await User.exists({ role: "owner" })) {
    console.log("An Owner already exists. Nothing changed.");
    return;
  }
  await User.create({ name, email, passwordHash: await hashPassword(password), role: "owner", active: true });
  console.log(`Owner created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
