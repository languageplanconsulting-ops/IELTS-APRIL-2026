-- Monthly usage overview for the admin Analytics tab.
--
-- Run this ONCE in the Supabase SQL editor (project: IELTS APRIL 2026).
-- It only adds one read-only function; it does not touch any existing table or data.
--
-- It reads public.user_engagement_segments (the same table the existing engagement
-- RPCs read) and returns, for one date range, four kinds of rows in a single result:
--   scope = 'month'   -> one row: totals for the whole range
--   scope = 'day'     -> one row per local day (bucket_at) = daily active learners
--   scope = 'page'    -> one row per app area (speaking / writing / reading / ...)
--   scope = 'feature' -> one row per feature inside an area (reading.pdoy, sat.vocab, ...)
--
-- p_learners_only = true drops admin accounts and the synthetic admin-code actor, so
-- teacher testing does not inflate the numbers.

create or replace function public.admin_usage_overview(
  p_start_at timestamptz default null,
  p_end_at timestamptz default null,
  p_timezone text default 'Asia/Bangkok',
  p_learners_only boolean default true
)
returns table (
  scope text,
  page text,
  feature text,
  bucket_at timestamptz,
  active_seconds bigint,
  segment_count bigint,
  session_count bigint,
  actor_count bigint,
  active_day_count bigint
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;
  perform timezone(p_timezone, now());

  return query
  with ranged as (
    select
      s.actor_key,
      s.session_id,
      s.page as page_name,
      s.feature as feature_name,
      (
        date_trunc('day', greatest(s.started_at, coalesce(p_start_at, s.started_at)) at time zone p_timezone)
        at time zone p_timezone
      ) as day_at,
      greatest(
        0,
        least(
          s.active_seconds::numeric,
          extract(epoch from (
            least(s.last_seen_at, coalesce(p_end_at, s.last_seen_at))
            - greatest(s.started_at, coalesce(p_start_at, s.started_at))
          ))
        )
      )::bigint as secs
    from public.user_engagement_segments s
    left join public.profiles p on p.id = s.user_id
    where (p_start_at is null or s.last_seen_at >= p_start_at)
      and (p_end_at is null or s.started_at < p_end_at)
      and (
        not p_learners_only
        or (s.actor_key <> 'synthetic:admin-code' and coalesce(p.role, '') <> 'admin')
      )
  )
  select
    'month'::text,
    ''::text,
    ''::text,
    null::timestamptz,
    coalesce(sum(r.secs), 0)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint,
    count(distinct (r.actor_key, r.day_at))::bigint
  from ranged r
  union all
  select
    'day'::text,
    ''::text,
    ''::text,
    r.day_at,
    sum(r.secs)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint,
    count(distinct (r.actor_key, r.day_at))::bigint
  from ranged r
  group by r.day_at
  union all
  select
    'page'::text,
    r.page_name,
    ''::text,
    null::timestamptz,
    sum(r.secs)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint,
    count(distinct (r.actor_key, r.day_at))::bigint
  from ranged r
  group by r.page_name
  union all
  select
    'feature'::text,
    r.page_name,
    r.feature_name,
    null::timestamptz,
    sum(r.secs)::bigint,
    count(*)::bigint,
    count(distinct (r.actor_key, r.session_id))::bigint,
    count(distinct r.actor_key)::bigint,
    count(distinct (r.actor_key, r.day_at))::bigint
  from ranged r
  group by r.page_name, r.feature_name;
end;
$$;

revoke all on function public.admin_usage_overview(timestamptz, timestamptz, text, boolean) from public, anon, authenticated;
grant execute on function public.admin_usage_overview(timestamptz, timestamptz, text, boolean) to service_role;
