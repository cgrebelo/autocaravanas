create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role user_role := coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'cliente'::user_role);
  requested_status text := coalesce(new.raw_user_meta_data ->> 'status', case when requested_role = 'proprietario' then 'pendente' else 'ativo' end);
  requested_username text := nullif(new.raw_user_meta_data ->> 'username', '');
  requested_name text := coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1));
begin
  insert into public.users (id, email, username)
  values (new.id, new.email, requested_username)
  on conflict (id) do update set email = excluded.email, username = excluded.username;

  insert into public.profiles (id, role, full_name, phone, status)
  values (
    new.id,
    requested_role,
    requested_name,
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    requested_status
  )
  on conflict (id) do update set
    role = excluded.role,
    full_name = excluded.full_name,
    phone = excluded.phone,
    status = excluded.status;

  if requested_role = 'proprietario' then
    insert into public.owner_profiles (user_id, display_name, fiscal_name, verified, payout_status)
    values (
      new.id,
      coalesce(nullif(new.raw_user_meta_data ->> 'owner_display_name', ''), requested_name),
      requested_name,
      false,
      'por_configurar'
    )
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
