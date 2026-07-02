"use client";

const items = ["Km na entrega", "Km na devolução", "Nível de combustível", "Estado exterior", "Estado interior", "Danos existentes", "Danos novos"];

export function HandoverChecklist() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="font-semibold text-forest">Checklist de entrega e devolução</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <label key={item} className="text-sm font-medium text-road">
            {item}
            <input className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" placeholder={item} />
          </label>
        ))}
        <label className="text-sm font-medium text-road">
          Fotos de entrega
          <input type="file" multiple className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="text-sm font-medium text-road">
          Fotos de devolução
          <input type="file" multiple className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button className="rounded-md border border-moss px-4 py-2 font-semibold text-forest">Assinatura do cliente</button>
        <button className="rounded-md border border-moss px-4 py-2 font-semibold text-forest">Assinatura do administrador</button>
      </div>
    </div>
  );
}
