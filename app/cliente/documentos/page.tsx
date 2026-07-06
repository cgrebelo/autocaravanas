import { UploadDocument } from "@/components/UploadDocument";
import { getDocuments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ClientDocumentsPage() {
  const documents = await getDocuments();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-forest">Documentos</h1>
      <p className="mt-2 text-stone-600">Envie carta de condução, cartão de cidadão/passaporte, comprovativo de morada e documentos pedidos pelo administrador.</p>
      <div className="mt-6"><UploadDocument /></div>
      <div className="mt-6 grid gap-3">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="flex justify-between gap-3"><p className="font-semibold text-road">{doc.name}</p><span className="rounded-full bg-sand px-3 py-1 text-sm">{doc.status}</span></div>
            {doc.rejectionReason && <p className="mt-2 text-sm text-red-700">Motivo de recusa: {doc.rejectionReason}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}
