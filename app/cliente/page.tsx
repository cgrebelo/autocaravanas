import Link from "next/link";
import { BookingStatusBadge } from "@/components/BookingStatusBadge";
import { bookings, documents, messages, vehicles } from "@/lib/sample-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientDashboardPage() {
  const nextBooking = bookings[0];
  const vehicle = vehicles.find((item) => item.id === nextBooking.vehicleId);
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-forest">Área do cliente</h1>
      <div className="mt-6 grid gap-5 md:grid-cols-4">
        <Link href="/cliente/reservas" className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Próximas reservas</p><p className="mt-2 text-3xl font-bold text-forest">{bookings.length}</p></Link>
        <Link href="/cliente/documentos" className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Documentos pendentes</p><p className="mt-2 text-3xl font-bold text-forest">{documents.filter((d) => d.status === "pendente").length}</p></Link>
        <div className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Pagamentos pendentes</p><p className="mt-2 text-3xl font-bold text-forest">{formatCurrency(nextBooking.signalAmount)}</p></div>
        <Link href="/cliente/mensagens" className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Mensagens recentes</p><p className="mt-2 text-3xl font-bold text-forest">{messages.length}</p></Link>
      </div>
      <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
        <h2 className="text-xl font-bold text-forest">Reserva em destaque</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <p><span className="text-sm text-stone-500">Veículo</span><br />{vehicle?.name}</p>
          <p><span className="text-sm text-stone-500">Datas</span><br />{formatDate(nextBooking.startDate)} a {formatDate(nextBooking.endDate)}</p>
          <p><span className="text-sm text-stone-500">Total</span><br />{formatCurrency(nextBooking.total)}</p>
          <p><span className="text-sm text-stone-500">Estado</span><br /><BookingStatusBadge status={nextBooking.status} /></p>
          <p><span className="text-sm text-stone-500">Recolha</span><br />Morada visível após confirmação</p>
        </div>
      </section>
    </main>
  );
}
