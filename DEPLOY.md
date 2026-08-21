# Sette Pitch Studio på eget domene

Appen er statiske filer pluss Supabase. Ingen server å drifte, ingen byggesteg —
last filene opp et sted som serverer statiske filer, og pek domenet dit.

## 1. Legg filene i repoet

Repoet `heroicadmin/captainhook` er tomt i dag. Last ned prosjektet herfra og
push innholdet til `main`. Disse må med:

    index.html                (selve appen — ligger på rota)
    Sky-oppsett.dc.html
    PitchSlide.dc.html
    support.js
    cloud-store.js
    supabase-config.js
    system-data.js  i18n.js  sheet-io.js
    ambient-field.js  bg-scenes.js  hex-ripple.js
    facts.json
    logos/  images/  assets/
    supabase/schema.sql   (kun referanse, kjøres i Supabase)

## 2. Publiser

**Cloudflare Pages** eller **Vercel** — begge kobles rett på repoet:

- Framework preset: **None / Other**
- Build command: **(tom)**
- Output directory: **/** (rota)

Første deploy tar under et minutt. Ny push publiserer automatisk.

## 3. Domenet

Domenet er satt opp: `pitch.limitbreak.no` (CNAME `pitch` → Railway, hos one.com).
For et nytt domene: legg det til i hostingpanelet og opprett
CNAME-en de oppgir hos domeneleverandøren. Sertifikatet ordner de selv.

## 4. Si det til Supabase

Supabase → Authentication → URL Configuration:

- **Site URL:** `https://pitch.limitbreak.no`
- **Redirect URLs:** legg til `https://pitch.limitbreak.no/**`

Uten dette virker ikke passordtilbakestilling og e-postlenker fra det nye domenet.

## 5. Lenkene

- Selgerne: `https://pitch.limitbreak.no/` → landingssiden (logg inn med egen konto).
  Arkivet/dashbordet ligger på `https://pitch.limitbreak.no/#/arkiv`.
- Klienten: `https://pitch.limitbreak.no/#/p/<slug>` → passordporten, deretter pitchen.
- Oppsett og flytting: `https://pitch.limitbreak.no/Sky-oppsett.dc.html`

Appen ligger på rota, så klientlenkene er rene: `https://pitch.limitbreak.no/#/p/<slug>`.

**Før du endrer koden: les `NOTES.md`.** Den samler fellene som svikter stille
(særlig `SHARED_KEYS` i `cloud-store.js` — en ny nøkkel som ikke står der lagres aldri).

## Verdt å vite

- `supabase-config.js` inneholder publishable-nøkkelen. Den er laget for å ligge
  i nettleseren; det er radsikkerheten i `schema.sql` som beskytter dataene.
  Secret-nøkkelen skal aldri inn i disse filene.
- Nye selgere: Supabase → Authentication → Users → Add user. Alle innloggede ser
  alle pitcher.
- Varsel når en klient åpner: legg Slack-webhooken i tabellen `app_settings`,
  rad `open_webhook_url`.
- Migreringen i Sky-oppsett kjøres bare fra maskinen der de gamle pitchene ligger
  lokalt. Etter at tallene stemmer i skyen kan nettleserlagringen tømmes.
