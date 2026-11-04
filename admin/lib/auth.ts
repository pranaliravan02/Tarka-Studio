import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "./env";
import { sessionCookieName } from "./authConfig";
import { authorizeCredentials } from "./credentials";

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Auth.js (v5) with a credentials provider and stateless JWT sessions.
 * The token only carries the user id: role, active flag and permissions are re-read
 * from MongoDB on every protected request (see lib/http.ts), so changes apply instantly.
 */
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  secret: env().AUTH_SECRET,
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      name: sessionCookieName(),
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: env().NODE_ENV === "production" },
    },
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials, request) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        return authorizeCredentials(credentials?.email, credentials?.password, ip);
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
}));
