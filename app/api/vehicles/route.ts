import { NextResponse } from "next/server";
import { vehicleCreateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = vehicleCreateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  return NextResponse.json({
    id: crypto.randomUUID(),
    slug: parsed.data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    status: "pendente",
    ownerId: parsed.data.ownerId,
    nextStep: "Anúncio submetido para validação do administrador."
  });
}
