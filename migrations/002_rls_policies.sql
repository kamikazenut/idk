alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.download_links enable row level security;
alter table public.wishlists enable row level security;
alter table public.ratings enable row level security;
alter table public.comments enable row level security;
alter table public.tags enable row level security;
alter table public.game_tags enable row level security;
alter table public.download_log enable row level security;
alter table public.analytics_events enable row level security;

create policy "Profiles are visible"
on public.profiles for select
using (true);

create policy "Users update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Admins manage profiles"
on public.profiles for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Published games are public"
on public.games for select
using ((is_published = true and deleted_at is null) or public.is_staff(auth.uid()));

create policy "Staff create games"
on public.games for insert
with check (public.is_staff(auth.uid()));

create policy "Staff update games"
on public.games for update
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Admins delete games"
on public.games for delete
using (public.is_admin(auth.uid()));

create policy "Active download links are public"
on public.download_links for select
using (
  public.is_staff(auth.uid())
  or (
    is_active = true
    and exists (
      select 1
      from public.games
      where games.id = download_links.game_id
        and games.is_published = true
        and games.deleted_at is null
    )
  )
);

create policy "Staff manage download links"
on public.download_links for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Users see their wishlists"
on public.wishlists for select
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Users create wishlist entries"
on public.wishlists for insert
with check (user_id = auth.uid());

create policy "Users delete wishlist entries"
on public.wishlists for delete
using (user_id = auth.uid());

create policy "Ratings are public"
on public.ratings for select
using (true);

create policy "Users create ratings"
on public.ratings for insert
with check (user_id = auth.uid());

create policy "Users update ratings"
on public.ratings for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users delete ratings"
on public.ratings for delete
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Approved comments are public"
on public.comments for select
using (is_approved = true or user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Users create comments"
on public.comments for insert
with check (user_id = auth.uid());

create policy "Users edit their pending comments"
on public.comments for update
using (user_id = auth.uid() and is_approved = false)
with check (user_id = auth.uid());

create policy "Users delete their comments"
on public.comments for delete
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Staff moderate comments"
on public.comments for update
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Tags are public"
on public.tags for select
using (true);

create policy "Staff manage tags"
on public.tags for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Game tags are public"
on public.game_tags for select
using (true);

create policy "Staff manage game tags"
on public.game_tags for all
using (public.is_staff(auth.uid()))
with check (public.is_staff(auth.uid()));

create policy "Download logs are insertable"
on public.download_log for insert
with check (user_id is null or user_id = auth.uid());

create policy "Users see their download logs"
on public.download_log for select
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Analytics events are insertable"
on public.analytics_events for insert
with check (user_id is null or user_id = auth.uid());

create policy "Users see their analytics events"
on public.analytics_events for select
using (user_id = auth.uid() or public.is_staff(auth.uid()));

create policy "Game media is public"
on storage.objects for select
using (bucket_id = 'game-media');

create policy "Staff upload game media"
on storage.objects for insert
with check (bucket_id = 'game-media' and public.is_staff(auth.uid()));

create policy "Staff update game media"
on storage.objects for update
using (bucket_id = 'game-media' and public.is_staff(auth.uid()))
with check (bucket_id = 'game-media' and public.is_staff(auth.uid()));

create policy "Staff delete game media"
on storage.objects for delete
using (bucket_id = 'game-media' and public.is_staff(auth.uid()));
