"use client";

import Link from "next/link";
import { LogOut, Menu, X } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { UserRole } from "@/lib/types";

const navLinks = [
  { href: "/autocaravanas", label: "Autocaravanas", visibility: "public" },
  { href: "/cliente", label: "Área do cliente", visibility: "authenticated" },
  { href: "/proprietario", label: "Proprietário", visibility: "owner" },
  { href: "/admin", label: "Admin", visibility: "admin" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      const supabase = createClient();

      supabase.auth.getSession().then(({ data }) => {
        if (isMounted) setSession(data.session);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
      });

      return () => {
        isMounted = false;
        listener.subscription.unsubscribe();
      };
    } catch {
      return () => {
        isMounted = false;
      };
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadUsername() {
      setUsername(null);
      setRole(null);
      if (!session?.user) return;

      try {
        const supabase = createClient();
        const { data } = await supabase.from("users").select("username").eq("id", session.user.id).maybeSingle();
        if (isMounted) setUsername(data?.username ?? null);
      } catch {
        if (isMounted) setUsername(null);
      }

      try {
        const supabase = createClient();
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
        if (isMounted) setRole((data?.role as UserRole | undefined) ?? null);
      } catch {
        if (isMounted) setRole(null);
      }
    }

    loadUsername();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const visibleNavLinks = useMemo(() => {
    return navLinks.filter((link) => {
      if (link.visibility === "public") return true;
      if (link.visibility === "authenticated") return Boolean(session);
      if (link.visibility === "owner") return role === "proprietario" || role === "administrador";
      if (link.visibility === "admin") return role === "administrador";
      return false;
    });
  }, [role, session]);

  const displayName = useMemo(() => {
    if (!session?.user) return null;
    return (
      username ||
      session.user.user_metadata?.full_name ||
      session.user.email?.split("@")[0] ||
      "Utilizador"
    );
  }, [session, username]);

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUsername(null);
      setRole(null);
      setIsOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link href="/" className="text-xl font-bold text-forest" onClick={() => setIsOpen(false)}>
          Rota Livre
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          {visibleNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {displayName ? (
            <div className="flex items-center gap-2">
              <span className="max-w-20 truncate text-sm font-semibold text-forest sm:max-w-36">{displayName}</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-stone-200 px-2 py-2 text-sm font-semibold text-road hover:border-forest hover:text-forest sm:gap-2 sm:px-3"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              onClick={() => setIsOpen(false)}
            >
              Entrar
            </Link>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 text-forest md:hidden"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="border-t border-stone-200 bg-white px-4 py-3 shadow-sm md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 text-sm font-medium text-stone-700">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 hover:bg-stone-100 hover:text-forest"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/registo"
              className={`rounded-md px-3 py-3 hover:bg-stone-100 hover:text-forest ${displayName ? "hidden" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              Criar conta
            </Link>
            {displayName ? (
              <div className="mt-2 border-t border-stone-200 pt-3">
                <p className="truncate px-3 text-sm font-semibold text-forest">{displayName}</p>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-3 text-left hover:bg-stone-100 hover:text-forest"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
