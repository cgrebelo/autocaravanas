"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export function AdminAccessGuard({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "allowed" | "denied">("loading");

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) {
          if (isMounted) setState("denied");
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store"
        });
        const result = await response.json();
        if (isMounted) setState(result.user?.role === "administrador" ? "allowed" : "denied");
      } catch {
        if (isMounted) setState("denied");
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <p className="font-semibold text-forest">A verificar acesso...</p>
        </div>
      </main>
    );
  }

  if (state === "denied") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h1 className="text-2xl font-bold text-forest">Área reservada</h1>
          <p className="mt-2 text-stone-600">Esta área só está disponível para administradores.</p>
          <Link href="/" className="mt-5 inline-flex rounded-md bg-forest px-4 py-2 font-semibold text-white">
            Voltar ao início
          </Link>
        </div>
      </main>
    );
  }

  return children;
}
