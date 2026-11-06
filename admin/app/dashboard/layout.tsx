import { requireUser } from "../../lib/session";
import { buildNav } from "../../lib/nav";
import Sidebar from "../../components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="shell">
      <Sidebar sections={buildNav(user)} user={{ name: user.name, role: user.role }} />
      <div className="main">
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
