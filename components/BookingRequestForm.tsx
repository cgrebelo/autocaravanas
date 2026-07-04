"use client";

import { useMemo, useState } from "react";
import { DateRangePicker } from "@/components/DateRangePicker";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { createClient } from "@/lib/supabase";
import { calculatePrice, hasAvailabilityConflict } from "@/lib/pricing";
import { Vehicle } from "@/lib/types";

export function BookingRequestForm({ vehicle }: { vehicle: Vehicle }) {
  const [startDate, setStartDate] = useState("2026-08-10");
  const [endDate, setEndDate] = useState("2026-08-15");
  const [extras, setExtras] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const price = useMemo(() => calculatePrice({ vehicle, startDate, endDate, selectedExtraIds: extras }), [vehicle, startDate, endDate, extras]);
  const unavailable = hasAvailabilityConflict(vehicle, startDate, endDate);

  function toggleExtra(id: string) {
    setExtras((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setMessage("Inicie sessão antes de enviar o pedido de reserva.");
        return;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDate,
          endDate,
          guests: Number(formData.get("guests")),
          customerName: formData.get("customerName"),
          customerEmail: formData.get("customerEmail"),
          message: formData.get("message"),
          extras
        })
      });
      const result = await response.json();
      setMessage(response.ok ? "Pedido enviado. Pode acompanhar o estado na área do cliente." : result.error ?? "Não foi possível enviar o pedido.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar o pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
      <h2 className="text-xl font-bold text-forest">Enviar pedido de reserva</h2>
      <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
      <label className="block text-sm font-medium text-road">
        Nome do locatário
        <input name="customerName" required className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-road">
        Email
        <input name="customerEmail" type="email" required className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-road">
        Número de pessoas
        <input name="guests" type="number" min={1} defaultValue={2} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
      </label>
      <div>
        <p className="text-sm font-medium text-road">Extras pretendidos</p>
        <div className="mt-2 grid gap-2">
          {vehicle.extras.map((extra) => (
            <label key={extra.id} className="flex items-center justify-between rounded-md border border-stone-200 px-3 py-2 text-sm">
              <span><input type="checkbox" className="mr-2" checked={extras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} />{extra.name}</span>
              <span>{extra.price} €/{extra.unit}</span>
            </label>
          ))}
        </div>
      </div>
      <label className="block text-sm font-medium text-road">
        Mensagem ao proprietário
        <textarea name="message" rows={4} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" placeholder="Indique horários, dúvidas ou pedidos especiais." />
      </label>
      <PriceBreakdown price={price} />
      {unavailable && <p className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">Estas datas têm conflito de disponibilidade.</p>}
      <button disabled={loading || unavailable || price.days === 0} className="w-full rounded-md bg-clay px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-stone-300">
        {loading ? "A enviar..." : "Enviar pedido de reserva"}
      </button>
      {message && <p className="rounded-md bg-sand p-3 text-sm text-road">{message}</p>}
    </form>
  );
}
