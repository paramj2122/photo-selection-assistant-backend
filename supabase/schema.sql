-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: photographers
create table photographers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: jobs
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  photographer_id uuid references photographers(id) on delete cascade not null,
  title text not null,
  client_name text not null,
  client_email text not null,
  status text not null default 'draft', -- draft, active, selection_done
  selection_deadline timestamp with time zone,
  magic_link_token text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: photos
create table photos (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete cascade not null,
  original_filename text not null,
  raw_local_path text not null,
  drive_preview_file_id text not null,
  drive_preview_public_url text,
  width integer,
  height integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: selections
create table selections (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete cascade not null,
  photo_id uuid references photos(id) on delete cascade not null,
  selected_by text not null check (selected_by in ('client', 'photographer')),
  is_selected boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (photo_id, selected_by) -- A user can only have one selection record per photo
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table photographers enable row level security;
alter table jobs enable row level security;
alter table photos enable row level security;
alter table selections enable row level security;

-- We will use the service_role key for backend operations, which bypasses RLS.
-- The only public access we need to grant is for the frontend app accessing photos/selections via the magic link.
-- However, since our Next.js backend will act as the intermediary (using service_role key) for all requests in the initial version,
-- we actually don't need any public RLS policies right now! All reads/writes happen server-side.

-- If later you want the browser to connect to Supabase directly, you would add policies here based on magic_link_token.
-- For now, securing everything and using the service role key in Next.js is the safest and simplest approach for this API-first design.
