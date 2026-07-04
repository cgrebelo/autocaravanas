create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist";

create type user_role as enum ('cliente', 'proprietario', 'administrador');
create type booking_status as enum ('Pedido enviado', 'A aguardar aprovação', 'Aprovada', 'A aguardar pagamento', 'Confirmada', 'Documentos pendentes', 'Documentos validados', 'Em curso', 'Concluída', 'Cancelada', 'Recusada');
create type document_status as enum ('pendente', 'validado', 'recusado');
create type payment_status as enum ('pendente', 'pago', 'falhado', 'reembolsado');
create type deposit_status as enum ('pendente', 'recebida', 'devolvida', 'retida parcialmente', 'retida');

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'cliente',
  full_name text not null,
  phone text,
  address text,
  status text not null default 'ativo' check (status in ('ativo', 'pendente', 'suspenso')),
  created_at timestamptz not null default now()
);

create table owner_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references profiles(id) on delete cascade,
  display_name text not null,
  fiscal_name text,
  tax_number text,
  public_location text,
  payout_status text not null default 'por_configurar' check (payout_status in ('por_configurar', 'pendente', 'ativo')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references owner_profiles(id) on delete set null,
  slug text unique not null,
  name text not null,
  type text not null,
  description text,
  public_location text not null,
  private_address text not null,
  license_plate text,
  price_from numeric(10,2) not null,
  seats int not null,
  sleeps int not null,
  gearbox text not null,
  pets_allowed boolean not null default false,
  included_km_per_day int not null default 250,
  deposit_amount numeric(10,2) not null default 1000,
  extra_km_price numeric(10,2) not null default 0.25,
  fuel_policy text,
  cleaning_policy text,
  smoking_allowed boolean not null default false,
  abroad_allowed boolean not null default false,
  min_driver_age int not null default 25,
  min_license_years int not null default 3,
  status text not null default 'pendente' check (status in ('rascunho', 'pendente', 'publicado', 'arquivado')),
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table vehicle_images (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  storage_path text not null,
  alt text,
  is_main boolean not null default false,
  sort_order int not null default 0
);

create table vehicle_features (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  name text not null
);

create table vehicle_beds (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  bed_type text not null,
  dimensions text,
  people int not null
);

create table vehicle_prices (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  base_price numeric(10,2) not null,
  cleaning_fee numeric(10,2) not null default 45,
  discount_7_days numeric(5,2) not null default 0.05,
  discount_14_days numeric(5,2) not null default 0.08,
  discount_30_days numeric(5,2) not null default 0.12
);

create table vehicle_seasons (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  price_per_day numeric(10,2) not null,
  min_days int not null default 2
);

create table vehicle_extras (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  unit text not null check (unit in ('reserva', 'dia')),
  active boolean not null default true
);

create table vehicle_availability_blocks (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  created_by uuid references profiles(id),
  check (start_date < end_date)
);

create table bookings (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id),
  customer_id uuid references profiles(id),
  customer_name text not null,
  customer_email text not null,
  start_date date not null,
  end_date date not null,
  guests int not null,
  status booking_status not null default 'Pedido enviado',
  rental_subtotal numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  extras_total numeric(10,2) not null default 0,
  cleaning_fee numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  signal_amount numeric(10,2) not null default 0,
  remaining_amount numeric(10,2) not null default 0,
  deposit_amount numeric(10,2) not null default 0,
  message text,
  internal_notes text,
  created_at timestamptz not null default now(),
  check (start_date < end_date)
);

alter table bookings
  add constraint no_overlapping_confirmed_bookings
  exclude using gist (
    vehicle_id with =,
    daterange(start_date, end_date, '[)') with &&
  )
  where (status in ('Aprovada', 'A aguardar pagamento', 'Confirmada', 'Documentos pendentes', 'Documentos validados', 'Em curso'));

create table booking_extras (
  booking_id uuid references bookings(id) on delete cascade,
  extra_id uuid references vehicle_extras(id),
  quantity int not null default 1,
  price numeric(10,2) not null,
  primary key (booking_id, extra_id)
);

create table booking_messages (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  sender_id uuid references profiles(id),
  sender_role user_role not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table booking_documents (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  profile_id uuid not null references profiles(id),
  document_type text not null,
  storage_path text not null,
  status document_status not null default 'pendente',
  rejection_reason text,
  validated_by uuid references profiles(id),
  validated_at timestamptz,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider text not null default 'stripe',
  provider_reference text,
  method text,
  amount numeric(10,2) not null,
  status payment_status not null default 'pendente',
  receipt_url text,
  created_at timestamptz not null default now()
);

create table deposits (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  amount numeric(10,2) not null,
  status deposit_status not null default 'pendente',
  retained_amount numeric(10,2) not null default 0,
  retention_reason text,
  updated_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id),
  customer_id uuid references profiles(id),
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create table handover_checklists (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  type text not null check (type in ('entrega', 'devolucao')),
  km int,
  fuel_level text,
  exterior_state text,
  interior_state text,
  existing_damage text,
  new_damage text,
  customer_signature text,
  admin_signature text,
  pdf_path text,
  created_at timestamptz not null default now()
);

create table handover_photos (
  id uuid primary key default uuid_generate_v4(),
  checklist_id uuid not null references handover_checklists(id) on delete cascade,
  storage_path text not null,
  caption text
);

create table admin_notes (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  admin_id uuid references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table settings (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null default 'Rota Livre',
  logo_path text,
  email text,
  phone text,
  whatsapp text,
  address text,
  iban text,
  terms text,
  cancellation_policy text,
  privacy_policy text,
  email_templates jsonb not null default '{}',
  signal_percentage numeric(5,2) not null default 0.25,
  remaining_payment_days_before_trip int not null default 15,
  default_deposit_amount numeric(10,2) not null default 1000,
  updated_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'administrador');
$$;

create or replace function is_owner()
returns boolean language sql stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'proprietario' and status = 'ativo');
$$;

create or replace function owns_vehicle(vehicle uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from vehicles v
    join owner_profiles o on o.id = v.owner_id
    where v.id = vehicle and o.user_id = auth.uid()
  );
$$;

alter table profiles enable row level security;
alter table users enable row level security;
alter table owner_profiles enable row level security;
alter table vehicles enable row level security;
alter table vehicle_images enable row level security;
alter table vehicle_features enable row level security;
alter table vehicle_beds enable row level security;
alter table vehicle_prices enable row level security;
alter table vehicle_seasons enable row level security;
alter table vehicle_extras enable row level security;
alter table vehicle_availability_blocks enable row level security;
alter table bookings enable row level security;
alter table booking_extras enable row level security;
alter table booking_messages enable row level security;
alter table booking_documents enable row level security;
alter table payments enable row level security;
alter table deposits enable row level security;
alter table reviews enable row level security;
alter table handover_checklists enable row level security;
alter table handover_photos enable row level security;
alter table admin_notes enable row level security;
alter table settings enable row level security;

create policy "public can read active vehicles" on vehicles for select using (archived_at is null and status = 'publicado');
create policy "admins manage vehicles" on vehicles for all using (is_admin()) with check (is_admin());
create policy "owners read own vehicles" on vehicles for select using (owns_vehicle(id));
create policy "owners create vehicles" on vehicles for insert with check (
  is_owner() and exists (select 1 from owner_profiles o where o.id = owner_id and o.user_id = auth.uid())
);
create policy "owners update own draft vehicles" on vehicles for update using (owns_vehicle(id)) with check (owns_vehicle(id) and status in ('rascunho', 'pendente'));
create policy "public can read vehicle public data" on vehicle_images for select using (true);
create policy "public can read features" on vehicle_features for select using (true);
create policy "public can read beds" on vehicle_beds for select using (true);
create policy "public can read prices" on vehicle_prices for select using (true);
create policy "public can read seasons" on vehicle_seasons for select using (true);
create policy "public can read extras" on vehicle_extras for select using (active);
create policy "public can read availability" on vehicle_availability_blocks for select using (true);

create policy "users read own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "users update own profile" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "admins manage profiles" on profiles for all using (is_admin()) with check (is_admin());
create policy "users read own user row" on users for select using (id = auth.uid() or is_admin());
create policy "admins manage users" on users for all using (is_admin()) with check (is_admin());
create policy "owners read public owner profiles" on owner_profiles for select using (verified or user_id = auth.uid() or is_admin());
create policy "owners create own owner profile" on owner_profiles for insert with check (user_id = auth.uid());
create policy "owners update own owner profile" on owner_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid() and verified = false);
create policy "admins manage owner profiles" on owner_profiles for all using (is_admin()) with check (is_admin());

create policy "customers read own bookings" on bookings for select using (customer_id = auth.uid() or is_admin() or owns_vehicle(vehicle_id));
create policy "customers create bookings" on bookings for insert with check (customer_id = auth.uid());
create policy "admins manage bookings" on bookings for all using (is_admin()) with check (is_admin());
create policy "owners update bookings for own vehicles" on bookings for update using (owns_vehicle(vehicle_id)) with check (owns_vehicle(vehicle_id));

create policy "booking participants read messages" on booking_messages for select using (
  is_admin() or exists (select 1 from bookings b where b.id = booking_id and (b.customer_id = auth.uid() or owns_vehicle(b.vehicle_id)))
);
create policy "booking participants send messages" on booking_messages for insert with check (
  is_admin() or exists (select 1 from bookings b where b.id = booking_id and (b.customer_id = auth.uid() or owns_vehicle(b.vehicle_id)))
);

create policy "customers read own documents" on booking_documents for select using (profile_id = auth.uid() or is_admin());
create policy "customers upload own documents" on booking_documents for insert with check (profile_id = auth.uid());
create policy "admins manage documents" on booking_documents for all using (is_admin()) with check (is_admin());

create policy "booking participants read payments" on payments for select using (
  is_admin() or exists (select 1 from bookings b where b.id = booking_id and (b.customer_id = auth.uid() or owns_vehicle(b.vehicle_id)))
);
create policy "admins manage payments" on payments for all using (is_admin()) with check (is_admin());
create policy "admins manage settings" on settings for all using (is_admin()) with check (is_admin());
create policy "admins read notes" on admin_notes for all using (is_admin()) with check (is_admin());
