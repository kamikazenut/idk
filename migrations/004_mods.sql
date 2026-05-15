do $$
begin
  create type public.mod_source_type as enum ('direct', 'torrent', 'external');
exception
  when duplicate_object then null;
end $$;

create table public.mod_games (
  id uuid primary key default gen_random_uuid(),
  game_id uuid references public.games(id) on delete set null,
  title text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  banner_image_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null
);

create table public.mod_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  color_hex text not null default '#e11d48',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mod_game_categories (
  mod_game_id uuid not null references public.mod_games(id) on delete cascade,
  category_id uuid not null references public.mod_categories(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (mod_game_id, category_id)
);

create table public.mods (
  id uuid primary key default gen_random_uuid(),
  mod_game_id uuid not null references public.mod_games(id) on delete cascade,
  category_id uuid references public.mod_categories(id) on delete set null,
  title text not null,
  slug text not null,
  summary text,
  description text,
  author_name text,
  version text,
  supported_versions text[] not null default '{}',
  install_instructions text,
  cover_image_url text,
  screenshots jsonb not null default '[]'::jsonb,
  file_size_mb numeric(12, 2) check (file_size_mb is null or file_size_mb >= 0),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  view_count bigint not null default 0,
  download_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  unique (mod_game_id, slug),
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(author_name, '')), 'B')
  ) stored
);

create table public.mod_download_links (
  id uuid primary key default gen_random_uuid(),
  mod_id uuid not null references public.mods(id) on delete cascade,
  label text not null,
  url text not null,
  source_type public.mod_source_type not null default 'external',
  file_size_mb numeric(12, 2) check (file_size_mb is null or file_size_mb >= 0),
  version text,
  click_count bigint not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mod_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  score integer not null check (score between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, mod_id)
);

create table public.mod_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mod_id uuid not null references public.mods(id) on delete cascade,
  body text not null,
  is_approved boolean not null default false,
  is_pinned boolean not null default false,
  parent_id uuid references public.mod_comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mod_download_log (
  id uuid primary key default gen_random_uuid(),
  mod_id uuid not null references public.mods(id) on delete cascade,
  link_id uuid references public.mod_download_links(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  ip_hash text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index mod_games_slug_idx on public.mod_games (slug);
create index mod_games_published_idx on public.mod_games (is_published, created_at desc);
create index mod_games_game_id_idx on public.mod_games (game_id);
create index mod_categories_slug_idx on public.mod_categories (slug);
create index mod_game_categories_mod_game_idx on public.mod_game_categories (mod_game_id, sort_order);
create index mods_game_category_idx on public.mods (mod_game_id, category_id, created_at desc);
create index mods_slug_idx on public.mods (slug);
create index mods_published_idx on public.mods (is_published, created_at desc);
create index mods_featured_idx on public.mods (is_featured) where is_featured = true;
create index mods_download_count_idx on public.mods (download_count desc);
create index mods_search_vector_idx on public.mods using gin (search_vector);
create index mod_download_links_mod_id_idx on public.mod_download_links (mod_id, sort_order);
create index mod_download_links_active_idx on public.mod_download_links (is_active) where is_active = true;
create index mod_ratings_mod_id_idx on public.mod_ratings (mod_id);
create index mod_comments_mod_id_idx on public.mod_comments (mod_id, is_approved, is_pinned, created_at desc);
create index mod_download_log_mod_id_idx on public.mod_download_log (mod_id, created_at desc);

create trigger mod_games_set_updated_at
before update on public.mod_games
for each row execute function public.set_updated_at();

create trigger mod_categories_set_updated_at
before update on public.mod_categories
for each row execute function public.set_updated_at();

create trigger mods_set_updated_at
before update on public.mods
for each row execute function public.set_updated_at();

create trigger mod_download_links_set_updated_at
before update on public.mod_download_links
for each row execute function public.set_updated_at();

create trigger mod_comments_set_updated_at
before update on public.mod_comments
for each row execute function public.set_updated_at();

create or replace function public.increment_mod_view_count(target_mod_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.mods
  set view_count = view_count + 1
  where id = target_mod_id;
$$;

create or replace function public.increment_mod_download_counts(target_mod_id uuid, target_link_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.mods
  set download_count = download_count + 1
  where id = target_mod_id;

  update public.mod_download_links
  set click_count = click_count + 1
  where id = target_link_id;
$$;

alter table public.mod_games enable row level security;
alter table public.mod_categories enable row level security;
alter table public.mod_game_categories enable row level security;
alter table public.mods enable row level security;
alter table public.mod_download_links enable row level security;
alter table public.mod_ratings enable row level security;
alter table public.mod_comments enable row level security;
alter table public.mod_download_log enable row level security;

create policy "Published mod games are public"
on public.mod_games for select
using ((is_published = true) or public.is_staff(auth.uid()));

create policy "Staff manage mod games"
on public.mod_games for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Mod categories are public"
on public.mod_categories for select
using (true);

create policy "Staff manage mod categories"
on public.mod_categories for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Mod game categories are public"
on public.mod_game_categories for select
using (true);

create policy "Staff manage mod game categories"
on public.mod_game_categories for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Published mods are public"
on public.mods for select
using ((is_published = true and deleted_at is null) or public.is_staff(auth.uid()));

create policy "Staff manage mods"
on public.mods for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Active mod download links are public"
on public.mod_download_links for select
using (
  public.is_staff(auth.uid())
  or (
    is_active = true
    and exists (
      select 1
      from public.mods
      where mods.id = mod_download_links.mod_id
        and mods.is_published = true
        and mods.deleted_at is null
    )
  )
);

create policy "Staff manage mod download links"
on public.mod_download_links for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Mod ratings are public"
on public.mod_ratings for select
using (true);

create policy "Users create mod ratings"
on public.mod_ratings for insert
with check (user_id = auth.uid());

create policy "Users update mod ratings"
on public.mod_ratings for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Approved mod comments are public"
on public.mod_comments for select
using (is_approved = true or user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Users create mod comments"
on public.mod_comments for insert
with check (user_id = auth.uid());

create policy "Staff moderate mod comments"
on public.mod_comments for update
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Users delete their mod comments"
on public.mod_comments for delete
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Mod download logs are insertable"
on public.mod_download_log for insert
with check (user_id is null or user_id = auth.uid());

create policy "Users see their mod download logs"
on public.mod_download_log for select
using (user_id = auth.uid() or public.is_staff(auth.uid()));

grant select on public.mod_games, public.mod_categories, public.mod_game_categories, public.mods, public.mod_download_links, public.mod_ratings, public.mod_comments to anon, authenticated;
grant insert on public.mod_download_log to anon, authenticated;
grant insert, update, delete on public.mod_ratings, public.mod_comments to authenticated;
grant execute on function public.increment_mod_view_count(uuid), public.increment_mod_download_counts(uuid, uuid) to anon, authenticated;

insert into public.mod_categories (name, slug, description, color_hex, sort_order) values
  ('Mods', 'mods', 'General gameplay modifications.', '#e11d48', 10),
  ('Modpacks', 'modpacks', 'Curated bundles of multiple mods.', '#71717a', 20),
  ('Maps', 'maps', 'Custom maps, worlds, and levels.', '#10b981', 30),
  ('Models', 'models', 'Characters, props, vehicles, and model packs.', '#a1a1aa', 40),
  ('Server Setups', 'server-setups', 'Server files, configs, and deployable setups.', '#e11d48', 50),
  ('Plugins', 'plugins', 'Server or framework plugins.', '#71717a', 60),
  ('Resource Packs', 'resource-packs', 'Textures, UI, audio, and visual packs.', '#a1a1aa', 70),
  ('Tools', 'tools', 'Launchers, editors, save tools, and utilities.', '#71717a', 80)
on conflict (slug) do nothing;
