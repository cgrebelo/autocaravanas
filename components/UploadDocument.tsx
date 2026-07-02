"use client";

import { Upload } from "lucide-react";

export function UploadDocument() {
  return (
    <form className="rounded-lg border border-dashed border-moss bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-road">
          Tipo de documento
          <select className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2">
            <option>Cartão de cidadão/passaporte</option>
            <option>Carta de condução</option>
            <option>Comprovativo de morada</option>
            <option>Outro documento</option>
          </select>
        </label>
        <label className="flex-1 text-sm font-medium text-road">
          Ficheiro
          <input type="file" className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-md bg-forest px-4 py-2 font-semibold text-white hover:bg-moss">
          <Upload className="h-4 w-4" />
          Enviar
        </button>
      </div>
    </form>
  );
}
