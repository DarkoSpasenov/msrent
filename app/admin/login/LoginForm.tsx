"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6">
      <label htmlFor="password" className="label">
        Mot de passe
      </label>
      <input id="password" name="password" type="password" autoComplete="current-password" required autoFocus className="field" />
      {state?.error && (
        <p className="mt-3 text-sm font-medium text-signal" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark mt-5 w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
