import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rota Livre Autocaravanas",
  description: "Plataforma de aluguer direto de autocaravanas em Portugal."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t border-stone-200 bg-forest text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4">
            <div>
              <p className="text-lg font-bold">Rota Livre</p>
              <p className="mt-2 text-sm text-white/75">Marketplace português para alugar e anunciar autocaravanas.</p>
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
