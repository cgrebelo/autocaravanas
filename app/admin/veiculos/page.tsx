import { AdminSidebar } from "@/components/AdminSidebar";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/sample-data";

export default function AdminVehiclesPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <div className="flex justify-between gap-4">
          <h1 className="text-3xl font-bold text-forest">Gestão de veículos</h1>
          <button className="rounded-md bg-clay px-4 py-2 font-semibold text-white">Criar veículo</button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
      </section>
    </main>
  );
}
