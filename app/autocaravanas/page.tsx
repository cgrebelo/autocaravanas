import { SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { getPublicVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  const vehicles = await getPublicVehicles();

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5">
        <h1 className="flex items-center gap-2 text-xl font-bold text-forest"><SlidersHorizontal className="h-5 w-5" />Filtros</h1>
        <div className="mt-5 grid gap-4">
          <input type="date" className="rounded-md border border-stone-300 px-3 py-2" />
          <input type="date" className="rounded-md border border-stone-300 px-3 py-2" />
          <select className="rounded-md border border-stone-300 px-3 py-2"><option>Número de passageiros</option><option>2+</option><option>4+</option><option>6+</option></select>
          <select className="rounded-md border border-stone-300 px-3 py-2"><option>Tipo de veículo</option><option>Autocaravana</option><option>Campervan</option><option>Perfilada</option><option>Capucine</option><option>Integral</option></select>
          <select className="rounded-md border border-stone-300 px-3 py-2"><option>Caixa</option><option>Manual</option><option>Automática</option></select>
          {["Animais permitidos", "WC", "Duche", "Cozinha", "Frigorífico", "Aquecimento", "Ar condicionado", "Painel solar", "Toldo", "Porta-bicicletas"].map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-stone-700"><input type="checkbox" />{item}</label>
          ))}
        </div>
      </aside>
      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold text-forest">Autocaravanas disponíveis</h1>
            <p className="mt-2 text-stone-600">{vehicles.length} veículos da frota própria.</p>
          </div>
          <select className="rounded-md border border-stone-300 bg-white px-3 py-2">
            <option>Ordenar por popularidade</option>
            <option>Preço mais baixo</option>
            <option>Avaliação</option>
            <option>Mais recente</option>
          </select>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      </section>
    </main>
  );
}
