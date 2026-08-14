-- Placement test submissions.
--
-- Written by the public, no-login placement test at /placement and read only by
-- admins, so that when a visitor later registers for a course their original
-- attempt can be pulled up in full: every answer, both marked paragraphs, the
-- speaking transcript and the detectors behind each band.
--
-- Run by hand against the project, like supabase/bite-size-tables.sql.

create table if not exists public.placement_results (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  contact text,
  overall_band text,
  reading_band text,
  listening_band text,
  writing_band text,
  speaking_band text,
  speaking_pending boolean not null default true,
  -- Everything else lives here as JSON so the test can grow new sections
  -- without a migration: answers, wrong list, transcripts, signals, paragraph.
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists placement_results_created_idx
  on public.placement_results (created_at desc);

create index if not exists placement_results_contact_idx
  on public.placement_results (lower(contact));

-- The server writes with the service role and reads for admins only, so no
-- policy grants access to anon or authenticated roles.
alter table public.placement_results enable row level security;

comment on table public.placement_results is
  'Submissions from the public IELTS placement test; admin-only, kept for follow-up when a visitor registers.';
