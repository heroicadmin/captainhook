-- ============================================================================
-- Sikkerhetsfiks fase 1, 2026-09-24 — punkt 5 i gjennomgangen
--
-- pitch_public sendte ut hele fellesbasen til enhver med en kundelenke:
-- alle maler, hele biblioteket, 78 bilder, prisliste med interne tillegg
-- (Maelstrom 350 000, FragTrial 95 000) og alle avsendere med e-post.
-- 130 kB for et deck som viser en brøkdel.
--
-- En innstramming ble kjørt 2026-09-21, men var tilbakestilt da dette ble
-- skrevet — noen har kjørt den opprinnelige definisjonen på nytt. Kjør
-- tools/leak-check.mjs etter enhver endring i databasen; den feiler hvis
-- dette skjer igjen.
--
-- Nå sendes bare det decket faktisk viser:
--   avsender   bare pitchens egen (meta.sender, ellers den første), bare
--              feltene kundesiden viser
--   fakta      bare nøklene decket refererer til, uten historikk
--   merkevarer bare de decket refererer til
--   bibliotek  bare slidetypene decket bruker
--   bilder     bare galleribildene decket (og avsenderen) peker på
--   priser     BARE hvis decket har tiers, configurator eller adrates — og
--              da selskapets egen prisliste, uten interne «provisional»-flagg
--   caser      bare sammen med priser (de brukes via prisnivåene)
--   maler      aldri — de er redigeringsdata
--   assets     bare filene som nevnes i det som sendes
--
-- Prøvekjørt mot gjensidige, dnb, 2026thon og ikea-2 før den ble skrevet:
-- én avsender, ingen priser, 10 fakta, 16–22 kB mot 130 kB.
-- ============================================================================

create or replace function pitch_public(p_slug text, p_password text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  r record; doc text; snd jsonb; need_pricing boolean;
  s_senders jsonb; s_pricing jsonb; s_facts jsonb; s_brands jsonb;
  s_library jsonb; s_images jsonb; shared jsonb;
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

  /* avsender: samme valg som senderOf() i klienten */
  select coalesce(
    (select e from jsonb_array_elements(coalesce((select value from shared_data where key = 'senders'), '[]'::jsonb)) e
      where e->>'id' = r.data->'meta'->>'sender' limit 1),
    (select e from jsonb_array_elements(coalesce((select value from shared_data where key = 'senders'), '[]'::jsonb)) e limit 1))
  into snd;
  s_senders := case when snd is null then '[]'::jsonb else jsonb_build_array(jsonb_strip_nulls(jsonb_build_object(
    'id', snd->'id', 'name', snd->'name', 'logo', snd->'logo', 'tint', snd->'tint',
    'email', snd->'email', 'phone', snd->'phone', 'contact', snd->'contact',
    'closingImg', snd->'closingImg', 'closingLabel', snd->'closingLabel', 'domain', snd->'domain'))) end;

  need_pricing := exists (select 1 from jsonb_array_elements(coalesce(r.data->'blocks', '[]'::jsonb)) b
    where b->>'type' in ('tiers','configurator','adrates') or b->>'base' in ('tiers','configurator','adrates'));
  if need_pricing then
    s_pricing := coalesce(
      (select value->lower(coalesce(r.company, '')) from shared_data where key = 'pricingByDomain'),
      (select value from shared_data where key = 'pricing'), '{}'::jsonb);
    if jsonb_typeof(s_pricing->'addons') = 'array' then
      s_pricing := jsonb_set(s_pricing, '{addons}',
        coalesce((select jsonb_agg(a - 'provisional') from jsonb_array_elements(s_pricing->'addons') a), '[]'::jsonb));
    end if;
  end if;

  /* alt fakta, merkevarer og bilder filtreres mot, i ett dokument */
  doc := r.data::text || s_senders::text || coalesce(s_pricing::text, '');

  select coalesce(jsonb_object_agg(f.key, f.value - 'history'), '{}'::jsonb) into s_facts
    from jsonb_each(coalesce((select value from shared_data where key = 'facts'), '{}'::jsonb)) f
   where position('"' || f.key || '"' in doc) > 0;

  select coalesce(jsonb_object_agg(b.key, b.value), '{}'::jsonb) into s_brands
    from jsonb_each(coalesce((select value from shared_data where key = 'brands'), '{}'::jsonb)) b
   where position('"' || b.key || '"' in doc) > 0;

  select coalesce(jsonb_agg(e), '[]'::jsonb) into s_library
    from jsonb_array_elements(coalesce((select value from shared_data where key = 'library'), '[]'::jsonb)) e
   where e->>'type' in (select distinct b->>'type' from jsonb_array_elements(coalesce(r.data->'blocks', '[]'::jsonb)) b);

  select coalesce(jsonb_agg(e), '[]'::jsonb) into s_images
    from jsonb_array_elements(coalesce((select value from shared_data where key = 'images'), '[]'::jsonb)) e
   where position('"' || (e->>'id') || '"' in doc) > 0;

  shared := jsonb_build_object('facts', s_facts, 'brands', s_brands, 'senders', s_senders,
                               'library', s_library, 'images', s_images);
  if need_pricing then
    shared := shared || jsonb_build_object('pricing', s_pricing,
      'cases', coalesce((select value from shared_data where key = 'cases'), '[]'::jsonb));
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

-- pitch_gate svarte med kundenavn og tittel for enhver slug, med eller uten
-- passord — et orakel som bekreftet at en gjettet lenke fantes, og for hvem.
-- Kundenavnet trengs bare på passordsiden («Pitch til X»), så det sendes nå
-- bare når pitchen faktisk har passord. Tittelen sendes aldri.
create or replace function pitch_gate(p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record;
begin
  select client, view_password is not null as needs_password, expires_at
    into r from pitches where slug = p_slug;
  if not found then return jsonb_build_object('found', false); end if;
  if r.expires_at is not null and r.expires_at < now() then
    return jsonb_build_object('found', true, 'expired', true);
  end if;
  return jsonb_build_object('found', true, 'expired', false, 'needs_password', r.needs_password)
      || case when r.needs_password then jsonb_build_object('client', r.client) else '{}'::jsonb end;
end $$;

grant execute on function pitch_gate(text) to anon, authenticated;

-- kontroll: skal vise gjensidige uten templates/pricing og med én avsender
select jsonb_object_keys(pitch_public('gjensidige')->'shared') as sendes_for_gjensidige;
