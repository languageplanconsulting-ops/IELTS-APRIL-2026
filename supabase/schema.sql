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
  enabled_modules text[] not null default '{speaking,reading,listening}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table if exists public.learner_access
  add column if not exists enabled_modules text[] not null default '{speaking,reading,listening}';

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

create table if not exists public.task1_qa_comments (
  id uuid primary key default gen_random_uuid(),
  prompt_id text not null,
  role text not null check (role in ('intro', 'overview', 'body1', 'body2', 'general')),
  quote text not null default '',
  note text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  resolved_at timestamptz
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

create table if not exists public.user_engagement_segments (
  segment_id uuid not null,
  user_id uuid references public.profiles(id) on delete cascade,
  actor_key text not null check (length(btrim(actor_key)) > 0 and length(actor_key) <= 160),
  session_id text not null check (length(btrim(session_id)) > 0 and length(session_id) <= 160),
  page text not null check (length(btrim(page)) > 0 and length(page) <= 200),
  feature text not null default '' check (length(feature) <= 120),
  activity_type text not null default '' check (length(activity_type) <= 120),
  activity_id text not null default '' check (length(activity_id) <= 200),
  label text not null default '' check (length(label) <= 300),
  started_at timestamptz not null,
  ended_at timestamptz,
  last_seen_at timestamptz not null,
  active_seconds integer not null default 0 check (active_seconds >= 0 and active_seconds <= 86400),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (actor_key, segment_id),
  constraint user_engagement_segments_time_order check (
    last_seen_at >= started_at and (ended_at is null or ended_at >= started_at)
  ),
  constraint user_engagement_segments_actor_identity check (
    (user_id is not null and actor_key = 'user:' || user_id::text)
    or (user_id is null and actor_key = 'synthetic:admin-code')
  )
);

create index if not exists user_engagement_segments_user_last_seen_idx
  on public.user_engagement_segments (user_id, last_seen_at desc)
  where user_id is not null;

create index if not exists user_engagement_segments_actor_last_seen_idx
  on public.user_engagement_segments (actor_key, last_seen_at desc);

create index if not exists user_engagement_segments_started_at_idx
  on public.user_engagement_segments (started_at desc);

create index if not exists user_engagement_segments_feature_started_idx
  on public.user_engagement_segments (feature, started_at desc);

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

create or replace function public.prepare_engagement_segment_update()
returns trigger
language plpgsql
as $$
begin
  new.user_id = old.user_id;
  new.actor_key = old.actor_key;
  new.segment_id = old.segment_id;
  new.session_id = old.session_id;
  new.started_at = old.started_at;
  new.created_at = old.created_at;
  new.last_seen_at = greatest(old.last_seen_at, new.last_seen_at);
  new.active_seconds = greatest(old.active_seconds, new.active_seconds);
  if old.ended_at is not null and new.ended_at is null then
    new.ended_at = old.ended_at;
  elsif old.ended_at is not null and new.ended_at is not null then
    new.ended_at = greatest(old.ended_at, new.ended_at);
  end if;
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists prepare_user_engagement_segment_update on public.user_engagement_segments;
create trigger prepare_user_engagement_segment_update
before update on public.user_engagement_segments
for each row
execute function public.prepare_engagement_segment_update();

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
alter table public.task1_qa_comments enable row level security;
alter table public.speaking_sample_videos enable row level security;
alter table public.user_activity_events enable row level security;
alter table public.user_engagement_segments enable row level security;

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

drop policy if exists "Users can read own engagement segments" on public.user_engagement_segments;
create policy "Users can read own engagement segments"
on public.user_engagement_segments
for select
to authenticated
using (auth.uid() = user_id and actor_key = 'user:' || auth.uid()::text);

drop policy if exists "Users can insert own engagement segments" on public.user_engagement_segments;
create policy "Users can insert own engagement segments"
on public.user_engagement_segments
for insert
to authenticated
with check (auth.uid() = user_id and actor_key = 'user:' || auth.uid()::text);

drop policy if exists "Users can update own engagement segments" on public.user_engagement_segments;
create policy "Users can update own engagement segments"
on public.user_engagement_segments
for update
to authenticated
using (auth.uid() = user_id and actor_key = 'user:' || auth.uid()::text)
with check (auth.uid() = user_id and actor_key = 'user:' || auth.uid()::text);

create or replace function public.admin_engagement_ranking(
  p_start_at timestamptz default null,
  p_end_at timestamptz default null
)
returns table (
  actor_key text,
  user_id uuid,
  email text,
  display_name text,
  account_role text,
  dominant_feature text,
  active_seconds bigint,
  segment_count bigint,
  session_count bigint,
  first_started_at timestamptz,
  last_seen_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;

  return query
  with ranged as (
    select
      s.*,
      greatest(
        0,
        least(
          s.active_seconds::numeric,
          extract(epoch from (
            least(s.last_seen_at, coalesce(p_end_at, s.last_seen_at))
            - greatest(s.started_at, coalesce(p_start_at, s.started_at))
          ))
        )
      )::bigint as ranged_active_seconds
    from public.user_engagement_segments s
    where (p_start_at is null or s.last_seen_at >= p_start_at)
      and (p_end_at is null or s.started_at < p_end_at)
  )
  select
    r.actor_key,
    r.user_id,
    coalesce(p.email, case when r.actor_key = 'synthetic:admin-code' then 'admin@englishplan.local' else '' end),
    coalesce(p.full_name, case when r.actor_key = 'synthetic:admin-code' then 'Admin' else r.actor_key end),
    coalesce(p.role, case when r.actor_key = 'synthetic:admin-code' then 'admin' else 'unknown' end),
    coalesce((
      select feature_row.feature
      from ranged feature_row
      where feature_row.actor_key = r.actor_key
      group by feature_row.feature
      order by sum(feature_row.ranged_active_seconds) desc, feature_row.feature
      limit 1
    ), ''),
    sum(r.ranged_active_seconds)::bigint,
    count(*)::bigint,
    count(distinct r.session_id)::bigint,
    min(r.started_at),
    max(r.last_seen_at)
  from ranged r
  left join public.profiles p on p.id = r.user_id
  group by r.actor_key, r.user_id, p.email, p.full_name, p.role
  order by sum(r.ranged_active_seconds) desc, max(r.last_seen_at) desc;
end;
$$;

create or replace function public.admin_engagement_feature_totals(
  p_start_at timestamptz default null,
  p_end_at timestamptz default null
)
returns table (
  feature text,
  activity_type text,
  activity_id text,
  label text,
  active_seconds bigint,
  segment_count bigint,
  session_count bigint,
  actor_count bigint
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;

  return query
  with ranged as (
    select
      s.*,
      greatest(
        0,
        least(
          s.active_seconds::numeric,
          extract(epoch from (
            least(s.last_seen_at, coalesce(p_end_at, s.last_seen_at))
            - greatest(s.started_at, coalesce(p_start_at, s.started_at))
          ))
        )
      )::bigint as ranged_active_seconds
    from public.user_engagement_segments s
    where (p_start_at is null or s.last_seen_at >= p_start_at)
      and (p_end_at is null or s.started_at < p_end_at)
  )
  select
    r.feature,
    r.activity_type,
    r.activity_id,
    r.label,
    sum(r.ranged_active_seconds)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint
  from ranged r
  group by r.feature, r.activity_type, r.activity_id, r.label
  order by sum(r.ranged_active_seconds) desc, count(*) desc;
end;
$$;

create or replace function public.admin_engagement_trend(
  p_start_at timestamptz default null,
  p_end_at timestamptz default null,
  p_bucket text default 'day',
  p_timezone text default 'UTC'
)
returns table (
  bucket_at timestamptz,
  active_seconds bigint,
  segment_count bigint,
  session_count bigint,
  actor_count bigint
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if p_bucket not in ('hour', 'day', 'month') then
    raise exception 'invalid trend bucket' using errcode = '22023';
  end if;
  perform timezone(p_timezone, now());

  return query
  with ranged as (
    select
      s.*,
      greatest(
        0,
        least(
          s.active_seconds::numeric,
          extract(epoch from (
            least(s.last_seen_at, coalesce(p_end_at, s.last_seen_at))
            - greatest(s.started_at, coalesce(p_start_at, s.started_at))
          ))
        )
      )::bigint as ranged_active_seconds
    from public.user_engagement_segments s
    where (p_start_at is null or s.last_seen_at >= p_start_at)
      and (p_end_at is null or s.started_at < p_end_at)
  )
  select
    (date_trunc(p_bucket, greatest(r.started_at, coalesce(p_start_at, r.started_at)) at time zone p_timezone)
      at time zone p_timezone) as bucket_at,
    sum(r.ranged_active_seconds)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint
  from ranged r
  group by 1
  order by 1;
end;
$$;

create or replace function public.admin_engagement_actor_journey(
  p_actor_key text,
  p_start_at timestamptz default null,
  p_end_at timestamptz default null
)
returns table (
  actor_key text,
  user_id uuid,
  email text,
  display_name text,
  account_role text,
  segment_id uuid,
  session_id text,
  page text,
  feature text,
  activity_type text,
  activity_id text,
  label text,
  started_at timestamptz,
  ended_at timestamptz,
  last_seen_at timestamptz,
  active_seconds integer,
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  if coalesce(length(btrim(p_actor_key)), 0) = 0 then
    raise exception 'actor key required' using errcode = '22023';
  end if;

  return query
  select
    s.actor_key,
    s.user_id,
    coalesce(p.email, case when s.actor_key = 'synthetic:admin-code' then 'admin@englishplan.local' else '' end),
    coalesce(p.full_name, case when s.actor_key = 'synthetic:admin-code' then 'Admin' else s.actor_key end),
    coalesce(p.role, case when s.actor_key = 'synthetic:admin-code' then 'admin' else 'unknown' end),
    s.segment_id,
    s.session_id,
    s.page,
    s.feature,
    s.activity_type,
    s.activity_id,
    s.label,
    s.started_at,
    s.ended_at,
    s.last_seen_at,
    s.active_seconds,
    s.metadata,
    s.created_at,
    s.updated_at
  from public.user_engagement_segments s
  left join public.profiles p on p.id = s.user_id
  where s.actor_key = p_actor_key
    and (p_start_at is null or s.last_seen_at >= p_start_at)
    and (p_end_at is null or s.started_at < p_end_at)
  order by s.started_at desc, s.last_seen_at desc;
end;
$$;

revoke all on function public.admin_engagement_ranking(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_engagement_feature_totals(timestamptz, timestamptz) from public, anon, authenticated;
revoke all on function public.admin_engagement_trend(timestamptz, timestamptz, text, text) from public, anon, authenticated;
revoke all on function public.admin_engagement_actor_journey(text, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.admin_engagement_ranking(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_engagement_feature_totals(timestamptz, timestamptz) to service_role;
grant execute on function public.admin_engagement_trend(timestamptz, timestamptz, text, text) to service_role;
grant execute on function public.admin_engagement_actor_journey(text, timestamptz, timestamptz) to service_role;

comment on table public.profiles is 'Application-level profile and role for each Supabase auth user.';
comment on table public.learner_access is 'Course access, expiry, and credit counters for each learner.';
comment on table public.user_notebooks is 'Per-user synced notebook entries and custom notebook sections.';
comment on table public.reading_exams is 'Admin-uploaded reading passages, answer keys, and parsed payloads for reading exam banks.';
comment on table public.support_reports is 'Client-submitted bug reports and support issues for the admin team to handle.';
comment on table public.speaking_sample_videos is 'Admin-recorded IELTS Speaking Part 2 sample video catalog. Storage objects remain private and are served through signed URLs.';
comment on table public.user_activity_events is 'Lightweight per-user page/feature visit log for admin activity tracking. Append-only; admin reads via service role.';
comment on table public.user_engagement_segments is 'Cumulative client heartbeat segments keyed by a server-derived actor identity; synthetic admin-code rows are service-role only.';
