import { describe, expect, it } from "vitest";
import { can, diffPermissions, normalizePermissions, PermissionInputError } from "../lib/permissions";

const mgr = (permissions: { scope: string; actions: string[] }[], active = true) => ({
  role: "manager" as const,
  active,
  permissions,
});

describe("permission logic", () => {
  it("owner can do anything, inactive nothing", () => {
    expect(can({ role: "owner", active: true, permissions: [] }, "photography", "delete")).toBe(true);
    expect(can({ role: "owner", active: false, permissions: [] }, "photography", "view")).toBe(false);
  });

  it("manager gets only explicitly granted actions, per scope", () => {
    const m = mgr([{ scope: "product-design", actions: ["view", "create", "edit"] }]);
    expect(can(m, "product-design", "edit")).toBe(true);
    expect(can(m, "product-design", "publish")).toBe(false);
    expect(can(m, "graphic-design", "view")).toBe(false);
  });

  it("normalize: implies view, merges duplicates, drops empty, rejects unknown", () => {
    const out = normalizePermissions([
      { scope: "photography", actions: ["publish"] },
      { scope: "photography", actions: ["create"] },
      { scope: "marketing", actions: [] },
    ]);
    expect(out).toEqual([{ scope: "photography", actions: ["view", "create", "publish"] }]);
    expect(() => normalizePermissions([{ scope: "nope", actions: ["view"] }])).toThrow(PermissionInputError);
    expect(() => normalizePermissions([{ scope: "clients", actions: ["publish"] }])).toThrow(PermissionInputError);
  });

  it("diff reports granted and removed pairs", () => {
    const d = diffPermissions(
      [{ scope: "marketing", actions: ["view", "edit"] }],
      [{ scope: "marketing", actions: ["view", "publish"] }],
    );
    expect(d).toEqual({ granted: ["marketing:publish"], removed: ["marketing:edit"] });
  });
});
