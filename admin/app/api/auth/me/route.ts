import { api, json } from "../../../../lib/http";

export const GET = api("user", async ({ user }) => json({ user }));
