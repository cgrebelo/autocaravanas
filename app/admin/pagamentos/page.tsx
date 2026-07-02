import { AdminSidebar } from "@/components/AdminSidebar";
import { bookings } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";

export default function AdminPaymentsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Pagamentos e cauções</h1>
        <div className="mt-6 grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <h2 className="font-bold text-forest">{booking.customerName}</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-5">
                <p>Total: {formatCurrency(booking.total)}</p>
                <p>Sinal: {formatCurrency(booking.signalAmount)}</p>
                <p>Restante: {formatCurrency(booking.total - booking.signalAmount)}</p>
                <p>Caução: {formatCurrency(booking.depositAmount)}</p>
                <p>Estado: preparado</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Registar pagamento manual</button>
                <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Criar pagamento online</button>
                <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Marcar caução devolvida</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
