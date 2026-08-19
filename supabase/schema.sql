-- ============================================================================
-- Skagerrak Pitch Studio — Supabase schema
-- Run once in the Supabase SQL editor (Database → SQL → New query → Run).
-- Safe to re-run: everything is guarded with "if not exists" / "or replace".
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Who can log in. Every salesperson gets a row here on first sign-in.
-- Team model: any authenticated user sees and edits every pitch.
-- ---------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text,
  name        text,
  role        text not null default 'selger',   -- 'selger' | 'admin'
  created_at  timestamptz not null default now()
);

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- ---------------------------------------------------------------------------
-- Pitches. One row per pitch; the whole pitch document lives in data jsonb
-- (meta, blocks, per-slide layout) so the editor can keep its current shape.
-- ---------------------------------------------------------------------------
create table if not exists pitches (
  id            text primary key,                 -- app-side id, e.g. 'ku1r4i8'
  slug          text unique not null,             -- client URL: /#/p/<slug>
  client        text,
  title         text,
  status        text not null default 'kladd',    -- 'kladd' | 'sendt' | 'vunnet' | 'tapt'
  data          jsonb not null,                   -- { meta, blocks, ... }
  owner_id      uuid references profiles(id) on delete set null,
  view_password text,                             -- crypt()-hashed, never sent to clients
  expires_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists pitches_slug_idx on pitches (slug);
create index if not exists pitches_updated_idx on pitches (updated_at desc);

-- ---------------------------------------------------------------------------
-- Everything shared across the team: faktabase, prisliste, merkevarer,
-- bildekategorier, maler/blokkbibliotek, cases, avsendere.
-- One row per key so two people editing different things never collide.
-- ---------------------------------------------------------------------------
create table if not exists shared_data (
  key        text primary key,   -- 'facts' | 'pricing' | 'brands' | 'senders'
                                 -- 'library' | 'templates' | 'cases' | 'imageCats' | 'images'
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references profiles(id) on delete set null
);

-- ---------------------------------------------------------------------------
-- Bildebibliotek. Files live in Storage; this table is the catalogue.
-- id keeps the app's existing "asset:<id>" reference format.
-- ---------------------------------------------------------------------------
create table if not exists assets (
  id          text primary key,
  path        text not null,          -- storage object path inside 'pitch-assets'
  name        text,
  cat         text,
  mime        text,
  width       int,
  height      int,
  bytes       bigint,
  created_by  uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists assets_cat_idx on assets (cat);

-- ---------------------------------------------------------------------------
-- Sporing: hvem åpnet, hvor langt de kom, hvor lenge per slide.
-- ---------------------------------------------------------------------------
create table if not exists pitch_views (
  id          uuid primary key default gen_random_uuid(),
  pitch_id    text references pitches(id) on delete cascade,
  slug        text,
  session_id  text,                   -- random per browser session
  user_agent  text,
  referrer    text,
  max_scroll  int not null default 0, -- 0-100 %
  slides_seen int not null default 0,
  total_ms    bigint not null default 0,
  opened_at   timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);

create index if not exists pitch_views_pitch_idx on pitch_views (pitch_id, opened_at desc);

create table if not exists pitch_slide_time (
  view_id     uuid references pitch_views(id) on delete cascade,
  slide_index int not null,
  slide_label text,
  dwell_ms    bigint not null default 0,
  primary key (view_id, slide_index)
);

-- ---------------------------------------------------------------------------
-- App settings (webhook for "klienten har åpnet pitchen"-varsel).
-- ---------------------------------------------------------------------------
create table if not exists app_settings (
  key   text primary key,
  value text
);

insert into app_settings (key, value) values ('open_webhook_url', '')
  on conflict (key) do nothing;

-- ============================================================================
-- Row level security
-- ============================================================================
alter table profiles         enable row level security;
alter table pitches          enable row level security;
alter table shared_data      enable row level security;
alter table assets           enable row level security;
alter table pitch_views      enable row level security;
alter table pitch_slide_time enable row level security;
alter table app_settings     enable row level security;

-- Innlogget team: full tilgang til pitcher, delt data og bilder.
drop policy if exists "team read profiles" on profiles;
create policy "team read profiles" on profiles for select to authenticated using (true);
drop policy if exists "own profile update" on profiles;
create policy "own profile update" on profiles for update to authenticated using (id = auth.uid());

drop policy if exists "team all pitches" on pitches;
create policy "team all pitches" on pitches for all to authenticated using (true) with check (true);

drop policy if exists "team all shared" on shared_data;
create policy "team all shared" on shared_data for all to authenticated using (true) with check (true);

drop policy if exists "team all assets" on assets;
create policy "team all assets" on assets for all to authenticated using (true) with check (true);

drop policy if exists "team read views" on pitch_views;
create policy "team read views" on pitch_views for select to authenticated using (true);
drop policy if exists "team read slide time" on pitch_slide_time;
create policy "team read slide time" on pitch_slide_time for select to authenticated using (true);

drop policy if exists "team settings" on app_settings;
create policy "team settings" on app_settings for all to authenticated using (true) with check (true);

-- Anonyme klienter får INGEN direkte tabelltilgang. All visning og sporing
-- går gjennom funksjonene under, som sjekker passordet server-side.

-- ============================================================================
-- Klientvisning: passord per pitch
-- ============================================================================

-- Sett/fjern passord (kun innlogget).
create or replace function set_pitch_password(p_id text, p_password text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'ikke innlogget'; end if;
  update pitches
     set view_password = case
           when p_password is null or p_password = '' then null
           else crypt(p_password, gen_salt('bf'))
         end,
         updated_at = now()
   where id = p_id;
end $$;

-- Har pitchen passord? (trygt å spørre anonymt — avslører ikke passordet)
create or replace function pitch_gate(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select client, title, view_password is not null as needs_password, expires_at
    into r from pitches where slug = p_slug;
  if not found then return jsonb_build_object('found', false); end if;
  if r.expires_at is not null and r.expires_at < now() then
    return jsonb_build_object('found', true, 'expired', true);
  end if;
  return jsonb_build_object(
    'found', true, 'expired', false,
    'client', r.client, 'title', r.title,
    'needs_password', r.needs_password);
end $$;

-- Hele pitchen, kun med riktig passord. Returnerer også delt data,
-- slik at klientsiden kan rendre tall, logoer og priser uten innlogging.
create or replace function pitch_public(p_slug text, p_password text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; shared jsonb;
begin
  select * into r from pitches where slug = p_slug;
  if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
  if r.expires_at is not null and r.expires_at < now() then
    return jsonb_build_object('ok', false, 'error', 'expired');
  end if;
  if r.view_password is not null then
    if p_password is null or crypt(p_password, r.view_password) <> r.view_password then
      return jsonb_build_object('ok', false, 'error', 'bad_password');
    end if;
  end if;

  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into shared
    from shared_data
   where key in ('facts','pricing','brands','senders','library','templates','cases','imageCats','images');

  return jsonb_build_object(
    'ok', true,
    'pitch', jsonb_build_object('id', r.id, 'slug', r.slug, 'client', r.client,
                                'title', r.title, 'status', r.status) || r.data,
    'shared', shared,
    'assets', (select coalesce(jsonb_object_agg(id, path), '{}'::jsonb) from assets));
end $$;

-- ============================================================================
-- Sporing (anonymt tillatt, men bare gjennom disse funksjonene)
-- ============================================================================
create or replace function track_open(p_slug text, p_session text,
                                     p_ua text default null, p_ref text default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; p_id text;
begin
  select id into p_id from pitches where slug = p_slug;
  if p_id is null then return null; end if;

  select id into v_id from pitch_views
   where slug = p_slug and session_id = p_session
     and opened_at > now() - interval '4 hours'
   order by opened_at desc limit 1;

  if v_id is null then
    insert into pitch_views (pitch_id, slug, session_id, user_agent, referrer)
    values (p_id, p_slug, p_session, p_ua, p_ref)
    returning id into v_id;
  else
    update pitch_views set last_seen = now() where id = v_id;
  end if;
  return v_id;
end $$;

create or replace function track_progress(p_view uuid, p_slide int, p_label text,
                                          p_dwell_ms bigint, p_max_scroll int)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_view is null then return; end if;

  insert into pitch_slide_time (view_id, slide_index, slide_label, dwell_ms)
  values (p_view, p_slide, p_label, greatest(p_dwell_ms, 0))
  on conflict (view_id, slide_index)
    do update set dwell_ms = pitch_slide_time.dwell_ms + greatest(excluded.dwell_ms, 0),
                  slide_label = coalesce(excluded.slide_label, pitch_slide_time.slide_label);

  update pitch_views v
     set max_scroll  = greatest(v.max_scroll, coalesce(p_max_scroll, 0)),
         last_seen   = now(),
         total_ms    = v.total_ms + greatest(coalesce(p_dwell_ms, 0), 0),
         slides_seen = (select count(*) from pitch_slide_time t where t.view_id = v.id)
   where v.id = p_view;
end $$;

grant execute on function pitch_gate(text)                                to anon, authenticated;
grant execute on function pitch_public(text, text)                        to anon, authenticated;
grant execute on function track_open(text, text, text, text)              to anon, authenticated;
grant execute on function track_progress(uuid, int, text, bigint, int)    to anon, authenticated;
grant execute on function set_pitch_password(text, text)                  to authenticated;

-- ============================================================================
-- Varsel når en klient åpner pitchen.
-- Krever pg_net (Database → Extensions → pg_net) og en webhook-URL lagret i
-- app_settings.open_webhook_url (Slack incoming webhook fungerer rett ut av boksen).
-- ============================================================================
create extension if not exists pg_net;

create or replace function notify_pitch_open() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare hook text; label text;
begin
  select value into hook from app_settings where key = 'open_webhook_url';
  if hook is null or hook = '' then return new; end if;

  select coalesce(client, slug) into label from pitches where id = new.pitch_id;

  perform net.http_post(
    url     := hook,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body    := jsonb_build_object('text', label || ' åpnet pitchen nå (' ||
                                          coalesce(new.referrer, 'direkte') || ')'));
  return new;
end $$;

drop trigger if exists on_pitch_view on pitch_views;
create trigger on_pitch_view
  after insert on pitch_views for each row execute function notify_pitch_open();

-- ============================================================================
-- Storage: bildebiblioteket. Offentlig lesing (klientsidene må vise bildene),
-- skriving kun for innlogget team.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('pitch-assets', 'pitch-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "public read assets" on storage.objects;
create policy "public read assets" on storage.objects
  for select using (bucket_id = 'pitch-assets');

drop policy if exists "team write assets" on storage.objects;
create policy "team write assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'pitch-assets');

drop policy if exists "team update assets" on storage.objects;
create policy "team update assets" on storage.objects
  for update to authenticated using (bucket_id = 'pitch-assets');

drop policy if exists "team delete assets" on storage.objects;
create policy "team delete assets" on storage.objects
  for delete to authenticated using (bucket_id = 'pitch-assets');
