import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarCheck, CarFront, CreditCard, MapPinned, type LucideIcon } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { getPublicVehicles } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vehicles = (await getPublicVehicles()).slice(0, 3);
  const steps: { label: string; icon: LucideIcon }[] = [
    { label: "Escolha a autocaravana", icon: CarFront },
    { label: "Envie pedido de reserva", icon: CalendarCheck },
    { label: "Confirme o pagamento", icon: CreditCard },
    { label: "Levante a autocaravana e viaje", icon: MapPinned }
  ];

  return (
    <main>
      <section className="relative min-h-[620px] overflow-hidden bg-forest">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-35" />
        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-4 py-16 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">Alugue uma autocaravana e parta à descoberta</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/85">Encontre autocaravanas de proprietários validados ou anuncie a sua e receba pedidos de reserva com gestão simples.</p>
          </div>
          <form className="mt-8 grid gap-3 rounded-lg bg-white p-4 text-road shadow-soft md:grid-cols-[1fr_1fr_1fr_auto]">
            <input type="date" className="rounded-md border border-stone-300 px-3 py-3" aria-label="Data de início" />
            <input type="date" className="rounded-md border border-stone-300 px-3 py-3" aria-label="Data de fim" />
            <input placeholder="Local de recolha" className="rounded-md border border-stone-300 px-3 py-3" />
            <Link href="/autocaravanas" className="inline-flex items-center justify-center gap-2 rounded-md bg-clay px-5 py-3 font-semibold text-white hover:bg-orange-600">
              Pesquisar <ArrowRight className="h-4 w-4" />
            </Link>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-forest">Autocaravanas em destaque</h2>
          <p className="mt-2 text-stone-600">Modelos de proprietários validados para escapadinhas, férias em família e grandes viagens.</p>
          </div>
          <Link href="/autocaravanas" className="hidden font-semibold text-moss md:block">Ver frota</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
        </div>
      </section>

      <section className="bg-sand py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-forest">Como funciona</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map(({ label, icon: Icon }, index) => (
              <div key={label} className="rounded-lg bg-white p-5">
                <Icon className="h-7 w-7 text-clay" />
                <p className="mt-4 text-sm font-semibold text-stone-500">Passo {index + 1}</p>
                <h3 className="mt-1 font-bold text-forest">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-forest">Vantagens</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Proprietários validados", "Mensagens diretas", "Autocaravanas equipadas", "Possibilidade de extras", "Caução transparente", "Contrato claro"].map((item) => (
              <p key={item} className="flex items-center gap-2 rounded-md border border-stone-200 bg-white p-3"><BadgeCheck className="h-5 w-5 text-moss" />{item}</p>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-forest">Perguntas frequentes</h2>
          <div className="mt-6 space-y-3">
            {["Quando vejo a morada exata de recolha?", "Como funciona a caução?", "Posso viajar para o estrangeiro?", "Que documentos são necessários?"].map((question) => (
              <details key={question} className="rounded-lg border border-stone-200 bg-white p-4">
                <summary className="cursor-pointer font-semibold text-road">{question}</summary>
                <p className="mt-2 text-sm text-stone-600">A informação é confirmada no processo de reserva e fica registada na área do cliente.</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
