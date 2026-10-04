import { redirect } from "next/navigation";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { Logo } from "@/components/Logo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card sm:p-8">
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="mt-1 text-sm text-muted">Gestion des véhicules MS Rent</p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
