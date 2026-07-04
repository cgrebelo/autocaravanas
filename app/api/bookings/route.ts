import { NextResponse } from "next/server";
import { calculatePrice, hasAvailabilityConflict } from "@/lib/pricing";
import { createAdminClient, getAuthenticatedUser } from "@/lib/supabase-server";
import { bookingRequestSchema } from "@/lib/validators";
import { Vehicle } from "@/lib/types";

export async function POST(request: Request) {
  const parsed = bookingRequestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const user = await getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Inicie sessão para enviar pedido de reserva." }, { status: 401 });

  const supabase = createAdminClient();
  const [{ data: row }, { data: blocks }, { data: extras }] = await Promise.all([
    supabase.from("vehicles").select("*").eq("id", parsed.data.vehicleId).eq("status", "publicado").single(),
    supabase.from("vehicle_availability_blocks").select("start_date, end_date, reason").eq("vehicle_id", parsed.data.vehicleId),
    supabase.from("vehicle_extras").select("id, name, price, unit").eq("vehicle_id", parsed.data.vehicleId).eq("active", true)
  ]);

  if (!row) return NextResponse.json({ error: "Autocaravana não encontrada." }, { status: 404 });

  const vehicle: Vehicle = {
    id: row.id,
    ownerId: row.owner_id ?? "",
    slug: row.slug,
    name: row.name,
    type: row.type,
    location: row.public_location,
    privateAddress: row.private_address,
    priceFrom: Number(row.price_from),
    seats: row.seats,
    sleeps: row.sleeps,
    beds: [],
    rating: 0,
    gearbox: row.gearbox,
    petsAllowed: row.pets_allowed,
    includedKmPerDay: row.included_km_per_day,
    images: [],
    mainImage: "",
    description: row.description ?? "",
    specs: {},
    features: [],
    rules: {
      deposit: Number(row.deposit_amount),
      extraKmPrice: Number(row.extra_km_price),
      fuelPolicy: row.fuel_policy ?? "",
      cleaningPolicy: row.cleaning_policy ?? "",
      smokingAllowed: row.smoking_allowed,
      abroadAllowed: row.abroad_allowed,
      minDriverAge: row.min_driver_age,
      minLicenseYears: row.min_license_years
    },
    extras: extras?.map((extra) => ({ id: extra.id, name: extra.name, price: Number(extra.price), unit: extra.unit })) ?? [],
    unavailable: blocks?.map((block) => ({ start: block.start_date, end: block.end_date, reason: block.reason })) ?? [],
    createdAt: row.created_at,
    popularity: 0,
    status: row.status
  };

  if (hasAvailabilityConflict(vehicle, parsed.data.startDate, parsed.data.endDate)) {
    return NextResponse.json({ error: "As datas selecionadas não estão disponíveis." }, { status: 409 });
  }

  const price = calculatePrice({ vehicle, startDate: parsed.data.startDate, endDate: parsed.data.endDate, selectedExtraIds: parsed.data.extras });
  const { data: booking, error } = await supabase.from("bookings").insert({
    vehicle_id: parsed.data.vehicleId,
    customer_id: user.id,
    customer_name: parsed.data.customerName,
    customer_email: parsed.data.customerEmail,
    start_date: parsed.data.startDate,
    end_date: parsed.data.endDate,
    guests: parsed.data.guests,
    status: "A aguardar aprovação",
    rental_subtotal: price.rentalSubtotal,
    discount_amount: price.discount,
    extras_total: price.extrasTotal,
    cleaning_fee: price.cleaningFee,
    total_amount: price.total,
    signal_amount: price.signal,
    remaining_amount: price.remaining,
    deposit_amount: price.deposit,
    message: parsed.data.message ?? null
  }).select("id, status").single();

  if (error || !booking) return NextResponse.json({ error: error?.message ?? "Não foi possível criar o pedido." }, { status: 400 });

  return NextResponse.json({
    id: booking.id,
    status: booking.status,
    price,
    nextStep: "O administrador será notificado por email."
  });
}
