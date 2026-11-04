# Tarka Admin (Next.js)

Dashboard + REST APIs for the Tarka portfolio CMS. The public Vite site (repo root `src/`) is unchanged.

## Run
```bash
cd admin
cp .env.example .env.local      # fill MONGODB_URI (Atlas) and AUTH_SECRET (openssl rand -base64 48)
npm install
OWNER_EMAIL=you@tarka.com OWNER_PASSWORD='at-least-12-chars' npm run seed:owner   # once
npm run dev                     # http://localhost:3001
npm test                        # uses an in-memory MongoDB, or TEST_MONGODB_URI if set
```

## Foundation (Phase 2)
- Auth.js v5 (credentials, JWT cookie) · bcrypt (cost 12) · login rate limit
- Server-side RBAC: `lib/permissions.ts` (catalog) + `lib/http.ts` (`api("owner" | "user")`, `requirePermission`)
- Session holds only the user id; role/active/permissions are re-read from MongoDB each request
- Single Owner (DB-enforced), protected from every API edit; Owner-only manager + permission management
- Append-only audit log (`models/ActivityLog.ts`)
