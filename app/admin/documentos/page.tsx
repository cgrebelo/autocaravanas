import { AdminSidebar } from "@/components/AdminSidebar";
import { documents } from "@/lib/sample-data";

export default function AdminDocumentsPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[260px_1fr]">
      <AdminSidebar />
      <section>
        <h1 className="text-3xl font-bold text-forest">Documentos</h1>
        <div className="mt-6 grid gap-3">
          {documents.map((doc) => (
            <article key={doc.id} className="rounded-lg border border-stone-200 bg-white p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div><h2 className="font-bold text-road">{doc.name}</h2><p className="text-sm text-stone-600">Reserva {doc.bookingId} · Estado: {doc.status}</p></div>
                <div className="flex gap-2"><button className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-white">Validar</button><button className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">Recusar</button><button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Pedir novo upload</button></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
