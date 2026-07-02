import { NextResponse } from "next/server";
import { calculatePrice, hasAvailabilityConflict } from "@/lib/pricing";
import { vehicles } from "@/lib/sample-data";
import { bookingRequestSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const parsed = bookingRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const vehicle = vehicles.find((item) => item.id === parsed.data.vehicleId);
  if (!vehicle) return NextResponse.json({ error: "Autocaravana não encontrada." }, { status: 404 });
  if (hasAvailabilityConflict(vehicle, parsed.data.startDate, parsed.data.endDate)) {
    return NextResponse.json({ error: "As datas selecionadas não estão disponíveis." }, { status: 409 });
  }

  const price = calculatePrice({ vehicle, startDate: parsed.data.startDate, endDate: parsed.data.endDate, selectedExtraIds: parsed.data.extras });
  return NextResponse.json({
    id: crypto.randomUUID(),
    status: "A aguardar aprovação",
    price,
    nextStep: "O administrador será notificado por email."
  });
}
