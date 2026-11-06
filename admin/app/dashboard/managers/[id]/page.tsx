import type { Metadata } from "next";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { requireOwner } from "../../../../lib/session";
import { connectDb } from "../../../../lib/db";
import { permissionCatalog } from "../../../../lib/permissions";
import { User } from "../../../../models/User";
import ManagerForm from "../../../../components/ManagerForm";
import { PageHead } from "../../../../components/ui";

export const metadata: Metadata = { title: "Edit manager" };
export const dynamic = "force-dynamic";

export default async function EditManagerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDb();
  const m = await User.findById(id).lean();
  if (!m || m.role !== "manager") notFound();

  return (
    <>
      <PageHead eyebrow="User management" title={m.name} em="">
        {m.email}
      </PageHead>
      <ManagerForm
        mode="edit"
        catalog={permissionCatalog().map((s) => ({ ...s, actions: [...s.actions] }))}
        initial={{
          id: String(m._id),
          name: m.name,
          email: m.email,
          active: m.active,
          permissions: (m.permissions ?? []).map((p) => ({ scope: p.scope, actions: [...p.actions] })),
        }}
      />
    </>
  );
}
