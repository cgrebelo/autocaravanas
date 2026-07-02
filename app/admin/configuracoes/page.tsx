import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminSettingsPage() {
  const fields = ["Nome da empresa", "Logótipo", "Email", "Telefone", "WhatsApp", "Morada", "IBAN", "Percentagem de sinal", "Dias antes da viagem para pagamento do restante", "Valor padrão da caução"];
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Configurações</h1>
        <form className="mt-6 grid gap-4 rounded-lg border border-stone-200 bg-white p-5 md:grid-cols-2">
          {fields.map((field) => <label key={field} className="text-sm font-medium text-road">{field}<input className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>)}
          <label className="text-sm font-medium text-road md:col-span-2">Condições gerais<textarea rows={5} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road md:col-span-2">Política de cancelamento<textarea rows={4} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-road md:col-span-2">Texto padrão dos emails<textarea rows={4} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" /></label>
          <button className="rounded-md bg-clay px-4 py-2 font-semibold text-white md:col-span-2">Guardar configurações</button>
        </form>
      </section>
    </main>
  );
}
