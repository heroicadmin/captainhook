-- ============================================================================
-- Sikkerhetsfiks fase 2, 2026-09-24 — punkt 3 i gjennomgangen
--
-- 1) PASSORD HAR ALDRI VIRKET. pgcrypto ligger i skjemaet «extensions», men
--    set_pitch_password og pitch_public hadde search_path = public. Der finnes
--    verken gen_salt() eller crypt(), så set_pitch_password har feilet hver
--    gang, og pitch_public ville feilet på enhver pitch med passord. Det er
--    grunnen til at ingen av de sju decka har passord. Rettet med search_path.
--
-- 2) NØKKEL I HVER LENKE. Alle sju decka får en 26 tegns kryptografisk
--    tilfeldig nøkkel (130 bit), laget med Pythons secrets-modul.
--    ALLE LENKER SOM ALT ER SENDT SLUTTER Å VIRKE. Se lista du fikk sammen
--    med denne fila.
--
-- 3) DATABASEN HÅNDHEVER NØKKELEN. En trigger på pitches sørger for at ingen
--    slug kommer inn uten nøkkel, uansett hvem som skriver. Og den nekter å
--    fjerne en: en editor som sto åpen fra før, ville ellers skrevet den gamle
--    korte sluggen tilbake ved neste autolagring. Mangler den nye verdien
--    nøkkel, men den gamle hadde en, beholdes den gamle.
--
-- Lukk alle åpne editorfaner FØR du kjører dette, og last dem på nytt etterpå.
-- Angre: 2026-09-24-fase2-lange-nokler-ANGRE.sql
-- ============================================================================

-- 1) passord
alter function set_pitch_password(text, text) set search_path = public, extensions;
alter function pitch_public(text, text)       set search_path = public, extensions;
alter function pitch_gate(text)               set search_path = public, extensions;

-- 2) nøkkelgenerator — samme alfabet som slugToken() i system-data.js
/* plpgsql, ikke sql: gen_random_bytes() i en FROM-delspørring ble målt til å gi
   SAMME verdi for 200 av 200 rader i én setning, og en sql-funksjon kan bli
   innebygd av planleggeren. Da ville alle pitcher oppdatert i samme setning fått
   samme nøkkel. Her kalles gen_random_bytes() én gang per kall, målt til 500 av
   500 unike. */
create or replace function slug_token(n int default 26)
returns text language plpgsql volatile set search_path = public, extensions as $$
declare b bytea := gen_random_bytes(n); ut text := '';
begin
  for i in 0 .. n - 1 loop
    ut := ut || substr('abcdefghijkmnpqrstuvwxyz23456789', (get_byte(b, i) % 32) + 1, 1);
  end loop;
  return ut;
end $$;

-- 3) håndhevingen
create or replace function ensure_slug_key() returns trigger
language plpgsql set search_path = public, extensions as $$
declare pat text := '-[abcdefghijkmnpqrstuvwxyz23456789]{26}$'; eks text;
begin
  if new.slug is null or new.slug !~ pat then
    /* Appen lagrer med upsert. Da kjører BEFORE INSERT før konflikten oppdages, med
       tg_op = 'INSERT' og uten old — så en editor som sto åpen med gammel slug ville
       fått en NY tilfeldig nøkkel her, og lenkene brukket likevel. Den eksisterende
       raden slås derfor opp på id i begge greiner, og en nøkkel den har beholdes. */
    if tg_op = 'UPDATE' then eks := old.slug;
    else select p.slug into eks from pitches p where p.id = new.id;
    end if;
    if eks ~ pat then
      new.slug := eks;                                        /* ikke fjern en nøkkel */
    else
      new.slug := coalesce(nullif(new.slug, ''), 'pitch') || '-' || slug_token();
    end if;
  end if;
  /* data bærer også sluggen; hold den i takt med kolonnen */
  new.data := jsonb_set(coalesce(new.data, '{}'::jsonb), '{slug}', to_jsonb(new.slug));
  if new.data ? 'meta' then
    new.data := jsonb_set(new.data, '{meta,slug}', to_jsonb(new.slug));
  end if;
  return new;
end $$;

drop trigger if exists pitch_slug_key on pitches;
create trigger pitch_slug_key before insert or update of slug on pitches
  for each row execute function ensure_slug_key();

-- 4) nye nøkler på de sju decka. Hver linje treffer bare hvis sluggen fortsatt
--    er den gamle, så en ny kjøring gjør ingenting.
update pitches set slug = '2026thon-2q32fwtj2898a8ep4q68qmgn2j' where id = 'uz9zjeo' and slug = '2026thon';
update pitches set slug = 'dnb-kgs7i6b8qdi2rzreuwvqr8i6dp' where id = 'ku1r4i8' and slug = 'dnb';
update pitches set slug = 'gamingmalta-s7833iqaekxj9vc65hri933s7z' where id = 'ct0ss89' and slug = 'gamingmalta';
update pitches set slug = 'gjensidige-cffhtcntbkjsvn94rgusfxu9qq' where id = 'm1sq4t5' and slug = 'gjensidige';
update pitches set slug = 'gjensidige-kopi-3yikrssq993ffsugcmsgqxfx2m' where id = 'k9rz5su' and slug = 'gjensidige-kopi';
update pitches set slug = 'ikea-avwq35c7maidti4wbgtdtc2knf' where id = 'olz83sd' and slug = 'ikea';
update pitches set slug = 'ikea-2-qaw255dtrub7d5q7cuirafp6wx' where id = 'nrx0pia' and slug = 'ikea-2';

-- 5) aktivitetsfeeden viser sluggen som tekst; statistikken bruker pitch_id
update pitch_views set slug = '2026thon-2q32fwtj2898a8ep4q68qmgn2j' where pitch_id = 'uz9zjeo';
update pitch_views set slug = 'dnb-kgs7i6b8qdi2rzreuwvqr8i6dp' where pitch_id = 'ku1r4i8';
update pitch_views set slug = 'gamingmalta-s7833iqaekxj9vc65hri933s7z' where pitch_id = 'ct0ss89';
update pitch_views set slug = 'gjensidige-cffhtcntbkjsvn94rgusfxu9qq' where pitch_id = 'm1sq4t5';
update pitch_views set slug = 'gjensidige-kopi-3yikrssq993ffsugcmsgqxfx2m' where pitch_id = 'k9rz5su';
update pitch_views set slug = 'ikea-avwq35c7maidti4wbgtdtc2knf' where pitch_id = 'olz83sd';
update pitch_views set slug = 'ikea-2-qaw255dtrub7d5q7cuirafp6wx' where pitch_id = 'nrx0pia';

-- kontroll: alle skal ha nøkkel, og data skal være i takt med kolonnen
select slug,
       slug ~ '-[abcdefghijkmnpqrstuvwxyz23456789]{26}$'           as har_nokkel,
       data->>'slug' = slug                as data_i_takt,
       data->'meta'->>'slug' = slug        as meta_i_takt
  from pitches order by slug;
