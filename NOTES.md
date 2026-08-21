# Verdt å vite før du endrer noe

Kortversjonen av fellene i dette prosjektet. Alt her er ting som ser riktig ut i
grensesnittet, men som svikter stille.

## 1. SHARED_KEYS er lagringsfilteret ⚠️

`cloud-store.js` har en liste, `SHARED_KEYS`. **Bare nøkler som står i den listen
blir skrevet til databasen.** En ny nøkkel som mangler der lagres aldri — uten
feilmelding. Endringen ser riktig ut, og er borte ved neste innlasting.

Legger du til noe nytt på toppnivå i store-objektet: **før det opp i SHARED_KEYS.**

Dette var årsaken til at «slett bilde» ikke virket: gravsteinene (`imagesRemoved`)
og versjonstallet (`imagesVersion`) ble aldri lagret, så re-seedingen ved
innlasting la standardbildene tilbake hver gang.

## 2. Slett-knapper bruker ikke `confirm()`

Nettleseren kan slå av dialoger etter noen visninger («hindre flere dialoger»).
Da returnerer `confirm()` false, og en sletting som ligger bak den dør stille.
Bildesletting bruker derfor to-trinns bekreftelse i selve kortet
(× → rød «Slett?» → klikk igjen). Gjør det samme for nye destruktive knapper.

Pass også på `findIndex`: returnerer den `-1`, sletter `splice(-1, 1)` **siste**
element i listen — altså feil rad. Sjekk `if (i < 0) return;` først.

## 3. Lagringsfeil skal være synlige

`cloud.err` vises som «Ikke lagret» i topplinja. Den fantes i view-modellen i lang
tid uten å bli rendret noe sted, og da var en feilende skriving helt usynlig.
Ikke fjern den.

## 4. Eierskap per selskap (e-postdomene)

Merkevarer, bildemapper, avsendere, caser, slides i biblioteket og prismodellen
eies av et selskap, avgjort av brukerens e-postdomene (`skagerrak.tech`,
`heroic.gg`). Tomt eierfelt = åpent for alle. Eierskap redigeres i tannhjulet
(⚙, kun superadmin), som viser alt uavhengig av filteret.

**Regelen som må bevares:** en pitch vises alltid med **sitt eget** selskaps
prismodell, utledet av avsenderen på pitchen — aldri av den som ser på. Ellers
ville en kunde som åpner en pitch kunne se et annet selskaps priser.

## 5. Filendelse sier ingenting om gjennomsiktighet

Mange av fotoene her er `.png`. Bruk derfor logomappen (`isLogoCat`) — ikke
filendelsen — når noe skal behandles som en logo.

## 6. Caching

`nginx.conf` sender `no-cache` på html/css/js (aldri `immutable` — det låste
gamle versjoner i en uke). JS-modulene lastes via `window.__modURL`, som legger
på en versjonsstreng. Skal en JS-endring tvinge seg gjennom hos noen som
allerede har en gammel kopi, bump `?b=N` i `__modURL`.

`PitchSlide.dc.html` lastes som ext-resource og treffes **ikke** av den
cache-bustingen — den lokale utviklingsserveren kan derfor vise en gammel
komponent. Sjekk PitchSlide-endringer i produksjon eller i en ny fane.

## 7. Tekst-plassholdere

Tekstfelter kan inneholde `%avsender%` og `%brand%` (aliaser: `%sender%`,
`%merkevare%`). De byttes ut ved rendering, så det lagrede innholdet beholder
plassholderen og følger med om avsender eller merkevare endres. `%brand%` løses
mot **slidens egen** merkevare.

## 8. Deploy

Push til `main` i `heroicadmin/captainhook` → Railway bygger automatisk.
Ikke stol på at Railway melder `SUCCESS` — det kan være forrige bygg. Verifiser
mot den live filen:

    curl -s https://pitch.limitbreak.no/ | grep <ny streng>
