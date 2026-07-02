import { NextResponse } from "next/server";
import { calculatePrice, hasAvailabilityConflict } from "@/lib/pricing";
import { vehicles } from "@/lib/sample-data";

export async function POST(request: Request) {
  const body = await request.json();
  const vehicle = vehicles.find((item) => item.id === body.vehicleId);
  if (!vehicle) return NextResponse.json({ error: "Autocaravana não encontrada." }, { status: 404 });

  const price = calculatePrice({ vehicle, startDate: body.startDate, endDate: body.endDate, selectedExtraIds: body.extras ?? [] });
  const conflict = hasAvailabilityConflict(vehicle, body.startDate, body.endDate);
  return NextResponse.json({ price, available: !conflict });
}
