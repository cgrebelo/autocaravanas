import { BookingStatusBadge } from "@/components/BookingStatusBadge";
import { bookings, vehicles } from "@/lib/sample-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ClientBookingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-forest">Reservas</h1>
      <div className="mt-6 grid gap-4">
        {bookings.map((booking) => {
          const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
          return (
            <article key={booking.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-forest">{vehicle?.name}</h2>
                  <p className="text-stone-600">{formatDate(booking.startDate)} a {formatDate(booking.endDate)} · {booking.guests} pessoas</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <p>Total: {formatCurrency(booking.total)}</p>
                <p>Sinal: {formatCurrency(booking.signalAmount)}</p>
                <p>Caução: {formatCurrency(booking.depositAmount)}</p>
                <p>Extras: {booking.extras.join(", ") || "Sem extras"}</p>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
