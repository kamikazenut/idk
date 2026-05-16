do $$
begin
  create type public.media_type as enum ('movie', 'show');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.media_source_type as enum ('direct', 'torrent', 'external', 'stream');
exception
  when duplicate_object then null;
end $$;

create table public.media_items (
  id uuid primary key default gen_random_uuid(),
  media_type public.media_type not null,
  tmdb_id integer not null,
  title text not null,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date date,
  runtime_minutes integer check (runtime_minutes is null or runtime_minutes >= 0),
  genres text[] not null default '{}',
  original_language text,
  status text,
  tmdb_vote_average numeric(4, 2),
  tmdb_vote_count integer,
  metadata jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  view_count bigint not null default 0,
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_synced_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  unique (media_type, tmdb_id)
);

create table public.media_seasons (
  id uuid primary key default gen_random_uuid(),
  media_item_id uuid not null references public.media_items(id) on delete cascade,
  tmdb_season_id integer,
  season_number integer not null,
  name text,
  overview text,
  poster_path text,
  air_date date,
  episode_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (media_item_id, season_number)
);

create table public.media_episodes (
  id uuid primary key default gen_random_uuid(),
  media_item_id uuid not null references public.media_items(id) on delete cascade,
  season_id uuid references public.media_seasons(id) on delete cascade,
  tmdb_episode_id integer,
  episode_key text not null unique,
  season_number integer not null,
  episode_number integer not null,
  title text not null,
  overview text,
  still_path text,
  air_date date,
  runtime_minutes integer check (runtime_minutes is null or runtime_minutes >= 0),
  metadata jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  view_count bigint not null default 0,
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (media_item_id, season_number, episode_number)
);

create table public.media_download_links (
  id uuid primary key default gen_random_uuid(),
  media_item_id uuid references public.media_items(id) on delete cascade,
  episode_id uuid references public.media_episodes(id) on delete cascade,
  label text not null,
  url text not null,
  source_type public.media_source_type not null default 'external',
  file_size_mb numeric(12, 2) check (file_size_mb is null or file_size_mb >= 0),
  quality text,
  language text,
  version text,
  click_count bigint not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (media_item_id is not null and episode_id is null)
    or (media_item_id is null and episode_id is not null)
  )
);

create table public.media_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_item_id uuid references public.media_items(id) on delete cascade,
  episode_id uuid references public.media_episodes(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  check (
    (media_item_id is not null and episode_id is null)
    or (media_item_id is null and episode_id is not null)
  ),
  unique (user_id, media_item_id),
  unique (user_id, episode_id)
);

create table public.media_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_item_id uuid references public.media_items(id) on delete cascade,
  episode_id uuid references public.media_episodes(id) on delete cascade,
  body text not null,
  is_approved boolean not null default false,
  is_pinned boolean not null default false,
  parent_id uuid references public.media_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (media_item_id is not null and episode_id is null)
    or (media_item_id is null and episode_id is not null)
  )
);

create table public.media_download_log (
  id uuid primary key default gen_random_uuid(),
  media_item_id uuid references public.media_items(id) on delete cascade,
  episode_id uuid references public.media_episodes(id) on delete cascade,
  link_id uuid references public.media_download_links(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  ip_hash text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index media_items_type_published_idx on public.media_items (media_type, is_published, created_at desc);
create index media_items_tmdb_idx on public.media_items (tmdb_id);
create index media_items_featured_idx on public.media_items (is_featured) where is_featured = true;
create index media_items_download_count_idx on public.media_items (download_count desc);
create index media_items_genres_idx on public.media_items using gin (genres);
create index media_seasons_item_idx on public.media_seasons (media_item_id, season_number);
create index media_episodes_item_idx on public.media_episodes (media_item_id, season_number, episode_number);
create index media_episodes_key_idx on public.media_episodes (episode_key);
create index media_download_links_item_idx on public.media_download_links (media_item_id, sort_order);
create index media_download_links_episode_idx on public.media_download_links (episode_id, sort_order);
create index media_download_links_active_idx on public.media_download_links (is_active) where is_active = true;
create index media_comments_item_idx on public.media_comments (media_item_id, is_approved, created_at desc);
create index media_comments_episode_idx on public.media_comments (episode_id, is_approved, created_at desc);
create index media_download_log_created_idx on public.media_download_log (created_at desc);

create trigger media_items_set_updated_at
before update on public.media_items
for each row execute function public.set_updated_at();

create trigger media_seasons_set_updated_at
before update on public.media_seasons
for each row execute function public.set_updated_at();

create trigger media_episodes_set_updated_at
before update on public.media_episodes
for each row execute function public.set_updated_at();

create trigger media_download_links_set_updated_at
before update on public.media_download_links
for each row execute function public.set_updated_at();

create trigger media_comments_set_updated_at
before update on public.media_comments
for each row execute function public.set_updated_at();

create or replace function public.increment_media_view_count(target_media_item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.media_items
  set view_count = view_count + 1
  where id = target_media_item_id;
$$;

create or replace function public.increment_media_episode_view_count(target_episode_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.media_episodes
  set view_count = view_count + 1
  where id = target_episode_id;
$$;

create or replace function public.increment_media_download_counts(target_link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_media_item_id uuid;
  target_episode_id uuid;
begin
  select media_item_id, episode_id
  into target_media_item_id, target_episode_id
  from public.media_download_links
  where id = target_link_id;

  update public.media_download_links
  set click_count = click_count + 1
  where id = target_link_id;

  if target_media_item_id is not null then
    update public.media_items
    set download_count = download_count + 1
    where id = target_media_item_id;
  end if;

  if target_episode_id is not null then
    update public.media_episodes
    set download_count = download_count + 1
    where id = target_episode_id;

    update public.media_items
    set download_count = download_count + 1
    where id = (
      select media_item_id
      from public.media_episodes
      where id = target_episode_id
    );
  end if;
end;
$$;

alter table public.media_items enable row level security;
alter table public.media_seasons enable row level security;
alter table public.media_episodes enable row level security;
alter table public.media_download_links enable row level security;
alter table public.media_ratings enable row level security;
alter table public.media_comments enable row level security;
alter table public.media_download_log enable row level security;

create policy "Published media is public"
on public.media_items for select
using (is_published = true or public.is_staff(auth.uid()));

create policy "Staff manage media"
on public.media_items for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Published media seasons are public"
on public.media_seasons for select
using (
  public.is_staff(auth.uid())
  or exists (
    select 1 from public.media_items
    where media_items.id = media_seasons.media_item_id
      and media_items.is_published = true
  )
);

create policy "Staff manage media seasons"
on public.media_seasons for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Published media episodes are public"
on public.media_episodes for select
using (
  public.is_staff(auth.uid())
  or (
    is_published = true
    and exists (
      select 1 from public.media_items
      where media_items.id = media_episodes.media_item_id
        and media_items.is_published = true
    )
  )
);

create policy "Staff manage media episodes"
on public.media_episodes for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Active media links are public"
on public.media_download_links for select
using (
  public.is_staff(auth.uid())
  or (
    is_active = true
    and (
      exists (
        select 1 from public.media_items
        where media_items.id = media_download_links.media_item_id
          and media_items.is_published = true
      )
      or exists (
        select 1
        from public.media_episodes
        join public.media_items on media_items.id = media_episodes.media_item_id
        where media_episodes.id = media_download_links.episode_id
          and media_episodes.is_published = true
          and media_items.is_published = true
      )
    )
  )
);

create policy "Staff manage media links"
on public.media_download_links for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Media ratings are public"
on public.media_ratings for select
using (true);

create policy "Users create media ratings"
on public.media_ratings for insert
with check (user_id = auth.uid());

create policy "Users update media ratings"
on public.media_ratings for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Approved media comments are public"
on public.media_comments for select
using (is_approved = true or user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Users create media comments"
on public.media_comments for insert
with check (user_id = auth.uid());

create policy "Staff moderate media comments"
on public.media_comments for update
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Users delete media comments"
on public.media_comments for delete
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Media download logs are insertable"
on public.media_download_log for insert
with check (user_id is null or user_id = auth.uid());

create policy "Users see their media download logs"
on public.media_download_log for select
using (user_id = auth.uid() or public.is_staff(auth.uid()));

grant select on public.media_items, public.media_seasons, public.media_episodes, public.media_download_links, public.media_ratings, public.media_comments to anon, authenticated;
grant insert on public.media_download_log to anon, authenticated;
grant insert, update, delete on public.media_ratings, public.media_comments to authenticated;
grant execute on function public.increment_media_view_count(uuid), public.increment_media_episode_view_count(uuid), public.increment_media_download_counts(uuid) to anon, authenticated;
