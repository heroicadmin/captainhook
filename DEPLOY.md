# Sette Pitch Studio på eget domene

Appen er statiske filer pluss Supabase. Ingen server å drifte, ingen byggesteg —
last filene opp et sted som serverer statiske filer, og pek domenet dit.

## 1. Legg filene i repoet

Repoet `heroicadmin/captainhook` er tomt i dag. Last ned prosjektet herfra og
push innholdet til `main`. Disse må med:

    index.html
    Skagerrak Pitch Studio.dc.html
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

Legg til domenet i hostingpanelet (f.eks. `pitch.skagerrak.tech`) og opprett
CNAME-en de oppgir hos domeneleverandøren. Sertifikatet ordner de selv.

## 4. Si det til Supabase

Supabase → Authentication → URL Configuration:

- **Site URL:** `https://pitch.dittdomene.no`
- **Redirect URLs:** legg til `https://pitch.dittdomene.no/**`

Uten dette virker ikke passordtilbakestilling og e-postlenker fra det nye domenet.

## 5. Lenkene

- Selgerne: `https://pitch.dittdomene.no/` → arkivet, logg inn med egen konto.
- Klienten: `https://pitch.dittdomene.no/#/p/<slug>` → passordporten, deretter pitchen.
- Oppsett og flytting: `https://pitch.dittdomene.no/Sky-oppsett.dc.html`

`index.html` tar vare på ruten, så klientlenkene trenger ikke filnavnet.

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
