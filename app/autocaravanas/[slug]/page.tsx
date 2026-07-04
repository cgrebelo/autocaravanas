import Image from "next/image";
import { notFound } from "next/navigation";
import { BookingCalendar } from "@/components/BookingCalendar";
import { BookingRequestForm } from "@/components/BookingRequestForm";
import { owners, vehicles } from "@/lib/sample-data";
import { formatCurrency } from "@/lib/utils";

export default async function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const vehicle = vehicles.find((item) => item.slug === slug);
  if (!vehicle) notFound();
  const owner = owners.find((item) => item.id === vehicle.ownerId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={vehicle.mainImage} alt={vehicle.name} fill className="object-cover" priority />
        </div>
        <div className="grid gap-3">
          {vehicle.images.slice(1, 3).map((image) => (
            <div key={image} className="relative min-h-40 overflow-hidden rounded-lg">
              <Image src={image} alt={vehicle.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px]">
        <section className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">{vehicle.location}</p>
            <h1 className="mt-2 text-4xl font-bold text-forest">{vehicle.name}</h1>
            {owner && <p className="mt-2 text-sm font-semibold text-moss">Anunciada por {owner.displayName}{owner.verified ? " · Proprietário validado" : " · A aguardar validação"}</p>}
            <p className="mt-3 text-xl font-semibold text-road">{formatCurrency(vehicle.priceFrom)} <span className="text-sm font-normal text-stone-500">preço por dia desde</span></p>
            <p className="mt-4 text-stone-700">{vehicle.description}</p>
          </div>
          <BookingCalendar vehicle={vehicle} />
          <section>
            <h2 className="text-2xl font-bold text-forest">Características</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(vehicle.specs).map(([key, value]) => (
                <div key={key} className="rounded-md border border-stone-200 bg-white p-3">
                  <dt className="text-xs font-semibold uppercase text-stone-500">{key}</dt>
                  <dd className="mt-1 font-medium text-road">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-forest">Camas</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {vehicle.beds.map((bed) => <div key={bed.type} className="rounded-md border border-stone-200 bg-white p-3"><p className="font-semibold">{bed.type}</p><p className="text-sm text-stone-600">{bed.size} · {bed.people} pessoas</p></div>)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-forest">Equipamentos</h2>
            <div className="mt-4 flex flex-wrap gap-2">{vehicle.features.map((feature) => <span key={feature} className="rounded-full bg-sand px-3 py-1 text-sm text-road">{feature}</span>)}</div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-forest">Condições</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="rounded-md bg-white p-3">Caução: {formatCurrency(vehicle.rules.deposit)}</p>
              <p className="rounded-md bg-white p-3">Quilómetros incluídos: {vehicle.includedKmPerDay}/dia</p>
              <p className="rounded-md bg-white p-3">Preço por km extra: {formatCurrency(vehicle.rules.extraKmPrice)}</p>
              <p className="rounded-md bg-white p-3">Animais: {vehicle.petsAllowed ? "permitidos" : "não permitidos"}</p>
              <p className="rounded-md bg-white p-3">Fumar: {vehicle.rules.smokingAllowed ? "permitido" : "não permitido"}</p>
              <p className="rounded-md bg-white p-3">Estrangeiro: {vehicle.rules.abroadAllowed ? "permitido" : "não permitido"}</p>
              <p className="rounded-md bg-white p-3">Idade mínima: {vehicle.rules.minDriverAge} anos</p>
              <p className="rounded-md bg-white p-3">Anos mínimos de carta: {vehicle.rules.minLicenseYears}</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-forest">Avaliações</h2>
            <div className="mt-4 rounded-lg border border-stone-200 bg-white p-4">Avaliação média {vehicle.rating}/5. Clientes destacam limpeza, comunicação e conforto.</div>
          </section>
        </section>
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <BookingRequestForm vehicle={vehicle} />
        </aside>
      </div>
    </main>
  );
}
