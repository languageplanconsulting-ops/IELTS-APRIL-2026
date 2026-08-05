-- IELTS Bite Size tables. Safe to re-run: everything is create-if-not-exists.
-- Paste this whole file into the Supabase SQL editor.

-- ---------------------------------------------------------------------------
-- IELTS Bite Size: short-form video feed (Instagram-style), admin-authored.
-- Videos live in Bunny Stream; only the guid + display metadata are stored here.
-- ---------------------------------------------------------------------------

create table if not exists public.bite_size_posts (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'writing' check (category in ('writing', 'speaking', 'listening', 'reading')),
  title text not null default '',
  caption text not null default '',
  hashtags text[] not null default '{}',
  provider text not null default 'bunny',
  library_id text not null default '',
  video_guid text not null default '',
  cdn_hostname text not null default '',
  cover_time_ms integer not null default 0 check (cover_time_ms >= 0),
  duration_seconds numeric not null default 0 check (duration_seconds >= 0),
  width integer not null default 0 check (width >= 0),
  height integer not null default 0 check (height >= 0),
  encode_status text not null default 'processing' check (encode_status in ('processing', 'ready', 'failed')),
  encode_progress integer not null default 0 check (encode_progress between 0 and 100),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_index integer not null default 0,
  view_count integer not null default 0 check (view_count >= 0),
  like_count integer not null default 0 check (like_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  created_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists bite_size_posts_feed_idx
  on public.bite_size_posts (status, category, sort_index desc, created_at desc);

create table if not exists public.bite_size_likes (
  post_id uuid not null references public.bite_size_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (post_id, user_id)
);

create table if not exists public.bite_size_saves (
  post_id uuid not null references public.bite_size_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (post_id, user_id)
);

create table if not exists public.bite_size_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.bite_size_posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  author_name text not null default 'Student',
  body text not null default '',
  deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists bite_size_comments_post_idx
  on public.bite_size_comments (post_id, created_at desc);

drop trigger if exists set_bite_size_posts_updated_at on public.bite_size_posts;
create trigger set_bite_size_posts_updated_at
before update on public.bite_size_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_bite_size_comments_updated_at on public.bite_size_comments;
create trigger set_bite_size_comments_updated_at
before update on public.bite_size_comments
for each row execute function public.set_updated_at();

alter table public.bite_size_posts enable row level security;
alter table public.bite_size_likes enable row level security;
alter table public.bite_size_saves enable row level security;
alter table public.bite_size_comments enable row level security;

drop policy if exists "Authenticated users can read published bite size posts" on public.bite_size_posts;
create policy "Authenticated users can read published bite size posts"
on public.bite_size_posts
for select
to authenticated
using (status = 'published' and deleted_at is null);

drop policy if exists "Authenticated users can read their own bite size likes" on public.bite_size_likes;
create policy "Authenticated users can read their own bite size likes"
on public.bite_size_likes
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Authenticated users can read their own bite size saves" on public.bite_size_saves;
create policy "Authenticated users can read their own bite size saves"
on public.bite_size_saves
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Authenticated users can read bite size comments" on public.bite_size_comments;
create policy "Authenticated users can read bite size comments"
on public.bite_size_comments
for select
to authenticated
using (deleted_at is null);

comment on table public.bite_size_posts is 'IELTS Bite Size short-form videos hosted on Bunny Stream. Writes go through the API server with the service role key.';
comment on table public.bite_size_likes is 'Per-user likes on IELTS Bite Size posts.';
comment on table public.bite_size_saves is 'Per-user bookmarks on IELTS Bite Size posts.';
comment on table public.bite_size_comments is 'Comments on IELTS Bite Size posts.';

-- Admin-made groups ("highlights") so clips can be bundled across categories.
create table if not exists public.bite_size_collections (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  emoji text not null default '📌',
  description text not null default '',
  cover_post_id uuid references public.bite_size_posts(id) on delete set null,
  sort_index integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_by uuid references public.profiles(id) on delete set null,
  deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bite_size_collection_items (
  collection_id uuid not null references public.bite_size_collections(id) on delete cascade,
  post_id uuid not null references public.bite_size_posts(id) on delete cascade,
  sort_index integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (collection_id, post_id)
);

create index if not exists bite_size_collection_items_post_idx
  on public.bite_size_collection_items (post_id);

drop trigger if exists set_bite_size_collections_updated_at on public.bite_size_collections;
create trigger set_bite_size_collections_updated_at
before update on public.bite_size_collections
for each row execute function public.set_updated_at();

alter table public.bite_size_collections enable row level security;
alter table public.bite_size_collection_items enable row level security;

drop policy if exists "Authenticated users can read published bite size collections" on public.bite_size_collections;
create policy "Authenticated users can read published bite size collections"
on public.bite_size_collections
for select
to authenticated
using (status = 'published' and deleted_at is null);

drop policy if exists "Authenticated users can read bite size collection items" on public.bite_size_collection_items;
create policy "Authenticated users can read bite size collection items"
on public.bite_size_collection_items
for select
to authenticated
using (true);

comment on table public.bite_size_collections is 'Admin-curated groups of IELTS Bite Size clips, shown as Instagram-style highlights.';
comment on table public.bite_size_collection_items is 'Membership rows linking Bite Size posts to collections.';
