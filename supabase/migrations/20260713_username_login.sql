create or replace function public.get_email_for_username(requested_username text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select email
  from public.users
  where lower(username) = lower(requested_username)
  limit 1;
$$;

grant execute on function public.get_email_for_username(text) to anon, authenticated;
