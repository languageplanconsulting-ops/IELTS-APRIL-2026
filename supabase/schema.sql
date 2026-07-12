create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default 'Student',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learner_access (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  starts_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz,
  feedback_credits integer not null default 50 check (feedback_credits >= 0),
  full_mock_credits integer not null default 15 check (full_mock_credits >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_notebooks (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  entries jsonb not null default '[]'::jsonb,
  custom_sections jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reading_exams (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('normal', 'advanced')),
  title text not null,
  raw_passage_text text not null,
  raw_answer_key text not null,
  parsed_payload jsonb not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.support_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  reporter_name text not null default 'Student',
  reporter_email text not null default '',
  page_context text not null default 'workspace',
  category text not null default 'bug' check (category in ('bug', 'account', 'content', 'billing', 'other')),
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  admin_note text not null default '',
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.speaking_sample_videos (
  topic_id text primary key,
  topic_title text not null,
  prompt text not null default '',
  object_path text not null,
  mime_type text not null default 'video/webm',
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  duration_seconds numeric not null default 0 check (duration_seconds >= 0),
  trim_start_seconds numeric not null default 0 check (trim_start_seconds >= 0),
  trim_end_seconds numeric not null default 0 check (trim_end_seconds >= 0),
  video_device_label text not null default '',
  audio_device_label text not null default '',
  background_blur_enabled boolean not null default false,
  transcript text not null default '',
  subtitles jsonb not null default '[]'::jsonb,
  subtitle_style jsonb not null default '{}'::jsonb,
  version integer not null default 1 check (version >= 1),
  storage_provider text not null default 'supabase',
  checksum_sha256 text not null default '',
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_by_email text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint speaking_sample_video_trim_order check (trim_end_seconds >= trim_start_seconds)
);

alter table if exists public.speaking_sample_videos
  add column if not exists background_blur_enabled boolean not null default false,
  add column if not exists transcript text not null default '',
  add column if not exists subtitles jsonb not null default '[]'::jsonb,
  add column if not exists subtitle_style jsonb not null default '{}'::jsonb;

create table if not exists public.user_activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  page text not null,
  label text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists user_activity_events_user_id_created_at_idx
  on public.user_activity_events (user_id, created_at desc);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_learner_access_updated_at on public.learner_access;
create trigger set_learner_access_updated_at
before update on public.learner_access
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_notebooks_updated_at on public.user_notebooks;
create trigger set_user_notebooks_updated_at
before update on public.user_notebooks
for each row
execute function public.set_updated_at();

drop trigger if exists set_reading_exams_updated_at on public.reading_exams;
create trigger set_reading_exams_updated_at
before update on public.reading_exams
for each row
execute function public.set_updated_at();

drop trigger if exists set_support_reports_updated_at on public.support_reports;
create trigger set_support_reports_updated_at
before update on public.support_reports
for each row
execute function public.set_updated_at();

drop trigger if exists set_speaking_sample_videos_updated_at on public.speaking_sample_videos;
create trigger set_speaking_sample_videos_updated_at
before update on public.speaking_sample_videos
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, 'student@example.com'), '@', 1), 'Student'),
    case
      when coalesce(new.raw_user_meta_data ->> 'role', 'student') = 'admin' then 'admin'
      else 'student'
    end
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = timezone('utc', now());

  insert into public.learner_access (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_notebooks (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.learner_access enable row level security;
alter table public.user_notebooks enable row level security;
alter table public.reading_exams enable row level security;
alter table public.support_reports enable row level security;
alter table public.speaking_sample_videos enable row level security;
alter table public.user_activity_events enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read own access" on public.learner_access;
create policy "Users can read own access"
on public.learner_access
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read own notebook" on public.user_notebooks;
create policy "Users can read own notebook"
on public.user_notebooks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own notebook" on public.user_notebooks;
create policy "Users can insert own notebook"
on public.user_notebooks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own notebook" on public.user_notebooks;
create policy "Users can update own notebook"
on public.user_notebooks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read reading exams" on public.reading_exams;
create policy "Authenticated users can read reading exams"
on public.reading_exams
for select
to authenticated
using (true);

drop policy if exists "Users can read own support reports" on public.support_reports;
create policy "Users can read own support reports"
on public.support_reports
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own support reports" on public.support_reports;
create policy "Users can create own support reports"
on public.support_reports
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users can read active speaking sample videos" on public.speaking_sample_videos;
create policy "Authenticated users can read active speaking sample videos"
on public.speaking_sample_videos
for select
to authenticated
using (is_active = true and deleted_at is null);

drop policy if exists "Users can insert own activity events" on public.user_activity_events;
create policy "Users can insert own activity events"
on public.user_activity_events
for insert
to authenticated
with check (auth.uid() = user_id);

comment on table public.profiles is 'Application-level profile and role for each Supabase auth user.';
comment on table public.learner_access is 'Course access, expiry, and credit counters for each learner.';
comment on table public.user_notebooks is 'Per-user synced notebook entries and custom notebook sections.';
comment on table public.reading_exams is 'Admin-uploaded reading passages, answer keys, and parsed payloads for reading exam banks.';
comment on table public.support_reports is 'Client-submitted bug reports and support issues for the admin team to handle.';
comment on table public.speaking_sample_videos is 'Admin-recorded IELTS Speaking Part 2 sample video catalog. Storage objects remain private and are served through signed URLs.';
comment on table public.user_activity_events is 'Lightweight per-user page/feature visit log for admin activity tracking. Append-only; admin reads via service role.';
