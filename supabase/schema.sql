-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations Table
create table organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Profiles Table (Links to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  org_id uuid references organizations on delete set null,
  role text default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chatbots Table
create table chatbots (
  id uuid default uuid_generate_v4() primary key,
  org_id uuid references organizations on delete cascade not null,
  name text not null,
  config jsonb default '{}'::jsonb,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table chatbots enable row level security;

-- RLS Policies

-- Profiles: Users can view/edit their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Organizations: Users can view their own organization
create policy "Users can view own organization"
  on organizations for select
  using (
    id in (
      select org_id from profiles where id = auth.uid()
    )
  );

-- Chatbots: Users can view chatbots in their organization
create policy "Users can view org chatbots"
  on chatbots for select
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create policy "Users can insert org chatbots"
  on chatbots for insert
  with check (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create policy "Users can update org chatbots"
  on chatbots for update
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

create policy "Users can delete org chatbots"
  on chatbots for delete
  using (
    org_id in (
      select org_id from profiles where id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_org_id uuid;
begin
  -- Create a new organization for the user
  insert into public.organizations (name)
  values (new.email || '''s Org')
  returning id into new_org_id;

  -- Create a profile for the user linked to the new org
  insert into public.profiles (id, email, org_id, role)
  values (new.id, new.email, new_org_id, 'admin');

  return new;
end;
$$;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
