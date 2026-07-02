import { AdminSidebar } from "@/components/AdminSidebar";
import { BookingCalendar } from "@/components/BookingCalendar";
import { vehicles } from "@/lib/sample-data";

export default function AdminCalendarPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Calendário</h1>
        <form className="mt-5 grid gap-3 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-4">
          <select className="rounded-md border border-stone-300 px-3 py-2">{vehicles.map((vehicle) => <option key={vehicle.id}>{vehicle.name}</option>)}</select>
          <input type="date" className="rounded-md border border-stone-300 px-3 py-2" />
          <input type="date" className="rounded-md border border-stone-300 px-3 py-2" />
          <select className="rounded-md border border-stone-300 px-3 py-2"><option>Manutenção</option><option>Uso próprio</option><option>Indisponibilidade</option></select>
          <button className="rounded-md bg-clay px-4 py-2 font-semibold text-white md:col-span-4">Bloquear datas</button>
        </form>
        <div className="mt-6 grid gap-5 md:grid-cols-2">{vehicles.map((vehicle) => <BookingCalendar key={vehicle.id} vehicle={vehicle} />)}</div>
      </section>
    </main>
  );
}
