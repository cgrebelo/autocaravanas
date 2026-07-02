import { BookingStatus } from "@/lib/types";

const styles: Record<BookingStatus, string> = {
  "Pedido enviado": "bg-stone-100 text-stone-700",
  "A aguardar aprovação": "bg-amber-100 text-amber-800",
  Aprovada: "bg-blue-100 text-blue-800",
  "A aguardar pagamento": "bg-orange-100 text-orange-800",
  Confirmada: "bg-emerald-100 text-emerald-800",
  "Documentos pendentes": "bg-purple-100 text-purple-800",
  "Documentos validados": "bg-teal-100 text-teal-800",
  "Em curso": "bg-sky-100 text-sky-800",
  Concluída: "bg-stone-200 text-stone-800",
  Cancelada: "bg-red-100 text-red-800",
  Recusada: "bg-red-100 text-red-800"
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
