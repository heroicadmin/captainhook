-- Angrer fase 2: fjerner nøkkelhåndhevingen og gir de sju decka de gamle sluggene.
-- Passordrettelsen (search_path) står — den er en feilretting, ikke en del av nøklene.
drop trigger if exists pitch_slug_key on pitches;
drop function if exists ensure_slug_key();
drop function if exists slug_token(int);
update pitches set slug = '2026thon' where id = 'uz9zjeo' and slug = '2026thon-2q32fwtj2898a8ep4q68qmgn2j';
update pitches set slug = 'dnb' where id = 'ku1r4i8' and slug = 'dnb-kgs7i6b8qdi2rzreuwvqr8i6dp';
update pitches set slug = 'gamingmalta' where id = 'ct0ss89' and slug = 'gamingmalta-s7833iqaekxj9vc65hri933s7z';
update pitches set slug = 'gjensidige' where id = 'm1sq4t5' and slug = 'gjensidige-cffhtcntbkjsvn94rgusfxu9qq';
update pitches set slug = 'gjensidige-kopi' where id = 'k9rz5su' and slug = 'gjensidige-kopi-3yikrssq993ffsugcmsgqxfx2m';
update pitches set slug = 'ikea' where id = 'olz83sd' and slug = 'ikea-avwq35c7maidti4wbgtdtc2knf';
update pitches set slug = 'ikea-2' where id = 'nrx0pia' and slug = 'ikea-2-qaw255dtrub7d5q7cuirafp6wx';
update pitches set data = jsonb_set(jsonb_set(data, '{slug}', to_jsonb(slug)), '{meta,slug}', to_jsonb(slug)) where data ? 'meta';
update pitch_views set slug = '2026thon' where pitch_id = 'uz9zjeo';
update pitch_views set slug = 'dnb' where pitch_id = 'ku1r4i8';
update pitch_views set slug = 'gamingmalta' where pitch_id = 'ct0ss89';
update pitch_views set slug = 'gjensidige' where pitch_id = 'm1sq4t5';
update pitch_views set slug = 'gjensidige-kopi' where pitch_id = 'k9rz5su';
update pitch_views set slug = 'ikea' where pitch_id = 'olz83sd';
update pitch_views set slug = 'ikea-2' where pitch_id = 'nrx0pia';
