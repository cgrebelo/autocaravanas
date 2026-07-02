import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rota Livre Autocaravanas",
  description: "Plataforma de aluguer direto de autocaravanas em Portugal."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-forest">Rota Livre</Link>
            <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 md:flex">
              <Link href="/autocaravanas">Autocaravanas</Link>
              <Link href="/cliente">Área do cliente</Link>
              <Link href="/admin">Admin</Link>
            </nav>
            <Link href="/login" className="rounded-md bg-clay px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Entrar</Link>
          </div>
        </header>
        {children}
        <footer className="border-t border-stone-200 bg-forest text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4">
            <div>
              <p className="text-lg font-bold">Rota Livre</p>
              <p className="mt-2 text-sm text-white/75">Aluguer direto de frota própria de autocaravanas.</p>
            </div>
            <div><p className="font-semibold">Contactos</p><p className="mt-2 text-sm text-white/75">reservas@rotalivre.pt<br />+351 900 000 000</p></div>
            <div><p className="font-semibold">Legal</p><p className="mt-2 text-sm text-white/75">Termos e condições<br />Política de privacidade</p></div>
            <div><p className="font-semibold">Recolha</p><p className="mt-2 text-sm text-white/75">Lisboa, Porto e Algarve por marcação.</p></div>
          </div>
        </footer>
      </body>
    </html>
  );
}
