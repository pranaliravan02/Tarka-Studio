import type { Metadata } from "next";
import { requireOwner } from "../../../../lib/session";
import { permissionCatalog } from "../../../../lib/permissions";
import ManagerForm from "../../../../components/ManagerForm";
import { PageHead } from "../../../../components/ui";

export const metadata: Metadata = { title: "New manager" };

export default async function NewManagerPage() {
  await requireOwner();
  return (
    <>
      <PageHead eyebrow="User management" title="New" em="manager">
        Set up the account and choose their access. You can change it any time.
      </PageHead>
      <ManagerForm mode="create" catalog={permissionCatalog().map((s) => ({ ...s, actions: [...s.actions] }))} />
    </>
  );
}
