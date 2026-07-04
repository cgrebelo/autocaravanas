import { AdminSidebar } from "@/components/AdminSidebar";
import { VehicleCard } from "@/components/VehicleCard";
import { owners, vehicles } from "@/lib/sample-data";

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
        <section className="mt-8 rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-xl font-bold text-forest">Validação de anúncios</h2>
          <div className="mt-4 grid gap-3">
            {vehicles.map((vehicle) => {
              const owner = owners.find((item) => item.id === vehicle.ownerId);
              return (
                <div key={vehicle.id} className="flex flex-col justify-between gap-3 rounded-md bg-sand p-3 md:flex-row md:items-center">
                  <p>{vehicle.name} · {owner?.displayName} · {vehicle.status}</p>
                  <div className="flex gap-2">
                    <button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Publicar</button>
                    <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Arquivar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
