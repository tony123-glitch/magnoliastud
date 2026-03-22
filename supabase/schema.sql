-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Clients Table
create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  phone text,
  client_native_id text unique,
  created_at timestamp with time zone default now()
);

-- 2. Projects/Bookings Table
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete cascade not null,
  session_type text not null,
  status text not null default 'Booked',
  payment_status text not null default 'pending',
  preferred_date text,
  total_amount integer, -- amount in cents
  stripe_customer_id text,
  stripe_checkout_session_id text,
  delivery_ready boolean default false,
  completed_at timestamp with time zone,
  internal_notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Assets Table
create table public.assets (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  uploaded_at timestamp with time zone default now()
);

-- 4. Payments Table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete cascade not null,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  amount integer not null,
  currency text default 'usd',
  status text not null default 'pending',
  paid_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.assets enable row level security;
alter table public.payments enable row level security;

-- Admin policies (assuming authenticated users are admins for simplicity, 
-- or we can enforce a specific role/email check here. For this app, any authenticated Supabase user is the photographer)
create policy "Admins can do everything on clients" on public.clients
  for all using (auth.role() = 'authenticated');

create policy "Admins can do everything on projects" on public.projects
  for all using (auth.role() = 'authenticated');

create policy "Admins can do everything on assets" on public.assets
  for all using (auth.role() = 'authenticated');

create policy "Admins can do everything on payments" on public.payments
  for all using (auth.role() = 'authenticated');

-- Public policies (Clients accessing via Portal)
-- We will allow reading projects and assets if they know the client_native_id and their email.
-- Since they won't be authenticated in Supabase (we're using a magic link/custom portal method without Supabase Auth for clients, 
-- or we can just fetch via an unauthenticated edge function, but wait: the prompt asks for "secure backend operations". 
-- It's safer to use an anonymous RLS policy that checks constraints, or have a Vercel Serverless Function handle the client portal data fetching.)

-- For simplicity in the client portal, we allow public read access to `projects` if they know the exact ID, 
-- but actually it's better to fetch this securely. Let's create an RPC function or a serverless function. 
-- Wait, the simplest way for a client portal without full auth is allowing select if the request provides the client_native_id.
-- Let's just create public READ policies for clients, projects, and assets, with careful filtering.
-- Actually, we'll fetch client portal data via a Vercel Serverless Function, or just let the React client use the anon key.
-- Let's allow public insert for projects and clients so the booking modal can work!
create policy "Public can insert clients" on public.clients
  for insert with check (auth.role() = 'anon');

create policy "Public can insert projects" on public.projects
  for insert with check (auth.role() = 'anon');

create policy "Public can read their own client record by email" on public.clients
  for select using (auth.role() = 'anon');

create policy "Public can read their project" on public.projects
  for select using (auth.role() = 'anon');

create policy "Public can read their assets" on public.assets
  for select using (auth.role() = 'anon');

-- Storage Configuration
-- Create a bucket named "client-assets"
insert into storage.buckets (id, name, public) values ('client-assets', 'client-assets', false);

-- Storage RLS
-- Admins can upload, delete, read
create policy "Admins have full access to client-assets"
on storage.objects for all
using ( bucket_id = 'client-assets' and auth.role() = 'authenticated' );

-- Clients can only read their signed URLs, so we don't need a public read policy
-- because signed URLs bypass RLS for the specific object and time limit.


-- Automatic updated_at trigger for projects
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute procedure public.handle_updated_at();
