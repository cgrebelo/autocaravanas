import { NextResponse } from "next/server";
import { createAdminClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { vehicleCreateSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = vehicleCreateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Inicie sessão para criar um anúncio." }, { status: 401 });

  const supabase = createAdminClient();
  const { data: owner } = await supabase.from("owner_profiles").select("id, user_id, verified").eq("id", parsed.data.ownerId).eq("user_id", user.id).single();
  if (!owner) return NextResponse.json({ error: "Perfil de proprietário não encontrado." }, { status: 403 });

  const slugBase = parsed.data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const slug = `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;
  const { data, error } = await supabase.from("vehicles").insert({
    owner_id: owner.id,
    slug,
    name: parsed.data.name,
    type: parsed.data.type,
    description: parsed.data.description,
    public_location: parsed.data.location,
    private_address: parsed.data.privateAddress,
    price_from: parsed.data.priceFrom,
    seats: parsed.data.seats,
    sleeps: parsed.data.sleeps,
    gearbox: "Manual",
    status: "pendente"
  }).select("id, slug, status").single();

  if (error || !data) return NextResponse.json({ error: error?.message ?? "Não foi possível criar o anúncio." }, { status: 400 });

  return NextResponse.json({
    ...data,
    nextStep: "Anúncio submetido para validação do administrador."
  });
}
