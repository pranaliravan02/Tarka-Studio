"use client";

export interface CatalogScope {
  id: string;
  label: string;
  group: "portfolio" | "clients" | "media";
  actions: readonly string[];
}
export type Grants = Record<string, string[]>;

const COLUMNS = ["view", "create", "edit", "delete", "publish", "unpublish", "reorder"] as const;
const GROUPS: { id: CatalogScope["group"]; title: string }[] = [
  { id: "portfolio", title: "Portfolio" },
  { id: "clients", title: "Clients" },
  { id: "media", title: "Media Library" },
];

export default function PermissionMatrix({ catalog, value, onChange, disabled }: {
  catalog: CatalogScope[]; value: Grants; onChange: (next: Grants) => void; disabled?: boolean;
}) {
  function toggle(scope: CatalogScope, action: string, on: boolean) {
    const cur = new Set(value[scope.id] ?? []);
    if (on) {
      cur.add(action);
      cur.add("view"); // can't edit what you can't see
    } else if (action === "view") {
      cur.clear(); // removing view removes everything for that section
    } else {
      cur.delete(action);
    }
    onChange({ ...value, [scope.id]: [...cur] });
  }
  const toggleAll = (scope: CatalogScope, on: boolean) => onChange({ ...value, [scope.id]: on ? [...scope.actions] : [] });

  return (
    <div className="table-wrap">
      <table className="matrix">
        <thead>
          <tr>
            <th>Section</th>
            <th>All</th>
            {COLUMNS.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {GROUPS.map((g) => (
            <GroupRows key={g.id} title={g.title} scopes={catalog.filter((s) => s.group === g.id)} value={value}
              disabled={disabled} toggle={toggle} toggleAll={toggleAll} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GroupRows({ title, scopes, value, disabled, toggle, toggleAll }: {
  title: string; scopes: CatalogScope[]; value: Grants; disabled?: boolean;
  toggle: (s: CatalogScope, a: string, on: boolean) => void; toggleAll: (s: CatalogScope, on: boolean) => void;
}) {
  if (!scopes.length) return null;
  return (
    <>
      <tr className="group"><td colSpan={COLUMNS.length + 2}>{title}</td></tr>
      {scopes.map((s) => {
        const granted = value[s.id] ?? [];
        const all = s.actions.every((a) => granted.includes(a));
        return (
          <tr key={s.id}>
            <td>{s.label}</td>
            <td>
              <input type="checkbox" className="check" aria-label={`All access to ${s.label}`} checked={all}
                disabled={disabled} onChange={(e) => toggleAll(s, e.target.checked)} />
            </td>
            {COLUMNS.map((c) =>
              s.actions.includes(c) ? (
                <td key={c}>
                  <input type="checkbox" className="check" aria-label={`${c} ${s.label}`} checked={granted.includes(c)}
                    disabled={disabled} onChange={(e) => toggle(s, c, e.target.checked)} />
                </td>
              ) : (
                <td key={c} className="na" aria-hidden="true">—</td>
              ),
            )}
          </tr>
        );
      })}
    </>
  );
}
