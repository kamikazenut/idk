create extension if not exists pgcrypto;

create type public.user_role as enum ('user', 'moderator', 'admin');
create type public.download_source_type as enum ('direct', 'torrent', 'external');
create type public.analytics_event_type as enum ('page_view', 'download', 'search');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  bio text,
  role public.user_role not null default 'user',
  banned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  genre text[] not null default '{}',
  platform text[] not null default '{}',
  release_year integer check (release_year is null or release_year between 1950 and 2100),
  developer text,
  publisher text,
  cover_image_url text,
  banner_image_url text,
  screenshots jsonb not null default '[]'::jsonb,
  system_requirements text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  view_count bigint not null default 0,
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(short_description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(developer, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(publisher, '')), 'D')
  ) stored
);

create table public.download_links (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  label text not null,
  url text not null,
  source_type public.download_source_type not null default 'external',
  file_size_mb numeric(12, 2) check (file_size_mb is null or file_size_mb >= 0),
  version text,
  platform_target text,
  click_count bigint not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, game_id)
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, game_id)
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  body text not null,
  is_approved boolean not null default false,
  is_pinned boolean not null default false,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  color_hex text not null default '#32d9ff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.game_tags (
  game_id uuid not null references public.games(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (game_id, tag_id)
);

create view public.categories
with (security_invoker = true)
as select id, name, slug, description, color_hex, created_at, updated_at from public.tags;

create table public.download_log (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  link_id uuid references public.download_links(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  ip_hash text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type public.analytics_event_type not null,
  entity_id uuid,
  user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index games_published_created_idx on public.games (is_published, created_at desc);
create index games_slug_idx on public.games (slug);
create index games_featured_idx on public.games (is_featured) where is_featured = true;
create index games_download_count_idx on public.games (download_count desc);
create index games_genre_idx on public.games using gin (genre);
create index games_platform_idx on public.games using gin (platform);
create index games_search_vector_idx on public.games using gin (search_vector);
create index download_links_game_id_idx on public.download_links (game_id, sort_order);
create index download_links_active_idx on public.download_links (is_active) where is_active = true;
create index wishlists_user_id_idx on public.wishlists (user_id, created_at desc);
create index wishlists_game_id_idx on public.wishlists (game_id);
create index ratings_game_id_idx on public.ratings (game_id);
create index ratings_user_id_idx on public.ratings (user_id);
create index comments_game_id_idx on public.comments (game_id, is_approved, is_pinned, created_at desc);
create index comments_user_id_idx on public.comments (user_id, created_at desc);
create index comments_parent_id_idx on public.comments (parent_id);
create index tags_slug_idx on public.tags (slug);
create index game_tags_game_id_idx on public.game_tags (game_id);
create index game_tags_tag_id_idx on public.game_tags (tag_id);
create index download_log_game_id_idx on public.download_log (game_id, created_at desc);
create index download_log_link_id_idx on public.download_log (link_id, created_at desc);
create index download_log_user_id_idx on public.download_log (user_id, created_at desc);
create index download_log_created_at_idx on public.download_log (created_at desc);
create index analytics_events_type_created_idx on public.analytics_events (event_type, created_at desc);
create index analytics_events_user_id_idx on public.analytics_events (user_id, created_at desc);
create index analytics_events_metadata_idx on public.analytics_events using gin (metadata);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger games_set_updated_at
before update on public.games
for each row execute function public.set_updated_at();

create trigger download_links_set_updated_at
before update on public.download_links
for each row execute function public.set_updated_at();

create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user_id
      and role in ('moderator', 'admin')
      and banned = false
  );
$$;

create or replace function public.is_admin(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = target_user_id
      and role = 'admin'
      and banned = false
  );
$$;

create or replace function public.increment_game_view_count(target_game_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.games
  set view_count = view_count + 1
  where id = target_game_id;
$$;

create or replace function public.increment_download_counts(target_game_id uuid, target_link_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.games
  set download_count = download_count + 1
  where id = target_game_id;

  update public.download_links
  set click_count = click_count + 1
  where id = target_link_id;
$$;

create or replace function public.random_published_games(result_limit integer default 1)
returns setof public.games
language sql
security definer
set search_path = public
stable
as $$
  select *
  from public.games
  where is_published = true
    and deleted_at is null
  order by random()
  limit greatest(1, least(result_limit, 24));
$$;

insert into storage.buckets (id, name, public)
values ('game-media', 'game-media', true)
on conflict (id) do nothing;

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.games, public.download_links, public.tags, public.game_tags, public.categories, public.ratings, public.comments to anon, authenticated;
grant insert on public.analytics_events, public.download_log to anon, authenticated;
grant insert, update, delete on public.wishlists, public.ratings, public.comments to authenticated;
grant update (username, avatar_url, bio, updated_at) on public.profiles to authenticated;
grant execute on function public.is_staff(uuid), public.is_admin(uuid), public.increment_game_view_count(uuid), public.increment_download_counts(uuid, uuid), public.random_published_games(integer) to anon, authenticated;
