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

## Bildeutfylling følger PITCHENS selskap

`applyImageProfile` for en åpen pitch bruker `pitchImages`, scoped til pitchens eget
selskap (`pitch.company`, med avsenderens domene som reserve) — ikke den innloggedes
`myImages`. Samme regel som prismodellen. Før fylte en superadmin med «Alt» valgt en
Skagerrak-pitch fra sitt eget domene: 6 brukbare Malta-bilder på 11 flater.

`myImages` er fortsatt riktig når en NY pitch lages, siden den da tilhører den som lager den.

## allAssets() er et enkeltpunktsfeil — den må ikke svelge feil

`state.assets` (id → offentlig URL) er ENESTE måte «asset:<id>» blir en URL for en
innlogget bruker. Klientlenken bruker en annen sti (`pitch_public`-RPC-en leverer sine egne
assets), så et brudd her rammer bare admin og redigering — pitchen ser fin ut utenfra
mens galleriet er svart.

Feiler oppslaget, gir `cssUrl()` «none», og da står bare den mørke flisbakgrunnen igjen:
**alle bilder ser svarte ut**. Funksjonen svelget før alle feil og returnerte `{}`, så en 401
på en token som ikke var klar ga et permanent svart galleri uten et eneste spor. Nå: tre
forsøk med økende pause, feilen bobler opp, og et «Bilder mangler»-banner med «Prøv igjen»
vises i toppfeltet.

## Miniatyrer: ikke render sliden i fast bredde og skaler den ned

Kortet på forsiden og miniatyren i slidebiblioteket rendret PitchSlide i faste `1180px` og
skalerte den med `transform:scale(var(--s))`, der `--s` ble satt fra JS
(`clientWidth / 1180`) og holdt oppdatert av en ResizeObserver.

Det var både unødvendig og skjørt:
- **Unødvendig**, fordi PitchSlide er helt container-relativ (cqw hele veien) og skalerer seg
  selv. Fullskjerm-forhåndsvisningene i admin har alltid rendret den på `width:100%` uten
  transform. Målt på en slide i kortstørrelse (372×209) ligger alt innenfor.
- **Skjørt**, fordi `clientWidth` leses før rutenettet har satt seg. Faller den tilbake på
  `300`, eller leser bredden på en hel rad, blir `--s` for stor — sliden zoomes inn og
  logoen skyves ut av kortet.

Begge miniatyrene rendrer nå PitchSlide på `position:absolute;inset:0` i en 16/9-boks.
`thumbRef`, `libThumbRef`, `--s` og ResizeObserveren er borte.

Merk: `hint-size` er BARE en skjelett-hint under strømming (`minWidth`/`minHeight` på
placeholderen), ikke rendringsstørrelsen. `hint-size="1180px,664px"` ga derfor et skjelett
som selv var 1180 px bredt inne i et 300 px kort.

## Forhåndsvisningen ble krympet av flex, ikke av avrunding

Redigeringsvisningens forhåndsvisning er et flex-element i en kolonne
(`display:flex;flex-direction:column` med `overflow-y:auto`). Et flex-element kan krympes
under sin naturlige høyde, og da klipper `overflow:hidden` nederkanten av sliden — på hver
slide, «litt» nederst. Reprodusert med kolonnestrukturen: **74,75 px krympet, 74,75 px
klippet**. Med `flex:none`: 0 og 0.

Boksen har også fått `aspect-ratio:16/9`, så høyden er definert av boksen selv i stedet for
å bli utledet av barnet. Samme grep på de to fullskjerm-forhåndsvisningene i admin.

**Feilspor verdt å huske:** jeg trodde først det var avrunding — at boksens høyde ble utledet
fra barnets `aspect-ratio` og rundet ned med `overflow:hidden`. Målt før/etter var det
0 px i BEGGE, altså ingen forskjell. Sub-piksel-avrunding er ikke årsaken her; flex-krymping er.
Klientvisningen (`[data-page]`) er ikke rammet — den er ikke et flex-element, og målt passer
sliden eksakt (`stikkerUnder: 0`).

