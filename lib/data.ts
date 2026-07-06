import { createServerClient } from "./supabase-server";
import { Booking, DocumentItem, Message, OwnerProfile, UserAccount, Vehicle } from "./types";

type VehicleRow = {
  id: string;
  owner_id: string | null;
  slug: string;
  name: string;
  type: Vehicle["type"];
  description: string | null;
  public_location: string;
  private_address: string;
  price_from: number;
  seats: number;
  sleeps: number;
  gearbox: "Manual" | "Automática";
  pets_allowed: boolean;
  included_km_per_day: number;
  deposit_amount: number;
  extra_km_price: number;
  fuel_policy: string | null;
  cleaning_policy: string | null;
  smoking_allowed: boolean;
  abroad_allowed: boolean;
  min_driver_age: number;
  min_license_years: number;
  status: Vehicle["status"];
  created_at: string;
};

export async function getPublicVehicles(): Promise<Vehicle[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "publicado")
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Erro ao carregar autocaravanas:", error);
    return [];
  }

  return Promise.all(data.map((row) => mapVehicle(row as VehicleRow)));
}

export async function getVehicleBySlug(slug: string) {
  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return mapVehicle(data as VehicleRow);
}

export async function getAdminUsers(): Promise<UserAccount[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("profiles").select("id, role, full_name, phone, status, created_at, users(email, username)").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => {
    const relatedUser = row.users as unknown as { email?: string } | { email?: string }[] | null;
    const email = Array.isArray(relatedUser) ? relatedUser[0]?.email ?? "" : relatedUser?.email ?? "";

    return {
    id: row.id,
    role: row.role,
    fullName: row.full_name,
    email,
    phone: row.phone ?? undefined,
    status: row.status,
    createdAt: row.created_at
    };
  });
}

export async function getOwnerProfiles(): Promise<OwnerProfile[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("owner_profiles").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    fiscalName: row.fiscal_name ?? "",
    location: row.public_location ?? "",
    rating: 0,
    verified: row.verified,
    payoutStatus: row.payout_status
  }));
}

export async function getAdminVehicles(): Promise<Vehicle[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return Promise.all(data.map((row) => mapVehicle(row as VehicleRow)));
}

export async function getBookings(): Promise<Booking[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    vehicleId: row.vehicle_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    startDate: row.start_date,
    endDate: row.end_date,
    guests: row.guests,
    status: row.status,
    total: Number(row.total_amount),
    depositAmount: Number(row.deposit_amount),
    signalAmount: Number(row.signal_amount),
    extras: [],
    message: row.message ?? undefined
  }));
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("booking_documents").select("id, booking_id, document_type, status, rejection_reason").order("created_at", { ascending: false });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    bookingId: row.booking_id,
    name: row.document_type,
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined
  }));
}

export async function getMessages(): Promise<Message[]> {
  const supabase = createServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("booking_messages").select("id, booking_id, sender_role, body, created_at").order("created_at", { ascending: true });
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    bookingId: row.booking_id,
    sender: row.sender_role === "administrador" ? "administrador" : "cliente",
    body: row.body,
    createdAt: row.created_at
  }));
}

async function mapVehicle(row: VehicleRow): Promise<Vehicle> {
  const supabase = createServerClient();
  const [features, beds, extras, blocks, images] = await Promise.all([
    supabase?.from("vehicle_features").select("name").eq("vehicle_id", row.id),
    supabase?.from("vehicle_beds").select("bed_type, dimensions, people").eq("vehicle_id", row.id),
    supabase?.from("vehicle_extras").select("id, name, price, unit").eq("vehicle_id", row.id).eq("active", true),
    supabase?.from("vehicle_availability_blocks").select("start_date, end_date, reason").eq("vehicle_id", row.id),
    supabase?.from("vehicle_images").select("storage_path, is_main").eq("vehicle_id", row.id).order("sort_order")
  ]);

  const imageUrls = images?.data?.map((image) => image.storage_path) ?? [];
  const mainImage = images?.data?.find((image) => image.is_main)?.storage_path ?? imageUrls[0] ?? "/placeholder.svg";

  return {
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
    beds: beds?.data?.map((bed) => ({ type: bed.bed_type, size: bed.dimensions ?? "", people: bed.people })) ?? [],
    rating: 0,
    gearbox: row.gearbox,
    petsAllowed: row.pets_allowed,
    includedKmPerDay: row.included_km_per_day,
    images: imageUrls,
    mainImage,
    description: row.description ?? "",
    specs: {
      "Lotação em viagem": row.seats,
      "Lotação para dormir": row.sleeps,
      Caixa: row.gearbox
    },
    features: features?.data?.map((feature) => feature.name) ?? [],
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
    extras: extras?.data?.map((extra) => ({ id: extra.id, name: extra.name, price: Number(extra.price), unit: extra.unit })) ?? [],
    unavailable: blocks?.data?.map((block) => ({ start: block.start_date, end: block.end_date, reason: block.reason })) ?? [],
    createdAt: row.created_at,
    popularity: 0,
    status: row.status
  };
}
