-- ============================================================================
-- Sikkerhetsfiks fase 3, 2026-09-24 — punkt 2 og 4 i gjennomgangen
--
-- Fullt skille mellom Heroic og Skagerrak. Før kunne enhver innlogget bruker i
-- begge selskapene lese OG skrive det andres priser, maler, avsendere og
-- bilder, slette det andres filer og lese Slack-webhooken. Malene ble filtrert
-- i frontend; radsikkerheten slapp alt gjennom.
--
--   shared_data   én rad per (selskap, nøkkel), fordelt etter eierskap:
--                 avsendere/merkevarer etter domene, maler og slides etter
--                 eiermerke (Malta-malen er Heroics avtale), bilder etter
--                 kategori OG etter bruk, priser fra pricingByDomain, fakta og
--                 caser til Skagerrak (Heroics deck bruker ingen av dem)
--   assets        eies av selskapene som bruker filen
--   filer         endring/sletting bare egne; lesing forblir offentlig
--   app_settings  bare superadmin
--   profiles      bare eget selskap
--   sporing       bare for egne pitcher
--   pitch_public  leser delt data fra pitchens eget selskap
--
-- Bildene fordeles også etter bruk fordi appen «rydder» bort enhver
-- bildereferanse som ikke finnes i selskapets galleri (pruneImages) — DNB-decket
-- bruker fire av Heroics Malta-bilder og ville ellers mistet dem. Fordelingen er
-- testet ved å kjøre appens egen oppstartsfletting på resultatet for begge
-- selskaper: byte-identisk, også alle pitcher.
--
-- Hele fila er én transaksjon: feiler noe, skjer ingenting.
-- Kjøres ETTER at den nye klienten er ute (den tåler begge skjemaene).
-- Lukk editorfaner før du kjører, last dem på nytt etterpå.
-- Angre: 2026-09-24-fase3-skille-per-selskap-ANGRE.sql
-- ============================================================================

begin;

do $$ begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'shared_data' and column_name = 'company') then
    raise exception 'Fase 3 er allerede kjørt — shared_data har company-kolonnen.';
  end if;
end $$;

-- ── 1. fordel delt data per selskap (regnes ut FØR noe endres) ──────────────
create temp table fase3_del on commit drop as
with sd as (select key, value v from shared_data),
g as (select (select v from sd where key = k) v, k from unnest(array['senders','templates','library','catDomains','imageCats','catsNoFill','images','pricing','pricingByDomain','brands','facts','cases']) k),
cd as (select v from g where k = 'catDomains'),
co(c) as (values ('heroic.gg'), ('skagerrak.tech')),
tpl_c(c, v) as (select c, coalesce((select jsonb_agg(e) from jsonb_array_elements((select v from g where k='templates')) e
       where case when e->>'id' = 'malta' then c = 'heroic.gg' else coalesce(e->>'domain', c) = c end), '[]') from co),
lib_c(c, v) as (select c, coalesce((select jsonb_agg(e) from jsonb_array_elements((select v from g where k='library')) e
       where coalesce(e->>'domain', c) = c), '[]') from co),
/* alt et selskap viser, som tekst: bilder det nevner må ligge i galleriet, ellers
   rydder pruneImages() dem bort ved første innlasting */
bruk_c(c, t) as (select co.c, coalesce((select string_agg(p.data::text, ' ') from pitches p where lower(coalesce(p.company,'')) = co.c), '')
       || (select v::text from tpl_c where tpl_c.c = co.c) || (select v::text from lib_c where lib_c.c = co.c) from co),
bilder_c(c, v) as (select co.c, coalesce((select jsonb_agg(e) from jsonb_array_elements((select v from g where k='images')) e
       where coalesce((select v->>(e->>'cat') from cd), co.c) = co.c
          or position('"' || (e->>'src') || '"' in (select t from bruk_c where bruk_c.c = co.c)) > 0
          or position('"' || (e->>'id')  || '"' in (select t from bruk_c where bruk_c.c = co.c)) > 0), '[]') from co),
del(c, key, value) as (
  select c, 'senders', coalesce((select jsonb_agg(e) from jsonb_array_elements((select v from g where k='senders')) e
         where coalesce(e->>'domain', c) = c), '[]') from co
  union all
  select c, 'templates', v from tpl_c
  union all
  select c, 'library', v from lib_c
  union all
  select c, 'catDomains', coalesce((select jsonb_object_agg(kk, vv) from jsonb_each_text((select v from cd)) x(kk, vv) where vv = c), '{}') from co
  union all
  select c, 'imageCats', coalesce((select jsonb_agg(kat order by n) from (
      select kat.v kat, kat.n from jsonb_array_elements_text(coalesce((select v from g where k='imageCats'),'[]')) with ordinality kat(v, n)
       where coalesce((select v->>kat.v from cd), co.c) = co.c
          or exists (select 1 from jsonb_array_elements((select v from bilder_c where bilder_c.c = co.c)) b where b->>'cat' = kat.v)) x), '[]') from co
  union all
  select c, 'catsNoFill', coalesce((select jsonb_agg(x) from jsonb_array_elements_text((select v from g where k='catsNoFill')) x
         where coalesce((select v->>x from cd), c) = c), '[]') from co
  union all
  select c, 'images', v from bilder_c
  union all
  select c, 'pricing', coalesce((select v->c from g where k='pricingByDomain'), (select v from g where k='pricing')) from co
  union all
  select c, 'pricingByDomain', jsonb_build_object(c, coalesce((select v->c from g where k='pricingByDomain'), (select v from g where k='pricing'))) from co
  union all
  select c, 'brands', coalesce((select jsonb_object_agg(kk, vv) from jsonb_each((select v from g where k='brands')) x(kk, vv)
         where coalesce(vv->>'domain', c) = c), '{}') from co
  union all
  /* faktaene og casene er Skagerraks produktdata — Heroics deck bruker ingen av dem */
  select c, 'facts', case when c = 'skagerrak.tech' then (select v from g where k='facts') else '{}'::jsonb end from co
  union all
  select c, 'cases', case when c = 'skagerrak.tech' then (select v from g where k='cases') else '[]'::jsonb end from co
  union all
  /* styringsnøkler: kopieres uendret */
  select co.c, s.key, s.v from co, sd s where s.key in ('casesRemoved','casesVersion','imagesRemoved','imagesVersion','logoRefiled')
  union all
  select c, 'noFillStamp', to_jsonb(coalesce((select string_agg(x, '|' order by n) from jsonb_array_elements_text((select v from g where k='catsNoFill')) with ordinality y(x, n)
         where coalesce((select v->>x from cd), c) = c), '')) from co
  union all
  /* gravsteiner for slidetyper selskapet ikke eier: uten dem legger flettingen de
     innebygde slidetypene inn igjen ved hver innlasting */
  select c, 'libraryRemoved', coalesce((select jsonb_agg(e->>'type') from jsonb_array_elements((select v from g where k='library')) e
         where coalesce(e->>'domain', c) <> c), '[]') from co
)
select c, key, value from del;

-- ── 2. nytt format ──────────────────────────────────────────────────────────
alter table shared_data add column company text;
delete from shared_data;
alter table shared_data drop constraint shared_data_pkey;
alter table shared_data alter column company set not null;
alter table shared_data add primary key (company, key);
insert into shared_data (company, key, value, updated_at)
  select c, key, value, now() from fase3_del;

-- ── 3. filer: eies av selskapene som bruker dem ────────────────────────────
alter table assets add column companies text[] not null default '{}';
update assets a set companies = array(
  select co.c from (values ('heroic.gg'), ('skagerrak.tech')) co(c)
   where exists (select 1 from shared_data s where s.company = co.c and position(a.id in s.value::text) > 0)
      or exists (select 1 from pitches p where lower(coalesce(p.company, '')) = co.c and position(a.id in p.data::text) > 0)
   order by co.c);
/* filer ingen bruker: til opplasterens selskap */
update assets a set companies = array[coalesce(nullif(lower(split_part(
    (select email from profiles where id = a.created_by), '@', 2)), ''), 'heroic.gg')]
  where companies = '{}';

-- ── radsikkerhet: hvert selskap ser og skriver bare sitt eget ──────────────
drop policy if exists "team all shared" on shared_data;
drop policy if exists "company shared" on shared_data;
create policy "company shared" on shared_data for all to authenticated
  using (public.is_superadmin() or company = public.my_domain())
  with check (public.is_superadmin() or company = public.my_domain());

drop policy if exists "team all assets" on assets;
drop policy if exists "company assets" on assets;
create policy "company assets" on assets for all to authenticated
  using (public.is_superadmin() or public.my_domain() = any(companies))
  with check (public.is_superadmin() or public.my_domain() = any(companies));

/* nye filer tilhører selskapet til den som laster opp, med mindre klienten sier
   noe annet (en superadmin i «Se som» sender det valgte selskapet) */
create or replace function public.asset_default_company() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.companies is null or new.companies = '{}' then new.companies := array[public.my_domain()]; end if;
  return new;
end $$;
drop trigger if exists asset_company on assets;
create trigger asset_company before insert on assets for each row execute function public.asset_default_company();

/* lesing av filer må være offentlig — kundelenkene viser dem uten innlogging.
   Endring og sletting kun for filer selskapet eier. Underspørringen mot assets går
   gjennom radsikkerheten over, så den finner bare egne filer. */
drop policy if exists "team update assets" on storage.objects;
drop policy if exists "company update assets" on storage.objects;
create policy "company update assets" on storage.objects for update to authenticated
  using (bucket_id = 'pitch-assets' and (public.is_superadmin()
         or exists (select 1 from public.assets a where a.path = storage.objects.name)));
drop policy if exists "team delete assets" on storage.objects;
drop policy if exists "company delete assets" on storage.objects;
create policy "company delete assets" on storage.objects for delete to authenticated
  using (bucket_id = 'pitch-assets' and (public.is_superadmin()
         or exists (select 1 from public.assets a where a.path = storage.objects.name)));

/* Slack-webhooken: bare superadmin. Varslingen leser den via en security
   definer-trigger og påvirkes ikke. */
drop policy if exists "team settings" on app_settings;
drop policy if exists "superadmin settings" on app_settings;
create policy "superadmin settings" on app_settings for all to authenticated
  using (public.is_superadmin()) with check (public.is_superadmin());

drop policy if exists "team read profiles" on profiles;
drop policy if exists "company read profiles" on profiles;
create policy "company read profiles" on profiles for select to authenticated
  using (public.is_superadmin() or id = auth.uid() or lower(split_part(email, '@', 2)) = public.my_domain());

/* sporing: bare for pitcher du selv kan se — pitches-radsikkerheten gjør resten */
drop policy if exists "team read views" on pitch_views;
drop policy if exists "company read views" on pitch_views;
create policy "company read views" on pitch_views for select to authenticated
  using (exists (select 1 from public.pitches p where p.id = pitch_views.pitch_id));
drop policy if exists "team read slide time" on pitch_slide_time;
drop policy if exists "company read slide time" on pitch_slide_time;
create policy "company read slide time" on pitch_slide_time for select to authenticated
  using (exists (select 1 from public.pitch_views v where v.id = pitch_slide_time.view_id));

-- ── 4. kundelenken leser fra pitchens eget selskap ─────────────────────────
create or replace function pitch_public(p_slug text, p_password text default null)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  r record; doc text; snd jsonb; need_pricing boolean;
  s_senders jsonb; s_pricing jsonb; s_facts jsonb; s_brands jsonb;
  s_library jsonb; s_images jsonb; shared jsonb;
begin
  /* delt data leses fra pitchens eget selskap (fase 3) — funksjonen er security
     definer og går utenom radsikkerheten, så filteret MÅ stå her */
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

  /* avsender: samme valg som senderOf() i klienten */
  select coalesce(
    (select e from jsonb_array_elements(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'senders'), '[]'::jsonb)) e
      where e->>'id' = r.data->'meta'->>'sender' limit 1),
    (select e from jsonb_array_elements(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'senders'), '[]'::jsonb)) e limit 1))
  into snd;
  s_senders := case when snd is null then '[]'::jsonb else jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
    'id', snd->'id', 'name', snd->'name', 'logo', snd->'logo', 'tint', snd->'tint',
    'email', snd->'email', 'phone', snd->'phone', 'contact', snd->'contact',
    'closingImg', snd->'closingImg', 'closingLabel', snd->'closingLabel', 'domain', snd->'domain'))) end;

  need_pricing := exists (select 1 from jsonb_array_elements(coalesce(r.data->'blocks', '[]'::jsonb)) b
    where b->>'type' in ('tiers','configurator','adrates') or b->>'base' in ('tiers','configurator','adrates'));
  if need_pricing then
    s_pricing := coalesce(
      (select value->lower(coalesce(r.company, '')) from shared_data where company = lower(coalesce(r.company, '')) and key = 'pricingByDomain'),
      (select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'pricing'), '{}'::jsonb);
    if jsonb_typeof(s_pricing->'addons') = 'array' then
      s_pricing := jsonb_set(s_pricing, '{addons}',
        coalesce((select jsonb_agg(a - 'provisional') from jsonb_array_elements(s_pricing->'addons') a), '[]'::jsonb));
    end if;
  end if;

  /* alt fakta, merkevarer og bilder filtreres mot, i ett dokument */
  doc := r.data::text || s_senders::text || coalesce(s_pricing::text, '');

  select coalesce(jsonb_object_agg(f.key, f.value - 'history'), '{}'::jsonb) into s_facts
    from jsonb_each(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'facts'), '{}'::jsonb)) f
   where position('"' || f.key || '"' in doc) > 0;

  select coalesce(jsonb_object_agg(b.key, b.value), '{}'::jsonb) into s_brands
    from jsonb_each(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'brands'), '{}'::jsonb)) b
   where position('"' || b.key || '"' in doc) > 0;

  select coalesce(jsonb_agg(e), '[]'::jsonb) into s_library
    from jsonb_array_elements(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'library'), '[]'::jsonb)) e
   where e->>'type' in (select distinct b->>'type' from jsonb_array_elements(coalesce(r.data->'blocks', '[]'::jsonb)) b);

  select coalesce(jsonb_agg(e), '[]'::jsonb) into s_images
    from jsonb_array_elements(coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'images'), '[]'::jsonb)) e
   where position('"' || (e->>'id') || '"' in doc) > 0;

  shared := jsonb_build_object('facts', s_facts, 'brands', s_brands, 'senders', s_senders,
                               'library', s_library, 'images', s_images);
  if need_pricing then
    shared := shared || jsonb_build_object('pricing', s_pricing,
      'cases', coalesce((select value from shared_data where company = lower(coalesce(r.company, '')) and key = 'cases'), '[]'::jsonb));
  end if;

  doc := doc || shared::text;
  return jsonb_build_object(
    'ok', true,
    'pitch', jsonb_build_object('id', r.id, 'slug', r.slug, 'client', r.client,
                                'title', r.title, 'status', r.status) || r.data,
    'shared', shared,
    'assets', (select coalesce(jsonb_object_agg(id, path), '{}'::jsonb)
                 from assets where position(id in doc) > 0));
end $$;

grant execute on function pitch_public(text, text) to anon, authenticated;

commit;

-- ── kontroll ─────────────────────────────────────────────────────────────────
select company, count(*) as nokler,
       (select jsonb_array_length(value) from shared_data s2 where s2.company = s.company and key = 'templates') as maler,
       (select jsonb_array_length(value) from shared_data s2 where s2.company = s.company and key = 'images') as bilder,
       (select string_agg(e->>'id', ',') from shared_data s2, jsonb_array_elements(value) e where s2.company = s.company and key = 'senders') as avsendere
  from shared_data s group by company order by company;
