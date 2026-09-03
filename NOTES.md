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

## Navneendring på pitcher endrer ikke adressen

«Endre navn» i arkivkortet skriver bare `meta.client`. `meta.slug` blir stående med vilje:
slugen ER klientlenken (`#/p/<slug>`, og `pitch_gate(slug)` i basen), så en endring der
bryter lenker som alt er sendt ut. Slugen redigeres separat i editoren, der det er et
bevisst valg. Navnefeltet ligger i kortet, ikke i en `prompt()` — se punktet om
dialogundertrykking over.

## Templates eies av et selskap

Hver oppføring i `store.templates` kan ha `domain`. Tom = felles. `tplOwned` filtrerer både
templatevalget i «Ny pitch» og listen i admin; superadmin uten «se som» ser alle. Valget i
«Ny pitch» faller tilbake til første synlige template hvis det lagrede valget ikke er synlig
— ellers ville «Opprett» bygget fra en template brukeren ikke har tilgang til.

En template kan bære sitt EGET innhold, ikke bare blokktyper: en rad kan være
`{ type, title, data, img, layout, caseId }`, og `makePitchFromTemplate` legger `data` oppå
bibliotekets standard. Malta-templaten og DNB-løpet gjør dette. Nye templates må legges i
`BUILTIN_TEMPLATES` hvis de skal tilbakestilles til koden ved versjonsbump; de plukkes opp
uansett av seedingen som legger til templates med ukjent id.

## Native dialoger er forbudt i knapper som gjør noe

Chrome slutter å vise `prompt`/`confirm`/`alert` etter noen dialoger i samme økt
(«prevent additional dialogs»). Etter det returnerer `confirm()` false og `prompt()` null,
og knappen gjør **ingenting, helt stille**. Det var halve årsaken til at slettknappen for
bilder ble meldt som ødelagt.

To felleshjelpere finnes nå på komponenten:

- `armDel(token, run, word)` — to-trinns sletting. Første klikk armerer, andre utfører.
  Returnerer `{ label, mark, bg, fg, border, on, armed }` til markupen. Armeringen er én
  tilstand (`state.armed`) for hele appen, så to knapper aldri står armert samtidig.
- `nameField(token, run, initial)` — inline navnefelt. Enter lagrer, Escape avbryter, tomt
  navn lagrer ikke. Returnerer `{ open, closed, value, onOpen, onInput, onKey, onSave, onCancel }`.

Alle seks destruktive `confirm()` er borte (pitch, avsender, template, case, bibliotek-slide,
merkevare), og seks ettfelts-`prompt()` (ny mappe, ny avsender, ny template, nytt
template-navn, ny case, ny merkevare).

Beskjeder som lå i dialogene måtte flytte, ikke forsvinne: «finnes allerede» vises live under
navnefeltet, «er i bruk» står ved slettknappen, og minimum-én-regelen skjuler knappen i
stedet for å vise en alert.

**Fortsatt igjen** — tre `prompt()`-kjeder som trenger et skjema, ikke ett felt: nytt tall i
faktabasen (4 prompts), ny slide i biblioteket (3 prompts), og begrunnelse ved overstyring av
et faktatall (1 prompt, men midt i en annen flyt). `alert()` brukes ellers bare til
feilmeldinger og kvitteringer, der stille bortfall ikke ødelegger data.

## Hex-felt ved fargevelgerne

Alle seks `input[type=color]` har et hex-tekstfelt ved siden av, drevet av `hexField(token, value, apply)`
på komponenten. `apply` kalles gjennom den eksisterende skrivehandleren for hvert sted, så
ingen av skrivestiene er duplisert.

Det som må holdes i hodet: et tekstfelt gir verdien **tegn for tegn**. Derfor
- `strict` (nøyaktig seks siffer) brukes mens man taster,
- `loose` (godtar også kortform) brukes bare ved Enter og blur.

Utvidet man kortform per tegn, ville «FF8800» skrevet hvit farge på vei gjennom «FFF» — en
synlig blink og en unødvendig skriving til pitchen. Det ble fanget av
`scratchpad/hextest.mjs`, som klipper `hexField` ordrett ut av index.html og kjører 15 tilfeller.

