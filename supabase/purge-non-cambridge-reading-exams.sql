-- Removes admin-uploaded reading exams that are not Cambridge IELTS books 12, 13, 18, or 19.
-- Run in Supabase SQL Editor if you cannot run scripts/purge-non-cambridge-reading-exams.mjs locally.

delete from public.reading_exams
where not (
  title ~* '\ycambridge\s*1[289]\y'
  or title ~* '^\s*c1[289]\s'
  or id ~* '^cambridge-1[289]-'
);
