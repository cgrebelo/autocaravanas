import { OwnerSidebar } from "@/components/OwnerSidebar";
import { VehicleCard } from "@/components/VehicleCard";
import { vehicles } from "@/lib/sample-data";

const currentOwnerId = "o1";

export default function OwnerVehiclesPage() {
  const ownerVehicles = vehicles.filter((vehicle) => vehicle.ownerId === currentOwnerId);

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <OwnerSidebar />
      <section>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-forest">As minhas autocaravanas</h1>
            <p className="mt-2 text-stone-600">Crie anúncios, envie fotos, defina preços, regras e disponibilidade.</p>
          </div>
          <button className="rounded-md bg-clay px-4 py-2 font-semibold text-white">Criar anúncio</button>
        </div>
        <form className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-3">
          <input placeholder="Nome da autocaravana" className="rounded-md border border-stone-300 px-3 py-2" />
          <select className="rounded-md border border-stone-300 px-3 py-2"><option>Tipo</option><option>Autocaravana</option><option>Campervan</option><option>Perfilada</option><option>Capucine</option><option>Integral</option></select>
          <input placeholder="Preço por dia" className="rounded-md border border-stone-300 px-3 py-2" />
          <input placeholder="Localização pública" className="rounded-md border border-stone-300 px-3 py-2" />
          <input placeholder="Morada privada" className="rounded-md border border-stone-300 px-3 py-2" />
          <input type="file" multiple className="rounded-md border border-stone-300 px-3 py-2" />
          <button className="rounded-md bg-forest px-4 py-2 font-semibold text-white md:col-span-3">Submeter para validação do admin</button>
        </form>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{ownerVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
      </section>
    </main>
  );
}
