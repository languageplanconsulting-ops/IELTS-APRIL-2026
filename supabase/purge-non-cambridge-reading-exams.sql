-- Removes admin-uploaded reading exams that are not Cambridge IELTS books 12 or 13.
-- Run in Supabase SQL Editor if you cannot run scripts/purge-non-cambridge-reading-exams.mjs locally.

delete from public.reading_exams
where not (
  title ~* '\ycambridge\s*1[23]\y'
  or title ~* '^\s*c1[23]\s'
);
