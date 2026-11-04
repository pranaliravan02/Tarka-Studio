import { api, json } from "../../../lib/http";
import { permissionCatalog } from "../../../lib/permissions";

/** Catalog of scopes/actions, used by the dashboard to render the permission matrix. */
export const GET = api("user", async () => json({ catalog: permissionCatalog() }));
