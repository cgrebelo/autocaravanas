import Link from "next/link";
import { CalendarDays, CreditCard, FileCheck, Home, MessageSquare, Settings, Truck, Users } from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/utilizadores", label: "Utilizadores", icon: Users },
  { href: "/admin/veiculos", label: "Veículos", icon: Truck },
  { href: "/admin/reservas", label: "Reservas", icon: Users },
  { href: "/admin/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/admin/documentos", label: "Documentos", icon: FileCheck },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/cliente/mensagens", label: "Mensagens", icon: MessageSquare }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-3">
      <nav className="grid gap-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-sand hover:text-forest">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
