-- Add super_admin role support to profiles
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check check (role in ('member', 'admin', 'super_admin'));

-- Create function to auto-assign super_admin role to ThomasPerdana@gmail.com
create or replace function public.handle_super_admin()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.email = 'ThomasPerdana@gmail.com' then
    update public.profiles
    set role = 'super_admin'
    where id = new.id;
  end if;
  return new;
end;
$$;

-- Trigger to check for super admin on profile creation
create trigger on_profile_created_super_admin
  after insert on public.profiles
  for each row execute procedure public.handle_super_admin();

-- 2FA Support (using standard TOTP factors in auth.mfa_factors)
-- No extra schema needed for basic TOTP as Supabase handles it in auth schema,
-- but we might want to store recovery codes or status in profiles if we want custom UI state,
-- though usually querying auth.mfa_factors is better. 
-- For this MVP, we will rely on Supabase Auth API for 2FA status.

-- RLS Policies for Super Admin

-- Super Admin can view all profiles
create policy "Super Admins can view all profiles"
  on profiles for select
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can update all profiles
create policy "Super Admins can update all profiles"
  on profiles for update
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can view all organizations
create policy "Super Admins can view all organizations"
  on organizations for select
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can update all organizations
create policy "Super Admins can update all organizations"
  on organizations for update
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can delete all organizations
create policy "Super Admins can delete all organizations"
  on organizations for delete
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can view all chatbots
create policy "Super Admins can view all chatbots"
  on chatbots for select
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can update all chatbots
create policy "Super Admins can update all chatbots"
  on chatbots for update
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- Super Admin can delete all chatbots
create policy "Super Admins can delete all chatbots"
  on chatbots for delete
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );
