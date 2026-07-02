import { AdminSidebar } from "@/components/AdminSidebar";
import { BookingStatusBadge } from "@/components/BookingStatusBadge";
import { bookings, vehicles } from "@/lib/sample-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminBookingsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Gestão de reservas</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <select className="rounded-md border border-stone-300 bg-white px-3 py-2"><option>Filtrar por estado</option></select>
          <select className="rounded-md border border-stone-300 bg-white px-3 py-2"><option>Filtrar por veículo</option></select>
          <input type="date" className="rounded-md border border-stone-300 bg-white px-3 py-2" />
          <button className="rounded-md border border-moss px-3 py-2 font-semibold text-forest">Exportar CSV</button>
        </div>
        <div className="mt-6 grid gap-4">
          {bookings.map((booking) => {
            const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
            return (
              <article key={booking.id} className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <h2 className="text-xl font-bold text-forest">{booking.customerName}</h2>
                    <p className="text-stone-600">{vehicle?.name} · {formatDate(booking.startDate)} a {formatDate(booking.endDate)}</p>
                    {booking.message && <p className="mt-2 text-sm text-stone-600">Mensagem: {booking.message}</p>}
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Aprovar</button>
                  <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">Recusar</button>
                  <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Alterar estado</button>
                  <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Resumo</button>
                  <span className="ml-auto text-sm font-semibold text-road">{formatCurrency(booking.total)}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
