-- ============================================================================
-- Sikkerhetsfiks 2026-09-21: klientlenker leverte ut hele fellesbasen
--
-- FUNN
-- pitch_public returnerte *alle* rader i shared_data (library, templates,
-- imageCats, images, pricing, cases, facts, brands, senders) og *hele*
-- assets-tabellen (id -> path for samtlige 99 filer) til enhver som åpnet
-- én klientlenke. Ingen innlogging, ingen passord.
--
-- Tabell-RLS var og er riktig: anonym direkte lesing av pitches, shared_data,
-- assets, profiles, app_settings og pitch_views gir 0 rader. Hullet lå i denne
-- SECURITY DEFINER-funksjonen, som med vilje omgår RLS.
--
-- FIKS — lever bare det klientvisningen faktisk rendrer:
--   facts, pricing, brands, senders, cases   beholdt   (leses av PitchSlide)
--   library                                  filtrert  (kun typene pitchen bruker)
--   templates, imageCats, images             fjernet   (ren redigeringsdata)
--   assets                                   filtrert  (kun filer pitchen peker på)
--
-- VERIFISERT mot alle seks levende deck før utrulling:
--   nyttelast 119-128 kB -> 15-24 kB, assets 99 -> 20-42,
--   null manglende bildereferanser, null slidetyper som bare fantes i db-biblioteket.
-- ============================================================================

create or replace function pitch_public(p_slug text, p_password text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; shared jsonb; lib jsonb; doc text;
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
   where key in ('facts','pricing','brands','senders','cases');

  /* Biblioteket: bare definisjonene for slidetypene denne pitchen bruker.
     libAll() i system-data.js faller tilbake til seedLibrary() når lista er
     tom, så et deck som bare bruker standardslides får dem derfra som før. */
  select coalesce(jsonb_agg(e), '[]'::jsonb) into lib
    from jsonb_array_elements(
           coalesce((select value from shared_data where key = 'library'), '[]'::jsonb)) e
   where e->>'type' in (
           select distinct b->>'type'
             from jsonb_array_elements(coalesce(r.data->'blocks', '[]'::jsonb)) b);

  shared := shared || jsonb_build_object('library', lib);

  /* assets: bare filene pitchen eller det delte innholdet nevner.
     id-ene er korte og unike, så et treff i teksten er en ekte referanse. */
  doc := coalesce(r.data::text, '') || coalesce(shared::text, '');

  return jsonb_build_object(
    'ok', true,
    'pitch', jsonb_build_object('id', r.id, 'slug', r.slug, 'client', r.client,
                                'title', r.title, 'status', r.status) || r.data,
    'shared', shared,
    'assets', (select coalesce(jsonb_object_agg(id, path), '{}'::jsonb)
                 from assets where position(id in doc) > 0));
end $$;

grant execute on function pitch_public(text, text) to anon, authenticated;
