"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="login__form">
      <div>
        <p className="eyebrow"><b>●</b>&nbsp; Restricted area</p>
        <h1 className="display" style={{ marginTop: 10 }}>Welcome <em>back.</em></h1>
      </div>
      {state?.error && <div className="notice notice--error" role="alert">{state.error}</div>}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="username" required autoFocus defaultValue={state?.email ?? ""} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="btn btn--primary" disabled={pending} style={{ height: 48 }}>
        {pending ? "Signing in…" : "Sign in ↗"}
      </button>
    </form>
  );
}
