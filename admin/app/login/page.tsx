import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "../../lib/session";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return (
    <main className="login">
      <section className="login__art">
        <span className="brand">TARKA<sup>ADMIN</sup></span>
        <h2 className="display login__headline">Run the studio, <em>not the code.</em></h2>
        <p className="eyebrow">Portfolio · Clients · Media</p>
      </section>
      <section className="login__panel"><LoginForm /></section>
    </main>
  );
}
