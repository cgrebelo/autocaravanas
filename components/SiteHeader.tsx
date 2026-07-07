"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/autocaravanas", label: "Autocaravanas" },
  { href: "/cliente", label: "Área do cliente" },
  { href: "/proprietario", label: "Proprietário" },
  { href: "/admin", label: "Admin" }
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <Link href="/" className="text-xl font-bold text-forest" onClick={() => setIsOpen(false)}>
          Rota Livre
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-forest">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Entrar
          </Link>
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
            {navLinks.map((link) => (
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
              className="rounded-md px-3 py-3 hover:bg-stone-100 hover:text-forest"
              onClick={() => setIsOpen(false)}
            >
              Criar conta
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
