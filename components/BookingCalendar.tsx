import { CalendarDays } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BookingCalendar({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h3 className="flex items-center gap-2 font-semibold text-forest">
        <CalendarDays className="h-5 w-5" />
        Disponibilidade
      </h3>
      <div className="mt-4 grid gap-2">
        {vehicle.unavailable.map((block) => (
          <div key={`${block.start}-${block.end}`} className="flex items-center justify-between rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">
            <span>{formatDate(block.start)} a {formatDate(block.end)}</span>
            <span>{block.reason}</span>
          </div>
        ))}
        {vehicle.unavailable.length === 0 && <p className="text-sm text-stone-600">Sem bloqueios registados.</p>}
      </div>
    </div>
  );
}
