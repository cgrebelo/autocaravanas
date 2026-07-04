import { BookingStatusBadge } from "@/components/BookingStatusBadge";
import { OwnerSidebar } from "@/components/OwnerSidebar";
import { getAdminVehicles, getBookings } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

const currentOwnerId = "o1";

export const dynamic = "force-dynamic";

export default async function OwnerBookingsPage() {
  const [vehicles, bookings] = await Promise.all([getAdminVehicles(), getBookings()]);
  const ownerVehicles = vehicles.filter((vehicle) => vehicle.ownerId === currentOwnerId);
  const ownerBookings = bookings.filter((booking) => ownerVehicles.some((vehicle) => vehicle.id === booking.vehicleId));

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <OwnerSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Pedidos de reserva</h1>
        <div className="mt-6 grid gap-4">
          {ownerBookings.map((booking) => {
            const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
            return (
              <article key={booking.id} className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-forest">{vehicle?.name}</h2>
                    <p className="text-stone-600">{booking.customerName} · {formatDate(booking.startDate)} a {formatDate(booking.endDate)} · {formatCurrency(booking.total)}</p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Pré-aprovar</button>
                  <button className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700">Recusar</button>
                  <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Mensagem ao cliente</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
