import Link from "next/link";
import { Home, Inbox, PlusCircle, Truck } from "lucide-react";

const items = [
  { href: "/proprietario", label: "Dashboard", icon: Home },
  { href: "/proprietario/veiculos", label: "As minhas autocaravanas", icon: Truck },
  { href: "/proprietario/reservas", label: "Pedidos de reserva", icon: Inbox }
];

export function OwnerSidebar() {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-3">
      <nav className="grid gap-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-sand hover:text-forest">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        <Link href="/proprietario/veiculos" className="mt-2 flex items-center justify-center gap-2 rounded-md bg-clay px-3 py-2 text-sm font-semibold text-white">
          <PlusCircle className="h-4 w-4" />
          Anunciar autocaravana
        </Link>
      </nav>
    </aside>
  );
}
