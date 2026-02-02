-- Create Products table to sync from Stripe
create table products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

-- Create Prices table to sync from Stripe
create table prices (
  id text primary key,
  product_id text references products,
  active boolean,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type text,
  interval text,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);

-- Alter organizations to track subscription and usage
alter table organizations
add column stripe_customer_id text,
add column subscription_status text default 'free',
add column plan_id text,
add column messages_count integer default 0,
add column last_reset timestamp with time zone default now();

-- Enable RLS for new tables (public read-only, service role write)
alter table products enable row level security;
alter table prices enable row level security;

create policy "Allow public read access" on products for select using (true);
create policy "Allow public read access" on prices for select using (true);
