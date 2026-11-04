import { env } from "./env";

const PROD = () => env().NODE_ENV === "production";

/** Fixed cookie name so server-side code (getToken) and Auth.js always agree. */
export const sessionCookieName = () => (PROD() ? "__Secure-tarka.session" : "tarka.session");
