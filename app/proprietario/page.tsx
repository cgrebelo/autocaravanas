import { OwnerSidebar } from "@/components/OwnerSidebar";
import { bookings, owners, vehicles } from "@/lib/sample-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookingStatusBadge } from "@/components/BookingStatusBadge";

const currentOwnerId = "o1";

export default function OwnerDashboardPage() {
  const owner = owners.find((item) => item.id === currentOwnerId);
  const ownerVehicles = vehicles.filter((vehicle) => vehicle.ownerId === currentOwnerId);
  const ownerBookings = bookings.filter((booking) => ownerVehicles.some((vehicle) => vehicle.id === booking.vehicleId));
  const revenue = ownerBookings.reduce((sum, booking) => sum + booking.total, 0);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <OwnerSidebar />
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-clay">Área do proprietário</p>
        <h1 className="mt-2 text-3xl font-bold text-forest">{owner?.displayName}</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Autocaravanas</p><p className="mt-2 text-3xl font-bold text-forest">{ownerVehicles.length}</p></div>
          <div className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Pedidos</p><p className="mt-2 text-3xl font-bold text-forest">{ownerBookings.length}</p></div>
          <div className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Receita prevista</p><p className="mt-2 text-3xl font-bold text-forest">{formatCurrency(revenue)}</p></div>
          <div className="rounded-lg bg-white p-5 shadow-soft"><p className="text-sm text-stone-500">Pagamentos</p><p className="mt-2 text-xl font-bold text-forest">{owner?.payoutStatus}</p></div>
        </div>
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold text-forest">Reservas recentes</h2>
          <div className="mt-4 grid gap-3">
            {ownerBookings.map((booking) => (
              <div key={booking.id} className="flex flex-col justify-between gap-3 rounded-md bg-sand p-3 md:flex-row md:items-center">
                <p>{booking.customerName} · {formatDate(booking.startDate)} a {formatDate(booking.endDate)}</p>
                <BookingStatusBadge status={booking.status} />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
