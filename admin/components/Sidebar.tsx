"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem, NavSection } from "../lib/nav";
import { signOutAction } from "../app/actions";

function Item({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
  return (
    <>
      {item.ready ? (
        <Link href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
          {item.label}
        </Link>
      ) : (
        <span className="nav-link nav-link--disabled" aria-disabled="true">
          {item.label}
          <span className="nav-soon">Soon</span>
        </span>
      )}
      {item.children && (
        <div className="nav-children">
          {item.children.map((c) => <Item key={c.href} item={c} pathname={pathname} />)}
        </div>
      )}
    </>
  );
}

export default function Sidebar({ sections, user }: { sections: NavSection[]; user: { name: string; role: string } }) {
  const pathname = usePathname();
  // The drawer is "open" only for the path it was opened on, so it closes itself on navigation.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (value: boolean) => setOpenedOn(value ? pathname : null);

  return (
    <>
      <div className="topbar">
        <span className="brand">TARKA<sup>ADMIN</sup></span>
        <button className="menu-btn" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}>
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M0 1h18M0 6h18M0 11h18" /></svg>
        </button>
      </div>
      <div className="scrim" data-open={open} onClick={() => setOpen(false)} />
      <aside className="sidebar" data-open={open} aria-label="Dashboard navigation">
        <div className="sidebar__head">
          <Link href="/dashboard" className="brand">TARKA<sup>ADMIN</sup></Link>
        </div>
        <nav className="sidebar__nav">
          {sections.map((section, i) => (
            <div key={section.title || i}>
              {section.title && <p className="eyebrow nav-title">{section.title}</p>}
              {section.items.map((item) => <Item key={item.href} item={item} pathname={pathname} />)}
            </div>
          ))}
        </nav>
        <div className="sidebar__foot">
          <div className="me">
            <span className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
            <div style={{ minWidth: 0 }}>
              <div className="me__name">{user.name}</div>
              <div className="me__role">{user.role}</div>
            </div>
          </div>
          <form action={signOutAction}><button className="btn btn--sm" style={{ width: "100%" }}>Sign out</button></form>
        </div>
      </aside>
    </>
  );
}
