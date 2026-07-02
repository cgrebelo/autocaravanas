import { AdminSidebar } from "@/components/AdminSidebar";
import { bookings, documents, vehicles } from "@/lib/sample-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminPage() {
  const pending = bookings.filter((booking) => booking.status.includes("aguardar")).length;
  const revenue = bookings.reduce((sum, booking) => sum + booking.total, 0);
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Dashboard geral</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Reservas este mês", bookings.length],
            ["Receita prevista", formatCurrency(revenue)],
            ["Receita recebida", formatCurrency(bookings[0].signalAmount)],
            ["Reservas pendentes", pending],
            ["Documentos por validar", documents.filter((d) => d.status === "pendente").length],
            ["Veículos ativos", vehicles.length]
          ].map(([label, value]) => <div key={label} className="rounded-lg bg-white p-4 shadow-soft"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 text-2xl font-bold text-forest">{value}</p></div>)}
        </div>
        <div className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold text-forest">Próximas entregas e recolhas</h2>
          <div className="mt-4 grid gap-3">
            {bookings.map((booking) => <p key={booking.id} className="rounded-md bg-sand p-3">{booking.customerName}: {formatDate(booking.startDate)} a {formatDate(booking.endDate)}</p>)}
          </div>
        </div>
      </section>
    </main>
  );
}
