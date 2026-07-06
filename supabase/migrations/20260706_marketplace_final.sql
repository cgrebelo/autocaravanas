alter table public.users add column if not exists username text unique;

do $$
begin
  if not exists (select 1 from pg_type t join pg_enum e on t.oid = e.enumtypid where t.typname = 'user_role' and e.enumlabel = 'proprietario') then
    alter type user_role add value 'proprietario';
  end if;
end $$;

alter table public.profiles add column if not exists status text not null default 'ativo';

create table if not exists public.owner_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references public.profiles(id) on delete cascade,
  display_name text not null,
  fiscal_name text,
  tax_number text,
  public_location text,
  payout_status text not null default 'por_configurar',
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.vehicles add column if not exists owner_id uuid references public.owner_profiles(id) on delete set null;
alter table public.vehicles add column if not exists status text not null default 'pendente';

alter table public.owner_profiles enable row level security;

create or replace function public.is_owner()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'proprietario' and status = 'ativo');
$$;

create or replace function public.owns_vehicle(vehicle uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.vehicles v
    join public.owner_profiles o on o.id = v.owner_id
    where v.id = vehicle and o.user_id = auth.uid()
  );
$$;

drop policy if exists "public can read active vehicles" on public.vehicles;
create policy "public can read active vehicles" on public.vehicles for select using (archived_at is null and status = 'publicado');

drop policy if exists "owners read own vehicles" on public.vehicles;
create policy "owners read own vehicles" on public.vehicles for select using (public.owns_vehicle(id));

drop policy if exists "owners create vehicles" on public.vehicles;
create policy "owners create vehicles" on public.vehicles for insert with check (
  public.is_owner() and exists (select 1 from public.owner_profiles o where o.id = owner_id and o.user_id = auth.uid())
);

drop policy if exists "owners update own draft vehicles" on public.vehicles;
create policy "owners update own draft vehicles" on public.vehicles for update using (public.owns_vehicle(id)) with check (public.owns_vehicle(id) and status in ('rascunho', 'pendente'));

drop policy if exists "owners read public owner profiles" on public.owner_profiles;
create policy "owners read public owner profiles" on public.owner_profiles for select using (verified or user_id = auth.uid() or public.is_admin());

drop policy if exists "owners create own owner profile" on public.owner_profiles;
create policy "owners create own owner profile" on public.owner_profiles for insert with check (user_id = auth.uid());

drop policy if exists "owners update own owner profile" on public.owner_profiles;
create policy "owners update own owner profile" on public.owner_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid() and verified = false);

drop policy if exists "admins manage owner profiles" on public.owner_profiles;
create policy "admins manage owner profiles" on public.owner_profiles for all using (public.is_admin()) with check (public.is_admin());
