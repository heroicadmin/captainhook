/* Skagerrak Pitch System — delte datalag.
   facts · brand · library · templates · pricing · strings
   Ett sted for tall og struktur. Pitcher refererer hit, kopierer ikke. */

export const VERSION = { schema: 'skagerrak-pitch/1', facts: '2026-08', templates: 20, images: 3, cases: 2, updated: '2026-08-13' };

/* Ids som eies av koden. Brukerlagde templates røres aldri av migreringen. */
export const BUILTIN_TEMPLATES = ['master', 'simple', 'media', 'blank', 'malta', 'catalog'];

export const BRANDS = {
  gamer:     { name: 'Gamer.no',        color: '#F05A22', logo: 'logos/gamerno.png',        scale: 1, note: 'Optisk skala 1 · rekkevidde' },
  komplett:  { name: 'Komplettligaen',  color: '#FFB81C', logo: 'logos/komplettligaen.png', scale: 1, note: 'Aldri «Good Game Ligaen»' },
  bl:        { name: 'Bedriftsligaen',  color: '#E9376E', logo: 'logos/bedriftsligaen.png', scale: 1.45, note: 'Kvadratisk, må stå høyere' },
  arena:     { name: 'Good Game Arena', color: '#7C5CFF', logo: 'logos/ggligaen.png',       scale: 1, note: 'Plattformen bak ligaene' },
  maelstrom: { name: 'Maelstrom',       color: '#E8622A', logo: 'logos/maelstrom.png',      scale: 1, note: 'Wordmark er bilde, ikke Impact-tekst' },
  frag:      { name: 'FragTrial',       color: '#E0219C', logo: 'logos/fragtrial.png',      scale: 1, note: 'Leveres i Maelstrom' }
};

export const SKAGERRAK_LOGO = 'logos/skagerrak.png';

/* Avsender: hvem pitchen kommer fra. Ikke alltid Skagerrak. */
export const SENDERS = [
  { id:'skagerrak', name:'Skagerrak Technologies', logo:'logos/skagerrak.png',
    email:'sindre@heroic.gg', phone:'', contact:'skagerrak.tech' }
];

/* Kontaktlinja på avslutningssliden bygges av avsenderen — én kilde, ikke tekst per pitch. */
export const senderContact = sd =>
  [(sd||{}).email, (sd||{}).phone, (sd||{}).contact].filter(Boolean).join(' · ');

/* Bildebase. Kategorien styrer hvilke bilder en pitch fylles med. */
export const IMAGE_CATS = ['Generelt', 'Hardcore Esport', 'Casual Gaming', 'Malta', 'Logoer', 'Heroic Logoer', 'Heroic Generelt'];
/* Logoer hører til logoveggen, ikke til bildeflatene — de holdes utenfor bildeprofilene.
   Hvert selskap har sin egen logomappe (eierskap settes i Admin → Bilder); utad vises
   alle logomapper bare som «Logoer». */
export const LOGO_CAT = 'Logoer';
/* Kategorier som ikke skal fylle bildeflater i pitcher (logomapper). Redigeres i Admin → Bilder. */
export const NOFILL_CATS = [LOGO_CAT, 'Heroic Logoer'];
export const IMAGES = [
  { id:'img-ashes',    name:'Rise from the ashes',   cat:'Hardcore Esport', src:'images/heroic-ashes-banner.jpg' },
  { id:'img-jersey',   name:'Draktdetalj',           cat:'Hardcore Esport', src:'images/jersey-detalj.jpg' },
  { id:'img-stage',    name:'Spiller på scene',      cat:'Hardcore Esport', src:'images/spiller-scene.jpg' },
  { id:'img-team',     name:'Laggrafikk',            cat:'Generelt',        src:'images/lag-grafikk.jpg' },
  { id:'img-logo',     name:'Logo i gull',           cat:'Generelt',        src:'images/logo-gull.jpg' },
  { id:'img-portrait', name:'Portrett',              cat:'Generelt',        src:'images/portrett.jpg' },
  { id:'img-arena',    name:'Arena, isometrisk',     cat:'Casual Gaming',   src:'images/arena-isometrisk.jpg' },
  { id:'img-creator',  name:'Innholdsprodusent',     cat:'Casual Gaming',   src:'images/creator-thumbnail.jpg' },

  /* HEROIC × Malta — hentet ut av forslaget kunden sendte inn */
  { id:'mt-cover',      name:'Forside — scene',            cat:'Malta',  src:'images/malta/malta-cover-stage.jpg' },
  { id:'mt-celebration',name:'Lagjubel',                   cat:'Malta',  src:'images/malta/malta-team-celebration.jpg' },
  { id:'mt-audience',   name:'Publikumsdiagram — CS2',     cat:'Malta',  src:'images/malta/malta-audience-chart.png' },
  { id:'mt-lineup',     name:'Laget på scenen',            cat:'Malta',  src:'images/malta/malta-team-lineup.jpg' },
  { id:'mt-darkhorse',  name:'Dark horse to title contender', cat:'Malta', src:'images/malta/malta-darkhorse-card.jpg' },
  { id:'mt-crowd',      name:'Publikum',                   cat:'Malta',  src:'images/malta/malta-crowd.jpg' },
  { id:'mt-ambassadors',name:'Ambassadører',               cat:'Malta',  src:'images/malta/malta-ambassadors.png' },
  { id:'mt-proof',      name:'Proof of performance',       cat:'Malta',  src:'images/malta/malta-proof-of-performance.jpg' },
  { id:'mt-fronts',     name:'Fire fronter',               cat:'Malta',  src:'images/malta/malta-four-fronts.png' },
  { id:'mt-plate',      name:'GamingMalta på flate',       cat:'Malta',  src:'images/malta/malta-gamingmalta-plate.jpg' },
  { id:'mt-island',     name:'Malta — polaroider',         cat:'Malta',  src:'images/malta/malta-island-polaroids.png' },
  { id:'mt-industry',   name:'Bransjescene',               cat:'Malta',  src:'images/malta/malta-industry-stage.jpg' },
  { id:'mt-banner',     name:'Bransjebanner',              cat:'Malta',  src:'images/malta/malta-industry-banner.jpg' },
  { id:'mt-academy',    name:'Malta Esports Academy',      cat:'Malta',  src:'images/malta/malta-esports-academy.jpg' },
  { id:'mt-facility',   name:'Akademiet — lokalene',       cat:'Malta',  src:'images/malta/malta-academy-facility.jpg' },
  { id:'mt-homebase',   name:'Malta as home base',         cat:'Malta',  src:'images/malta/malta-home-base.jpg' },
  { id:'mt-deliver',    name:'Leveranser og investering',  cat:'Malta',  src:'images/malta/malta-deliverables.jpg' },

  { id:'mt-crest',      name:'HEROIC-logo',                cat:'Logoer', src:'images/malta/malta-heroic-crest.png' },
  { id:'mt-mascot',     name:'HEROIC-maskot',              cat:'Logoer', src:'images/malta/malta-heroic-mascot.png' },
  { id:'mt-gm-mark',    name:'GamingMalta-logo',           cat:'Logoer', src:'images/malta/malta-gamingmalta-wordmark.png' }
];

/* src kan være en filsti eller «asset:<id>» — sistnevnte ligger i IndexedDB. */
export function resolveSrc(src, assets) {
  if (!src) return '';
  const m = /^asset:(.+)$/.exec(src);
  return m ? ((assets || {})[m[1]] || '') : src;
}

/* Innholdet som hører til hvert produkt. Uten dette blir en produktslide
   bare Gamer.no med en annen logo på. Tekst hentet fra eksisterende pitch-materiell. */
export const BRAND_CONTENT = {
  gamer: { eyebrow:'Rekkevidde',
    body:['Norges ledende portal for e-sport, gaming og popkultur siden 2001',
          'Community på over 100 000 nordmenn',
          'Norges største lojalitetsklubb innen gaming med over 10 000 medlemmer'],
    stats:[{fact:'gamer.readers'},{fact:'gamer.demo'},{fact:'gamer.mobile'},{fact:'gamer.men'}],
    shotUrl:'gamer.no', imgHint:'Skjermbilde — forsiden av Gamer.no',
    source:'Google Analytics H1 2026 og brukerundersøkelse 2025.' },

  komplett: { eyebrow:'Engasjement',
    body:['Det offisielle mesterskapet i Norge, Europas største nasjonale liga',
          '10.000 utøvere og 1.000 lag deltar hvert år gjennom to sesonger',
          '15.000 registrerte klubber & organisasjoner, 100.000 registrerte medlemmer i platform community',
          'Spillere og klubber fra hele Skandinavia deltar i ligaen gjennomgående gjennom hele året',
          'Broadcast av kamper hver sesong som genererer 1 million konsumerte timer fra streams av interessenter & community per sesong',
          '4. mest populære sportsunderholdningsmerkevaren blant unge i Norge (VG.no i 2022)',
          'Primær demografi mellom 18 - 34 år gamle'],
    stats:[{fact:'komplett.players'},{fact:'komplett.teams'},{fact:'komplett.watch'},{fact:'komplett.demo'}],
    shotUrl:'ggarena.no', imgHint:'Skjermbilde — ligaoversikt i Good Game Arena',
    source:'Plattformdata og Twitch-analyse 2025.' },

  bl: { eyebrow:'Kjøpekraft',
    body:['Nordens største liga innen e-sport og sjakk for næringslivet',
          'Offisiell og eksklusiv leverandør til Norges Bedriftsidrettsforbund, NFF og Norsk Toppfotball',
          'Skandinavisk ekspansjon i 2026 gjennom Företagsligan og Firmaligaen'],
    stats:[{fact:'bl.companies'},{fact:'bl.employees'},{fact:'bl.demo'},{fact:'bl.obx'}],
    shotUrl:'bedriftsligaen.no', imgHint:'Skjermbilde — påmelding og lagoversikt',
    source:'Påmeldingsdata sesong 2025/26.' },

  arena: { eyebrow:'Infrastruktur',
    body:['Turnerings- og spillermarkedsplattformen i økosystemet',
          'Den tekniske infrastrukturen Komplettligaen og øvrige turneringer kjøres på',
          'Mindre kjent som merkevare utad, men det er her selve produktet ligger'],
    stats:[{value:'',label:'Turneringer pr. år'},{value:'',label:'Registrerte spillere'},
           {value:'',label:'Arrangementer driftet'},{value:'',label:'Oppetid'}],
    shotUrl:'ggarena.no', imgHint:'Skjermbilde — turneringsbracket',
    source:'Tallene for Good Game Arena mangler. Fyll inn og legg dem i faktabasen med kilde før sliden brukes mot kunde.' },

  maelstrom: { eyebrow:'Plattform',
    body:['Fullt automatisert og AI-drevet white-label-plattform for konkurranser, utviklet sammen med Accenture',
          'Serverer idrettsforbund, spilloperatører og bedriftskunder — fra lokal fotballklubb til globale merkevarer som Red Bull',
          'Klassisk SaaS-prising. Kunden trenger ingen teknisk kompetanse for å sette opp eller drifte'],
    stats:[{value:'SaaS',label:'Prismodell'},{value:'12+',label:'Moduler'},
           {value:'100 %',label:'Dataeierskap'},{value:'Accenture',label:'Utviklingspartner'}],
    shotUrl:'maelstrom-demo.no', imgHint:'Skjermbilde — dashbord med innsikt og analyse',
    source:'Moduler: dashbord med innsikt og analyse, spiller- og lagstatistikk, turnerings- og ligastyring, egen merkevare og domene, markedsplass, rankinger, embeds og strømintegrasjoner.' },

  frag: { eyebrow:'Aktivering',
    body:['Intenst spillformat bygget i Valve Corporations Source Engine 2, med full tilpasning til kundens merkevare',
          'Fungerer fysisk og digitalt samtidig — ferdig ut av boksen, uten behov for bemanning på stedet',
          'Brukt av Elgiganten for å øke fottrafikk i butikk og få kundene til å bli værende'],
    stats:[{value:'Source 2',label:'Spillmotor'},{value:'Hybrid',label:'Fysisk og digitalt'},
           {value:'Elgiganten',label:'Referansekunde'},{value:'0',label:'Bemanning'}],
    shotUrl:'fragtrial.gg', imgHint:'Skjermbilde — spillformatet i bruk',
    source:'Leveres som modul i Maelstrom-plattformen.' }
};

/* ---------- facts.json — én kilde til sannhet. Eier: én navngitt person. ---------- */
export const FACTS = {
  'gamer.readers':    { value: '250 000', label: 'Lesere pr. mnd',   source: 'Google Analytics, snitt H1 2026', updated: '2026-07-01' },
  'gamer.demo':       { value: '18–39',   label: 'Demografi',        source: 'Brukerundersøkelse 2025',         updated: '2025-11-14' },
  'gamer.mobile':     { value: '60 %',    label: 'Mobil',            source: 'Google Analytics 2026',           updated: '2026-07-01' },
  'gamer.men':        { value: '93 %',    label: 'Menn',             source: 'Brukerundersøkelse 2025',         updated: '2025-11-14' },
  'gamer.community':  { value: '100 000', label: 'Community',        source: 'Registrerte brukere, juni 2026',  updated: '2026-06-30' },
  'gamer.gull':       { value: '10 000',  label: 'Gamer Gull-medlemmer', source: 'Medlemsregister 2026',        updated: '2026-06-30' },
  'gamer.uniques':    { value: '200 000', label: 'Unike lesere pr. mnd', source: 'skagerrak.tech/annonsering-pa-gamerno, 13.09.2022', updated: '2022-09-13' },
  'gamer.pageviews':  { value: '1 500 000', label: 'Sidevisninger pr. mnd', source: 'skagerrak.tech/annonsering-pa-gamerno, 13.09.2022', updated: '2022-09-13' },
  'gamer.registered': { value: '115 000', label: 'Registrerte brukere', source: 'skagerrak.tech/annonsering-pa-gamerno, 13.09.2022', updated: '2022-09-13' },
  'gamer.age':        { value: '20–40',   label: 'Alder',             source: 'skagerrak.tech/annonsering-pa-gamerno, 13.09.2022', updated: '2022-09-13' },

  'ads.cpm.standard': { value: '190',     label: 'CPM standardformater', source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },
  'ads.cpm.premium':  { value: '370',     label: 'CPM storformater',  source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },
  'ads.cpm.fullscreen': { value: '620',   label: 'CPM fullskjerm',    source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },
  'ads.cpm.programmatic': { value: 'fra 40', label: 'CPM programmatisk', source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },
  'ads.content.distribution': { value: '19 000', label: 'Distribusjon, 4 uker', source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },
  'ads.content.production':   { value: 'fra 19 000', label: 'Produksjon', source: 'Prisliste Gamer.no, skagerrak.tech', updated: '2022-09-13' },

  'komplett.players': { value: '10 000',  label: 'Utøvere pr. år',   source: 'Plattformdata 2025',              updated: '2026-01-20' },
  'komplett.teams':   { value: '1 000',   label: 'Lag',              source: 'Plattformdata 2025',              updated: '2026-01-20' },
  'komplett.watch':   { value: '950 000', label: 'Watch time min',   source: 'Twitch-analyse 2025',             updated: '2026-01-20' },
  'komplett.visitors':{ value: '30 000',  label: 'Besøkende playoffs', source: 'Arrangørtall 2025',             updated: '2025-12-02' },
  'komplett.demo':    { value: '18–34',   label: 'Demografi',        source: 'Publikumsundersøkelse 2025',      updated: '2025-11-14' },

  'bl.companies':     { value: '350',     label: 'Bedrifter',        source: 'Påmeldingsdata sesong 2025/26',   updated: '2026-02-11' },
  'bl.employees':     { value: '2 450',   label: 'Ansatte',          source: 'Påmeldingsdata sesong 2025/26',   updated: '2026-02-11' },
  'bl.demo':          { value: '24–40',   label: 'Demografi',        source: 'Deltakerundersøkelse 2025',       updated: '2025-11-14' },
  'bl.obx':           { value: '1/5',     label: 'av OBX-selskaper', source: 'Egen opptelling februar 2026',    updated: '2026-02-11' },

  'social.impressions': { value: '7 328 284', label: 'Impressions',  source: 'Instagram, Facebook, X og TikTok, 2025', updated: '2026-01-15' },
  'social.views':       { value: '3 693 407', label: 'Video views',  source: 'Visninger over 3 sekunder, 2025',        updated: '2026-01-15' },
  'social.watch':       { value: '1 341 734', label: 'Watch time',   source: 'Konsumerte minutter Twitch 2025',        updated: '2026-01-15' },
  'social.followers':   { value: '55 887',    label: 'Følgere',      source: 'Sum alle kanaler, januar 2026',          updated: '2026-01-15' }
};

/* ---------- pris og satser ---------- */
export const PRICING = {
  currency: 'NOK',
  tiers: [
    { id:'single', name:'Enkeltstående', price:25000, reach:400000, emv:2.0, from:true,
      claim:'Én kampanje, ett øyeblikk, målbart resultat',
      incl:['1 aktivering, valgfri flate','Distribusjon i sosiale kanaler','Resultatrapport','Ingen binding'],
      cases:[
        { kicker:'Produktlansering', title:'Én kampanjeuke på Gamer.no', text:'Takeover, native artikkel og socials i samme uke. Alt målt mot ett tydelig mål.', imgHint:'Skjermbilde av takeover på Gamer.no' },
        { kicker:'Turneringsdag', title:'Synlighet rundt sending', text:'Merkevaren eksponeres i en enkelt sending med bumpere og omtale i studio.', imgHint:'Foto fra sending eller broadcast-overlay' }
      ] },
    { id:'t1', name:'Visibility', price:100000, reach:1500000, emv:2.2,
      claim:'Til stede der publikummet er',
      incl:['Display på Gamer.no','2 native artikler','Logo i broadcast','Løpende socials'],
      cases:[
        { kicker:'Alltid til stede', title:'Display gjennom hele sesongen', text:'Kontinuerlig eksponering på Gamer.no gjennom sesongen, med frekvens mot en dedikert gamingmålgruppe.', imgHint:'Display-format i kontekst på Gamer.no' },
        { kicker:'Redaksjonelt', title:'To native artikler', text:'Innhold produsert av redaksjonen, distribuert i kanalene der publikummet allerede er.', imgHint:'Native artikkel på mobil og desktop' },
        { kicker:'Broadcast', title:'Logo i sending', text:'Fast plassering i sendingsgrafikk gjennom seriespillet.', imgHint:'Broadcast-grafikk med logoplassering' }
      ] },
    { id:'t2', name:'Integrated', price:250000, reach:4200000, emv:2.5,
      claim:'Del av innholdet, ikke bare rundt det',
      incl:['Alt i Visibility','Integrasjon i én liga','4 native artikler','Bumpere og overlay','Produktplassering','Synlighet på playoffs'],
      cases:[
        { kicker:'Ligaintegrasjon', title:'Del av selve konkurransen', text:'Merkevaren knyttes til en liga gjennom sesongen, ikke bare til flatene rundt den.', imgHint:'Ligagrafikk med partnernavn' },
        { kicker:'Produktplassering', title:'Produktet i studio', text:'Fysisk tilstedeværelse i sending og i hendene på spillerne.', imgHint:'Produkt synlig i studiooppsett' },
        { kicker:'Playoffs', title:'Toppen av sesongen', text:'Ekstra synlighet i den perioden med høyest seertall og mest oppmerksomhet.', imgHint:'Foto fra playoffs-arrangement' }
      ] },
    { id:'t3', name:'Partner', price:500000, reach:9500000, emv:2.8,
      claim:'Eier en flate på tvers av økosystemet',
      incl:['Alt i Integrated','Begge ligaer','Care package-integrasjon','Fordel i Gamer Gull','Stand på playoffs','1 creator-aktivering','Kvartalsvis data'],
      cases:[
        { kicker:'Care package', title:'Produktet i hendene på lagene', text:'Fysisk pakke til alle påmeldte lag. Unboxing deles organisk i sosiale kanaler.', imgHint:'Care package med kundens produkt' },
        { kicker:'Creator', title:'Én creator-aktivering', text:'Samarbeid med en creator fra økosystemet, produsert og distribuert av oss.', imgHint:'Creator med produkt, stillbilde fra video' },
        { kicker:'Gamer Gull', title:'Fordel på bransjens kveld', text:'Eksponering mot bransje og publikum i én kveld med konsentrert oppmerksomhet.', imgHint:'Foto fra Gamer Gull' }
      ] },
    { id:'t4', name:'Title', price:1000000, reach:22000000, emv:3.2,
      claim:'Kategorieksklusivitet og navngitt eierskap',
      incl:['Alt i Partner','Kategorieksklusivitet','Navngitt liga eller segment','Skandinavisk rekkevidde','Dedikert produksjon','Felles årshjul','Rapport på styrenivå'],
      cases:[
        { kicker:'Navngitt eierskap', title:'Ligaen bærer navnet', text:'Merkevaren står i navnet på liga eller segment, i all kommunikasjon gjennom året.', imgHint:'Ligalogo med partnernavn' },
        { kicker:'Skandinavia', title:'Tre markeder, én avtale', text:'Samme posisjon i Norge, Sverige og Danmark, koordinert fra ett sted.', imgHint:'Kart eller kampanjebilder fra tre markeder' },
        { kicker:'Dedikert produksjon', title:'Innhold laget for dere', text:'Egen produksjon gjennom sesongen, planlagt i et felles årshjul.', imgHint:'Bak kulissene fra produksjon' }
      ] }
  ],
  years: [ {n:1,discount:0},{n:2,discount:.08},{n:3,discount:.12} ],
  markets: [
    { id:'no', label:'Norge', price:1.00, reach:1.00 }
  ],
  activation: { price:35000, volumeBreakAt:5, volumeDiscount:.15 },
  addons: [
    { id:'maelstrom', name:'Maelstrom', price:350000, provisional:true,
      desc:'White-label konkurranseplattform, årlig SaaS-lisens' },
    { id:'frag', name:'FragTrial', price:95000, requires:'maelstrom', provisional:true,
      desc:'Aktiveringsmodul for fysisk og digital kundeaktivering' }
  ]
};

export function compute(st, pricing = PRICING) {
  const tier = pricing.tiers.find(t => t.id === st.tier) || pricing.tiers[1];
  const market = pricing.markets.find(m => m.id === st.market) || pricing.markets[0];
  const yr = pricing.years.find(y => y.n === Number(st.years)) || pricing.years[0];
  const A = pricing.activation;
  let actCost = 0;
  for (let k = 1; k <= (st.acts || 0); k++) actCost += A.price * (k >= A.volumeBreakAt ? 1 - A.volumeDiscount : 1);
  const addons = pricing.addons.filter(a => (st.addons || []).includes(a.id));
  const addonList = addons.reduce((n, a) => n + a.price, 0);
  const mediaList = tier.price * market.price + actCost;
  const annualList = mediaList + addonList;
  const annual = annualList * (1 - yr.discount);
  const years = Number(st.years) || 1;
  const total = annual * years;
  const saved = annualList * years - total;
  const mediaTotal = mediaList * (1 - yr.discount) * years;
  const addonTotal = addonList * (1 - yr.discount) * years;
  const reach = tier.reach * market.reach * years * (1 + (st.acts || 0) * 0.06);
  const emv = mediaTotal * tier.emv;
  const cpm = reach ? mediaTotal / (reach / 1000) : 0;
  return { total, annual, saved, reach, emv, cpm, tier, market, yr, addons, mediaTotal, addonTotal, years };
}

/* ---------- systemtekst ---------- */
export const STRINGS = {
  no: { slide:'Slide', of:'av', total:'Total investering', perYear:'Per år', reach:'Estimert rekkevidde',
        emv:'Estimert medieverdi', cpm:'Effektiv CPM', years:'Avtalelengde', acts:'Ekstra aktiveringer',
        markets:'Markeder', year:'år', saves:'Du sparer', recommended:'Anbefalt', level:'Nivå',
        platform:'Plattform', media:'Media', perYearShort:'NOK / år · eks. mva', source:'Kilde', incl:'Dette er inkludert' },
  en: { slide:'Slide', of:'of', total:'Total investment', perYear:'Per year', reach:'Estimated reach',
        emv:'Estimated media value', cpm:'Effective CPM', years:'Term', acts:'Extra activations',
        markets:'Markets', year:'yr', saves:'You save', recommended:'Recommended', level:'Level',
        platform:'Platform', media:'Media', perYearShort:'NOK / yr · excl. VAT', source:'Source', incl:'What is included' }
};

/* ---------- blokkbibliotek. Kategori = jobb, ikke teknisk type. ---------- */
export const LIBRARY = [
  { type:'cover', cat:'Åpning', name:'Forside', desc:'Kundens logo stort på arrangementsbilde. Alltid slide 1.',
    fields:[['kicker','Kicker','text'],['title','Tittel','area'],['sub','Underlinje','area'],['note','Merknad','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text']],
    defaults:{ kicker:'Skagerrak Technologies × Kunde', title:'Top of mind i skandinavisk e-sport og gamingkultur', sub:'', note:'', imgHint:'Arrangementsbilde — publikum på playoffs' } },

  { type:'umbrella', cat:'Økosystem', name:'Paraplyen', desc:'Hva kunden faktisk snakker med. Bør alltid være slide 2.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['intro','Ingress','area'],['parent','Toppnivå','text'],['brands','Merkevarer','umb'],['subs','Undermerker','subs']],
    defaults:{ eyebrow:'Økosystemet', title:'Ett økosystem, flere innganger',
      intro:'Skagerrak eier hele verdikjeden — fra redaksjonelt innhold og ligadrift til plattformen andre lisensierer.',
      brands:[ {key:'gamer',lead:'Norges ledende',rest:'nettsted for spill, teknologi og spillkultur'},
               {key:'komplett',lead:'Europas største',rest:'nasjonale liga i e-sport'},
               {key:'bl',lead:'Nordens største',rest:'bedriftsliga innen gaming og sjakk'} ],
      parent:'Skagerrak Technologies',
      subs:[
        {label:'Fragtrial', detail:['Turneringsverktøyet vi lisensierer ut til andre arrangører','Brukes av eksterne ligaer i og utenfor Norden','Egen inntektsstrøm uavhengig av mediesalg']},
        {label:'Maelstrom', detail:['Vårt eget innholdshus for produksjon av video og broadcast','Produserer sendingene til Komplettligaen og Bedriftsligaen','Tilgjengelig for partnerprodusert innhold']},
        {label:'gg arena', detail:['Plattformen ligaene faktisk kjøres på','Påmelding, kampoppsett, resultater og spillerprofiler','Der utøverne er innlogget gjennom hele sesongen']},
        {label:'Annonsering', detail:['Display og takeover på Gamer.no','Bumpere og overlay i sendinger','Selges som kampanje eller som del av et partnerskap']},
        {label:'Native ads', detail:['Redaksjonelt produsert innhold i Gamer.no-format','Distribueres i egne kanaler og i sosiale medier','Måles på lesetid, ikke bare visninger']}
      ] } },

  { type:'statement', cat:'Åpning', name:'Påstand', desc:'Ett premiss, stort, på tom flate. Bryter rytmen før tallene.',
    fields:[['eyebrow','Eyebrow','text'],['text','Påstand','area'],['attribution','Avsender','text']],
    defaults:{ eyebrow:'Premisset', text:'Gaming er ikke en kanal. Det er stedet publikummet ditt allerede tilbringer fritiden sin.', attribution:'Skagerrak Technologies' } },

  { type:'brand', cat:'Økosystem', name:'Produktprofil', desc:'Én per merkevare kunden faktisk skal kjøpe. Aldri flere.',
    fields:[['brand','Merkevare','brand'],['eyebrow','Eyebrow','text'],['body','Punkter','list'],['stats','Tall','stats'],['shotUrl','URL i ramme','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text'],['source','Kilde','area']],
    defaults:{ brand:'gamer', ...BRAND_CONTENT.gamer } },

  { type:'metrics', cat:'Bevis', name:'Tallslide', desc:'Når tallene er argumentet. Ingen bilder.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['stats','Tall','stats'],['source','Kilde','area']],
    defaults:{ eyebrow:'Rekkevidde', title:'Publikummet i tall',
      stats:[{fact:'gamer.readers'},{fact:'komplett.players'},{fact:'bl.companies'},{fact:'social.followers'}],
      source:'Se kildehenvisning per tall i faktabasen.' } },

  { type:'table', cat:'Bevis', name:'Datatabell', desc:'Aggregerte tall per merkevare med sum-rad. Fotnote er obligatorisk.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['cols','Kolonner','list'],['rows','Rader','grid'],['sum','Sum-rad','sumrow'],['source','Kilde','area']],
    defaults:{ eyebrow:'Dokumentert rekkevidde', title:'Aggregerte sosiale tall',
      cols:['Impressions','Video views','Watch time','Følgere'],
      rows:[ {brand:'bl',v:['262 414','870 218','373 328','8 851']},
             {brand:'komplett',v:['724 295','2 740 489','966 612','26 253']},
             {brand:'gamer',v:['6 341 575','82 700','1 740','20 783']} ],
      sum:{ label:'Totalt', v:['7 328 284','3 693 407','1 341 734','55 887'] },
      source:'Aggregert fra Instagram, Facebook, X og TikTok. Video views teller visninger over 3 sekunder. Watch time er konsumerte minutter på Twitch i 2025.' } },

  { type:'matrix', cat:'Bevis', name:'Leveransematrise', desc:'Hva som er tilgjengelig hvor. Erstatter haketabellene.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['cols','Kolonner','list'],['rows','Rader','checks']],
    defaults:{ eyebrow:'Leveranse', title:'Hva som er tilgjengelig hvor',
      cols:['Plattform','Native ads','Socials','Broadcast','Produktplassering','Playoffs'],
      rows:[ {brand:'gamer',v:[1,1,1,0,1,0]},{brand:'komplett',v:[1,1,1,1,1,1]},{brand:'bl',v:[1,0,1,1,1,1]} ] } },

  { type:'showcase', cat:'Bevis', name:'Fysisk produkt', desc:'Care packages, keycaps, premier. Stort produktbilde.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['body','Punkter','list'],['img','Bilde','image'],['imgHint','Bildeanvisning','text']],
    defaults:{ eyebrow:'Aktivering', title:'Care package', body:['Fysisk pakke til alle påmeldte lag','Kundens produkt i hendene på deltakerne','Unboxing deles organisk i sosiale kanaler'], imgHint:'Produktfoto — care package, flatlay på mørk flate' } },

  { type:'tiers', cat:'Kommersielt', name:'Prisnivåer', desc:'Trappen med fem nivåer. Anbefalt nivå fremhevet.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['intro','Ingress','area'],['highlight','Anbefalt nivå','tier'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Investeringsnivå', title:'Fem nivåer, én logikk',
      intro:'Prisene er faste. Rabatt gis gjennom avtalelengde og volum — aldri gjennom å forhandle ned nivået.',
      highlight:'t3', source:'Alle beløp er årlig investering eksklusive merverdiavgift.' } },

  { type:'configurator', cat:'Kommersielt', name:'Kalkulator', desc:'Levende kalkulator i møtet. Tre visningsvarianter.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['variant','Variant','variant'],['tier','Nivå','tier'],['years','Avtalelengde','num'],['acts','Ekstra aktiveringer','num'],['market','Marked','market'],['addons','Plattform','addons'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Kalkulator', title:'Sett sammen avtalen', variant:'split',
      tier:'t3', years:2, acts:3, market:'no', addons:['maelstrom'],
      source:'Plattformaktiveringer er lisens, ikke eksponering, og holdes utenfor både CPM og medieverdi. Estimert medieverdi er annonseverdi av tilsvarende eksponering kjøpt til markedspris, med påslag for organisk og redaksjonell dekning. Lisensprisene er foreløpige.' } },

  { type:'adrates', cat:'Kommersielt', name:'Annonsering på Gamer.no', desc:'Formater, CPM og innholdsmarkedsføring. Brukes når kunden kjøper media direkte, ikke partnerskap.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['intro','Ingress','area'],['rows','Formater','adrows'],['content','Innholdsmarkedsføring','crows'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Annonsering', title:'Formater og priser på Gamer.no',
      intro:'Bannerannonser selges på CPM. Innholdsmarkedsføring selges som pakke med distribusjon og produksjon.',
      rows:[
        { name:'Toppbanner',    spec:'1000×300, 980×300',        size:'100 KB', cpm:'190' },
        { name:'Skyskraper',    spec:'300×600, 160×600, 180×500', size:'100 KB', cpm:'190' },
        { name:'Board liten',   spec:'300×250, 320×320',          size:'50 KB',  cpm:'190' },
        { name:'Board stor',    spec:'320×400',                   size:'100 KB', cpm:'370' },
        { name:'Netboard',      spec:'580×400',                   size:'100 KB', cpm:'190' },
        { name:'Brandboard',    spec:'980×600',                   size:'200 KB', cpm:'370' },
        { name:'Hestesko',      spec:'1920×1080',                 size:'200 KB', cpm:'370' },
        { name:'Fullskjerm',    spec:'1920×1080, 1080×1920',      size:'250 KB', cpm:'620' },
        { name:'Programmatisk', spec:'—',                         size:'—',      cpm:'fra 40' }
      ],
      content:[
        { name:'Kommersiell artikkel — distribusjon', dur:'4 uker', price:'19 000' },
        { name:'Kommersiell artikkel — produksjon',   dur:'Etter avtale', price:'fra 19 000' }
      ],
      source:'Alle priser er i NOK eksklusive merverdiavgift. CPM = pris per tusen visninger. Kommersielle artikler roterer høyt på forsiden, merkes «annonse», deles i egne sosiale kanaler og støttes av en målrettet betalt Facebook-kampanje. Kilde: skagerrak.tech, prisliste for Gamer.no.' } },

  { type:'timeline', cat:'Kommersielt', name:'Årshjul', desc:'Når ting faktisk skjer. Ofte det som gjør at budsjettet godkjennes.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['units','Enheter','list'],['tracks','Spor','tracks']],
    defaults:{ eyebrow:'Aktivering', title:'Årshjul 2026', units:['Q1','Q2','Q3','Q4'],
      tracks:[ {brand:'client',items:[]},
               {brand:'komplett',items:[{at:0,span:2,text:'Sesong 1 → playoffs Oslo'},{at:2,span:2,text:'Sesong 2 → finale'}]},
               {brand:'bl',items:[{at:0,span:1,text:'Vårsesong'},{at:1,span:1,text:'Corporate Cup'},{at:2,span:1,text:'Høstsesong'},{at:3,span:1,text:'Care packages'}]},
               {brand:'gamer',items:[{at:0,span:4,text:'Alltid på — native, display og nyhetsbrev'}]} ] } },

  { type:'logowall', cat:'Bevis', name:'Logovegg', desc:'Kunder eller partnere. Rolig rutenett, lik optisk størrelse.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['logos','Logoer','wall']],
    defaults:{ eyebrow:'Selskap i Bedriftsligaen', title:'De er allerede med',
      logos:['Equinor','Kongsberg Gruppen','DNB','Intility','PEAB','Hydro','Schibsted','DHL','Capgemini','Sopra Steria'] } },

  { type:'next', cat:'Avslutning', name:'Neste steg', desc:'Tre steg med eier og dato. Et dekk som ikke ber om noe får ikke noe.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['steps','Steg','steps']],
    defaults:{ eyebrow:'Videre', title:'Neste steg',
      steps:[ {n:'01',text:'Tilbakemelding på nivå og omfang',who:'Kunden',when:'Innen 20. august'},
              {n:'02',text:'Detaljert mediaplan og endelig pris',who:'Skagerrak',when:'Innen 1. september'},
              {n:'03',text:'Signering og oppstart produksjon',who:'Begge',when:'Medio september'} ] } },

  { type:'case', cat:'Bevis', name:'Case', desc:'Én case i stort format. Hentes fra casebasen og kan overstyres i pitchen.',
    fields:[['case','Case fra basen','case'],['kicker','Kicker','text'],['title','Tittel','text'],['text','Beskrivelse','area'],
            ['result','Resultat','text'],['client','Kunde','text'],['year','Årstall','text'],['img','Bilde','image']],
    defaults:{ kicker:'Case', title:'Velg en case fra basen', text:'', result:'', client:'', year:'', img:'' } },

  { type:'cases', cat:'Bevis', name:'Caser side om side', desc:'To eller tre caser ved siden av hverandre. Hentes fra casebasen.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['intro','Ingress','area'],['cases','Caser','caselist']],
    defaults:{ eyebrow:'Bevis', title:'Slik har det sett ut før', intro:'', cases:[] } },

  { type:'placement', cat:'Bevis', name:'Plassering', desc:'Mockups av flatene våre med kundens merkevare satt inn.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['intro','Ingress','area'],['spots','Flater','spots'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Plassering', title:'Slik ser merkevaren ut hos oss',
      intro:'Fire flater vi eier selv. Samme merkevare, fire ulike måter publikummet møter den på.',
      spots:[
        { kind:'desktop', chrome:'gamer.no', label:'Display', title:'Takeover på forsiden', text:'Toppbanner og wallpaper i samme visning, mot hele lesermassen.', imgHint:'Mockup — Gamer.no med takeover',
          variants:[
            { label:'Takeover', imgHint:'Mockup — Gamer.no med takeover' },
            { label:'Toppbanner', title:'Toppbanner', imgHint:'Mockup — Gamer.no med toppbanner' },
            { label:'Wallpaper', title:'Wallpaper', imgHint:'Mockup — Gamer.no med wallpaper' }
          ] },
        { kind:'broadcast', chrome:'Direkte', label:'Broadcast', title:'Logo i sending', text:'Bumpere, overlay og omtale i studio gjennom seriespillet.', imgHint:'Mockup — sendingsgrafikk med logo',
          variants:[
            { label:'Overlay', imgHint:'Mockup — sendingsgrafikk med logo' },
            { label:'Bumper', title:'Bumper', imgHint:'Mockup — bumper med logo' },
            { label:'Studio', title:'Omtale i studio', imgHint:'Mockup — studio med partnerlogo' }
          ] },
        { kind:'mobile', chrome:'Native', label:'Redaksjonelt', title:'Native artikkel', text:'Innhold produsert av redaksjonen, lest der publikummet allerede er.', imgHint:'Mockup — native artikkel på mobil',
          variants:[
            { label:'Artikkel', imgHint:'Mockup — native artikkel på mobil' },
            { label:'I feeden', title:'Native i feeden', imgHint:'Mockup — native i artikkelfeeden' }
          ] },
        { kind:'desktop', chrome:'ggarena.no', label:'Plattform', title:'Turneringssiden', text:'Merkevaren i bracket, lobby og premiering gjennom hele turneringen.', imgHint:'Mockup — turneringsside med partnerlogo',
          variants:[
            { label:'Bracket', imgHint:'Mockup — bracket med partnerlogo' },
            { label:'Lobby', title:'Lobby', imgHint:'Mockup — lobby med partnerlogo' },
            { label:'Premiering', title:'Premiering', imgHint:'Mockup — premiering med partnerlogo' }
          ] }
      ],
      source:'Mockupene illustrerer reelle flater. Endelig utforming avtales i produksjon.' } },

  { type:'benchmark', cat:'Bevis', name:'Sammenligning', desc:'Nøkkeltall øverst, rangerte stolper med logo under. Til når tallet må måles mot noen.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['stats','Nøkkeltall','stats'],['barLabel','Overskrift diagram','text'],['rows','Rader','bench'],['img','Bilde','image'],['imgHint','Bildeanvisning','text'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Rekkevidde', title:'Tallene, og hvem de måles mot',
      stats:[], barLabel:'Engasjementsrate', rows:[], img:'', imgHint:'Foto — publikum eller lag', source:'' } },

  { type:'audience', cat:'Bevis', name:'Publikum', desc:'Demografi: kjønn, alder og markeder stilt opp rundt ett stort tall.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],
            ['genderLabel','Overskrift kjønn','text'],['gender','Kjønn','stats'],
            ['ageLabel','Overskrift alder','text'],['age','Alder','stats'],
            ['big','Stort tall','text'],['bigLabel','Etikett stort tall','text'],
            ['marketLabel','Overskrift marked','text'],['markets','Markeder','stats'],['source','Fotnote','area']],
    defaults:{ eyebrow:'Publikum', title:'Hvem som ser på',
      genderLabel:'Kjønn', gender:[], ageLabel:'Kjernedemografi', age:[],
      big:'', bigLabel:'', marketLabel:'Toppmarkeder', markets:[], source:'' } },

  { type:'spotlight', cat:'Åpning', name:'Blikkfang', desc:'Ett bilde midt på flaten med overskrift og underlinje. Til ansikter og produkter.',
    fields:[['eyebrow','Eyebrow','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text'],['title','Tittel','text'],['sub','Underlinje','area']],
    defaults:{ eyebrow:'Blikkfang', title:'Overskrift', sub:'', imgHint:'Bilde midt på flaten — motivet frilagt eller i full bredde' } },

  { type:'pillars', cat:'Økosystem', name:'Fire fronter', desc:'Aksentflate med fire kort. Hvert kort har eget bilde, overskrift og tekst, og kan flyttes for seg.',
    fields:[['title','Tittel','text'],['lead','Ingress','area'],['sub','Underlinje','area'],['cards','Kort','pillars']],
    defaults:{ title:'Muligheten', lead:'', sub:'',
      cards:[
        { img:'', head:'Kort 1', text:'', align:'top',    imgHint:'Bilde' },
        { img:'', head:'Kort 2', text:'', align:'bottom', imgHint:'Bilde' },
        { img:'', head:'Kort 3', text:'', align:'top',    imgHint:'Bilde' },
        { img:'', head:'Kort 4', text:'', align:'bottom', imgHint:'Bilde' }
      ] } },

  { type:'proof', cat:'Bevis', name:'Dokumentasjon', desc:'To samarbeid med faktiske tall. Polaroid på hver sin side, fire tall hver, og en merknad øverst.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['sub','Underlinje','text'],['note','Merknad','area'],['cases','Caser','proof']],
    defaults:{ eyebrow:'Bevis', title:'Dokumentert resultat', sub:'', note:'',
      cases:[
        { img:'', tag:'Case', caption:'', when:'', side:'left', rot:-3, imgHint:'Portrett',
          stats:[{value:'',label:''},{value:'',label:''},{value:'',label:''},{value:'',label:''}] },
        { img:'', tag:'Case', caption:'', when:'', side:'right', rot:3, imgHint:'Portrett',
          stats:[{value:'',label:''},{value:'',label:''},{value:'',label:''},{value:'',label:''}] }
      ] } },

  { type:'frames', cat:'Bevis', name:'Bilderammer', desc:'Polaroider på tvers av flaten. Hver ramme flyttes og skaleres for seg, og har sitt eget bilde, merkelapp og bildetekst.',
    fields:[['eyebrow','Eyebrow','text'],['items','Rammer','frames'],['title','Tittel','text'],['sub','Underlinje','area']],
    defaults:{ eyebrow:'Ambassadører', title:'Overskrift', sub:'',
      items:[
        { img:'', tag:'@navn', caption:'', rot:-6, imgHint:'Portrett' },
        { img:'', tag:'@navn', caption:'', rot:3,  imgHint:'Portrett' },
        { img:'', tag:'@navn', caption:'', rot:-2, imgHint:'Portrett' }
      ] } },

  { type:'briefing', cat:'Bevis', name:'Briefing', desc:'Stor tofelts tittel og punktliste til venstre, 2x2-bilderutenett til høyre. Til events, rapporter og faktaark.',
    fields:[['title','Tittel — linjeskift er ny linje','area'],
            ['body','Punkter — ett per linje, **fet** for utheving','area'],
            ['img','Bilde 1','image'],['imgHint','Bildeanvisning 1','text'],
            ['img2','Bilde 2','image'],['imgHint2','Bildeanvisning 2','text'],
            ['img3','Bilde 3','image'],['imgHint3','Bildeanvisning 3','text'],
            ['img4','Bilde 4','image'],['imgHint4','Bildeanvisning 4','text']],
    defaults:{ title:'Esportdagen &\nGamingrapporten',
      body:'Re-etableringen av E-sportdagen i **ny drakt og navn** som nasjonal plattform for e-sport, gaming, streaming, internettøkonomi og digital valuta\nSkal samle 250 opinionsledere fra gaming, politikk, byrå og kreativ industri og e-sport i Oslo, August 2025\nForsterket med tilstedeværelse sammen med samarbeidspartnere under Arendalsuken 2025\nE-sportdagen vil også fungere som et fora for diskusjon og distribusjon av kommende Gamingrapporten\nI total mangel på kredible kilder og aktører som distribuerer troverdige tall, data og innsikter om bransjen i sin helhet, ønsker Good Game til å investere for å ta denne posisjonen med DNB fremover',
      imgHint:'Foto — fullsatt sal, konferanse', imgHint2:'Foto — scene med ESD-logo', imgHint3:'Foto — foredragsholder på scenen', imgHint4:'Foto — foredragsholder med mikrofon' } },

  { type:'activation', cat:'Bevis', name:'Aktivering', desc:'Tittel, ingress og punktliste til venstre. To skjermbilder som overlapper og heller til høyre.',
    fields:[['title','Tittel','text'],['intro','Ingress — *kursiv* og **fet** støttes','area'],
            ['body','Punkter — ett per linje, **fet** for utheving','area'],
            ['img','Bilde bak','image'],['imgHint','Bildeanvisning — bakre','text'],
            ['img2','Bilde foran','image'],['imgHint2','Bildeanvisning — fremre','text']],
    defaults:{ title:'Eventaktivering',
      intro:'Aktivering av konsumer på fysiske og digitale arrangementer med *always-on* aktiviteter som insentiviserer brukeren til å samhandle med merkevaren DNB',
      body:'Gjennom Good Game sin nye plattform kan DNB få skreddersydde spillopplevelser- og utfordringer som kunder alltid kan interaktere med\nTeknologien kalles FragTrial og gjør at man kan kommersialisere små utgaver av e-sporttitler hvor brukerne kan vinne premier\nEn aktivering som er autonom og fullautomatisk hvor brukeren ikke trenger hjelp eller support for å delta\nTillater oss å aktivere konsumenter på arrangementer offline, så vel som digitalt, på samme tid\nData og innsikt samles inn og er utelukkende tilgjengelig for DNB\nBrukes i dag av kunder som Elkjøp Norden, Red Bull, Coca Cola Norge og JCP',
      imgHint:'Skjermbilde — premieoversikt i dashbordet', imgHint2:'Skjermbilde — spillopplevelse med partnerlogo' } },

  { type:'partnership', cat:'Bevis', name:'Partnerskap', desc:'Fullbredde-foto med et mørkt kort i hjørnet: to logoer og en punktliste. Til oppkjøp, fusjoner og allianser.',
    fields:[['img','Bakgrunnsbilde','image'],['imgHint','Bildeanvisning','text'],
            ['logo1','Logo 1','image'],['logo1Name','Navn — logo 1','text'],
            ['logos2','Logoer — høyre side av delestreken','logorow'],
            ['body','Punkter — ett per linje, **fet** for utheving','area']],
    defaults:{ imgHint:'Foto — lag i konkurranse, wide',
      logo1Name:'Good Game', logos2:[{ img:'', name:'Skagerrak Technologies' }],
      body:'Norges to ledende innen gaming teknologi- og sportsunderholdning slås sammen til en fullkommen tilbyder\nMenneskene bak Skagerrak Technologies bak tidligere store e-sportvirksomheter som Nordavind DNB & 00Nation\nEtablert et nytt cap table bestående av ressursterke aktører som Tor Olav Trøim, Smedvig-familien, Harald Strømme, Johan Brand og Polaris Media\nFull overhaling kommersielt og redaksjonelt med lansering av nye produkter, tjenester og flater for å styrke tilbudsspekteret til partnere\nEtablert internt byrå som utelukkende skal støtte samarbeidspartnere, sponsorer og merkevareaktiveringer' } },

  { type:'formation', cat:'Bevis', name:'Etablering', desc:'Fullbredde-foto med logorekke og overskrift, mørkt panel med kundelogo. Til lanserings- og sammenslåingsslides.',
    fields:[['img','Bakgrunnsbilde','image'],['imgHint','Bildeanvisning','text'],
            ['logos','Logoer over overskriften','logorow'],
            ['title','Overskrift — linjeskift er ny linje','area']],
    defaults:{ imgHint:'Foto — lagbilde fra scenen, wide',
      logos:[{ img:'logos/ggligaen.png', name:'Good Game Ligaen' }, { img:'logos/gamerno.png', name:'Gamer.no' }, { img:'logos/bedriftsligaen.png', name:'Bedriftsligaen' }],
      title:'Etableringen\nav en norsk\ngaming\nmastodont' } },

  { type:'membership', cat:'Kommersielt', name:'Medlemskap', desc:'Nøstet punktliste til venstre, to skjermbilder til høyre. Til plattformmedlemskap og fordelsprogrammer.',
    fields:[['title','Tittel','area'],['sub','Underlinje','area'],['lead','Produktnavn','text'],['tag','Undertittel','area'],
            ['body','Punkter — linjeskift er nytt punkt, innrykk er underpunkt, **fet** for utheving','area'],
            ['iconBullets','Punkter med bilde','features'],
            ['footnote','Avsluttende avsnitt — innledning','area'],['footnoteBody','Avsluttende punkter — linjeskift er nytt punkt, **fet** for utheving','area'],
            ['closingNote','Sluttsetning (står for seg selv)','text'],
            ['img','Bilde 1','image'],['imgHint','Bildeanvisning 1','text'],['img2','Bilde 2','image'],['imgHint2','Bildeanvisning 2','text'],
            ['img2Mode','Bilde 2 — visning','img2mode'],['widgetTitle','Widget — tittel','text'],['widgetPrice','Widget — pris','text'],['deals','Fordeler i widgeten','dealcards']],
    defaults:{ title:'Community & tilgangsfordeler man ønsker', sub:'Et sterkt, voksende og retentivt økosystem uten kommersiell støy',
      lead:'VISA x Gamer Gull', tag:'Plattformsmedlemskap på tvers av Gamer.no, Good Game-ligaen og Bedriftsligaen',
      body:'Over 12.000 medlemmer **abonnerer** månedlig gjennom året for betalt deltagelse og tilgang til ligaer, innhold og kommersielle fordeler\nEn total brukerbase på **100.000 medlemmer**, hvor hvert medlem i snitt er en del av community i minst 9 år og 250.000 unike norske plattformbesøk i måneden\nI kjernen av et partnerskap, ønsker vi å legge til rette for en konverteringsfunnel på plattformen som i korte trekk gjør at:\n  Alle nye/eksisterende VISA-kunder får gratis Gamer Gull-medlemskap ved bruk av sitt VISA-kort\n  De som ikke har VISA-kort må betale vanlig medlemskap, eller kan opprette kundeforhold i Bank/DNB for å dra nytte av sitt nye medlemskap og gratis tilgang til liga og mye mer\nYtterligere potensielle synergier mellom partene med eksisterende partnere som **Komplett, DNB og Lenovo**',
      imgHint:'Skjermbilde — Gamer Gull i appen', imgHint2:'Skjermbilde — VISA-fordeler i appen',
      img2Mode:'widget', widgetTitle:'Good Game Gull', widgetPrice:'790 kr / år',
      deals:[
        { img:'', head:'Monster', text:'Se hvilke avtaler og rabatter du har tilgang på', tag:'MONSTER1337' },
        { img:'', head:'Kiwi', text:'10 % på Monster White Edition og få 1 000 COD points!', tag:'KIWIGULL25' },
        { img:'', head:'Power', text:'Medlemmer av Gamer Gull får 15 % på sitt første kjøp!', tag:'POWERLOW' },
        { img:'', head:'REVOLUT', text:'Få gratis ligapass i GGL og masse fordeler gjennom Revolut', tag:'REVOLUT2025' }
      ] } },

  { type:'loyaltyapp', cat:'Kommersielt', name:'Appskjermer — Gamer Gull', desc:'To skjermbilder fra Gamer Gull-appen gjenskapt som redigerbare elementer. Venstre: fordelskort med logo, tekst og kode per partner. Høyre: medlemsskjerm med eget bakgrunnsbilde og ikoner.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','area'],
            ['rewards','Venstre skjerm — fordelskort','dealcards'],
            ['loyaltyBg','Høyre skjerm — bakgrunnsbilde','image'],['loyaltyLogo','Høyre skjerm — logo','image'],
            ['loyaltyHead','Høyre skjerm — tittel','text'],['loyaltyTag','Høyre skjerm — undertekst','text'],
            ['features','Høyre skjerm — punkter','features'],
            ['ctaHead','Høyre skjerm — infoboks, tittel','text'],['ctaText','Høyre skjerm — infoboks, tekst','area']],
    defaults:{ eyebrow:'Gamer Gull', title:'Medlemsopplevelsen i appen',
      rewards:[
        { img:'', head:'Monster', text:'Se hvilke avtaler og rabatter du har tilgang på', tag:'MONSTER1337' },
        { img:'', head:'Kiwi', text:'10 % på Monster White Edition og få 1 000 COD points!', tag:'KIWIGULL25' },
        { img:'', head:'Power', text:'Medlemmer av Gamer Gull får 15 % på sitt første kjøp!', tag:'POWERLOW' },
        { img:'', head:'Revolut', text:'Få gratis ligapass i GGL og masse fordeler gjennom Revolut', tag:'REVOLUT2025' }
      ],
      loyaltyBg:'', loyaltyLogo:'',
      loyaltyHead:'Gamer Gull', loyaltyTag:'Oppgrader spillopplevelsen din!',
      features:[
        { img:'', head:'Spill i Good Game-ligaen', text:'Delta i Norges største e-sportliga', tag:'12 gode grunner til å delta »' },
        { img:'', head:'Analyser med- og motspillere', text:'Avslør styrkene og svakhetene til lagene du møter.', tag:'' },
        { img:'', head:'Få eksklusive rabatter', text:'Få løpende fordeler og rabatter hos våre samarbeidspartnere.', tag:'' }
      ],
      ctaHead:'Du har et personlig abonnement', ctaText:'Visste du at du kan spare penger med et gruppeabonnement?' } },

  { type:'productscene', cat:'Økosystem', name:'Produktvitrine', desc:'Produktprofil med partnerkryss og enhetsscene — for produkter med et tydelig partnertilbud.',
    fields:[['brand','Merkevare','brand'],['title','Tittel','text'],['text','Ingress','area'],['stats','Tall','stats'],
            ['partners','Partnere (kryss)','list'],['text2','Andre avsnitt','area'],['note','Linje under avsnitt','text'],
            ['demoTitle','Demografi — tittel','text'],['demoBullets','Demografi — punkter','list'],['demoNote','Demografi — kildenote','text'],
            ['shotUrl','URL i ramme','text'],['img','Bilde 1 (browser)','image'],['imgHint','Bildeanvisning 1','text'],
            ['img2','Bilde 2 (mobil)','image'],['imgHint2','Bildeanvisning 2','text']],
    defaults:{ brand:'ggarena', title:'GG Arena',
      text:'Built on Skagerrak platform technology, Maelstrom, GG Arena is the home to Scandinavian esports and competitive gaming, giving amateur hosts to professional tournament operators the tools to operate cross-platform tournaments with ease.',
      stats:[{value:'52.000',label:'Average Monthly Users'},{value:'100%',label:'Partner Share of Voice'},{value:'0%',label:'Random Advertisers'},{value:'95%',label:'PC / Desktop'}],
      partners:['Loyalty Club','Platform','Product Placement','Activities','Tournaments','League','In-game Ads'],
      text2:'Automated user experience. Built on a fully owned and self developed tech-stack with zero dependencies. Privacy and GDPR secured and regulated under Norwegian law.',
      note:'No downloads. Login, Click and Play.',
      demoTitle:'Demographic Metrics:',
      demoBullets:['85% Male Audience','Tech-Savvy','Majority 16 - 28 y.o'],
      demoNote:"* Gamer.no Spring Survey '26 (>1000)",
      shotUrl:'ggarena.no', imgHint:'Skjermbilde — turneringsoversikt i GG Arena', imgHint2:'Skjermbilde — mobilvisning i GG Arena' } },

  { type:'invest', cat:'Kommersielt', name:'Leveranser og investering', desc:'Hva kunden får, satt opp mot hva det koster. Leveransene til venstre, beløpet på aksentflate til høyre.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','area'],['sub','Underlinje','text'],['rows','Leveranser','deliv'],
            ['amountLabel','Overskrift beløp','text'],['amount','Beløp','text'],['unit','Enhet','text'],['note','Merknad','text']],
    defaults:{ eyebrow:'', title:'Leveranser og investering', sub:'Hva kunden får. Hva det koster.',
      rows:[
        { label:'Marketing', items:['Jersey integration'] },
        { label:'Content', items:['Short form video series'] }
      ],
      amountLabel:'Årlig investering', amount:'', unit:'', note:'' } },

  { type:'options', cat:'Kommersielt', name:'Tillegg', desc:'To eller tre muligheter som ligger utenfor selve avtalen. Tittel i to farger, kort side om side.',
    fields:[['eyebrow','Eyebrow','text'],['titleTop','Tittel — linje 1','text'],['titleAccent','Tittel — linje 2','text'],['intro','Ingress','area'],['cards','Kort','opts'],['source','Fotnote','area']],
    defaults:{ eyebrow:'', titleTop:'Ytterligere', titleAccent:'Muligheter', intro:'',
      cards:[
        { head:'Mulighet én', text:'Beskrivelse av muligheten.', tag:'' },
        { head:'Mulighet to', text:'Beskrivelse av muligheten.', tag:'' }
      ], source:'' } },

  { type:'homebase', cat:'Kommersielt', name:'Hjemmebase', desc:'Bilde med tittel og merkelapp over, tre nummererte punkter på lys flate og et eget felt for hva vi ber om.',
    fields:[['kicker','Kicker','text'],['title','Tittel','text'],['tag','Merkelapp','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text'],
            ['points','Punkter','list'],['askLabel','Overskrift ask','text'],['ask','Ask','area'],['askEmph','Ask — uthevet','area']],
    defaults:{ kicker:'', title:'Overskrift', tag:'', points:['Punkt én','Punkt to','Punkt tre'],
      askLabel:'Vi ber om:', ask:'', askEmph:'', imgHint:'Foto — lag eller lokasjon, vidvinkel' } },

  { type:'closing', cat:'Avslutning', name:'Avslutning', desc:'Delt flate: bilde og takk. Kontaktinfo hentes fra avsenderen.',
    fields:[['text','Tekst','text'],['contact','Kontakt (tom = fra avsender)','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text']],
    defaults:{ text:'Takk', contact:'', imgHint:'Arrangementsbilde — spillere i aksjon' } },

  { type:'divider', cat:'Vedlegg', name:'Seksjonsskille', desc:'Ett ord stort på fullbleed bilde.',
    fields:[['word','Ord','text'],['sub','Undertekst','text'],['img','Bilde','image'],['imgHint','Bildeanvisning','text']],
    defaults:{ word:'Appendiks', sub:'Dokumentasjon og referanser', imgHint:'Arrangementsbilde — scene, vidvinkel' } },

  { type:'fullbleed', cat:'Vedlegg', name:'Fullbredde', desc:'Skjermbilde eller foto i full bredde med billedtekst.',
    fields:[['eyebrow','Eyebrow','text'],['title','Tittel','text'],['caption','Billedtekst','area'],['img','Bilde','image'],['imgHint','Bildeanvisning','text']],
    defaults:{ eyebrow:'Plattform', title:'Good Game Arena',
      caption:'Turneringsplattformen som driver Komplettligaen, Bedriftsligaen og øvrige turneringer.',
      imgHint:'Skjermbilde — turneringsoversikt i full bredde' } }
];

export const CATEGORIES = ['Åpning','Økosystem','Bevis','Kommersielt','Avslutning','Vedlegg'];

/* ---------- casebasen ----------
   Én case, ett sted. Merkingen «tiers» sier hvilke prisnivåer casen kan brukes på;
   rekkefølgen per nivå settes i admin. En case velges inn i en slide som en kopi,
   slik at senere endringer i basen ikke rører pitcher som er sendt. */
export const CASE_FIELDS = [
  ['kicker', 'Kicker'], ['title', 'Tittel'], ['text', 'Beskrivelse'],
  ['client', 'Kunde'], ['year', 'Årstall'], ['result', 'Resultat'], ['img', 'Bilde'], ['brand', 'Merkevare']
];

export const CASES = [
  { id:'c-launch', kicker:'Produktlansering', title:'Én kampanjeuke på Gamer.no', text:'Takeover, native artikkel og socials i samme uke. Alt målt mot ett tydelig mål.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['single'] },
  { id:'c-tourday', kicker:'Turneringsdag', title:'Synlighet rundt sending', text:'Merkevaren eksponeres i en enkelt sending med bumpere og omtale i studio.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['single'] },
  { id:'c-always', kicker:'Alltid til stede', title:'Display gjennom hele sesongen', text:'Kontinuerlig eksponering på Gamer.no gjennom sesongen, med frekvens mot en dedikert gamingmålgruppe.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['t1'] },
  { id:'c-native', kicker:'Redaksjonelt', title:'To native artikler', text:'Innhold produsert av redaksjonen, distribuert i kanalene der publikummet allerede er.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['t1'] },
  { id:'c-broadcast', kicker:'Broadcast', title:'Logo i sending', text:'Fast plassering i sendingsgrafikk gjennom seriespillet.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['t1'] },
  { id:'c-league', kicker:'Ligaintegrasjon', title:'Del av selve konkurransen', text:'Merkevaren knyttes til en liga gjennom sesongen, ikke bare til flatene rundt den.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['t2'] },
  { id:'c-product', kicker:'Produktplassering', title:'Produktet i studio', text:'Fysisk tilstedeværelse i sending og i hendene på spillerne.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['t2'] },
  { id:'c-playoffs', kicker:'Playoffs', title:'Toppen av sesongen', text:'Ekstra synlighet i den perioden med høyest seertall og mest oppmerksomhet.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['t2'] },
  { id:'c-carepack', kicker:'Care package', title:'Produktet i hendene på lagene', text:'Fysisk pakke til alle påmeldte lag. Unboxing deles organisk i sosiale kanaler.', client:'', year:'', result:'', img:'', brand:'bl', tiers:['t3'] },
  { id:'c-creator', kicker:'Creator', title:'Én creator-aktivering', text:'Samarbeid med en creator fra økosystemet, produsert og distribuert av oss.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['t3'] },
  { id:'c-gull', kicker:'Gamer Gull', title:'Fordel på bransjens kveld', text:'Eksponering mot bransje og publikum i én kveld med konsentrert oppmerksomhet.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['t3'] },
  { id:'c-named', kicker:'Navngitt eierskap', title:'Ligaen bærer navnet', text:'Merkevaren står i navnet på liga eller segment, i all kommunikasjon gjennom året.', client:'', year:'', result:'', img:'', brand:'komplett', tiers:['t4'] },
  { id:'c-scandi', kicker:'Skandinavia', title:'Tre markeder, én avtale', text:'Samme posisjon i Norge, Sverige og Danmark, koordinert fra ett sted.', client:'', year:'', result:'', img:'', brand:'bl', tiers:['t4'] },
  { id:'c-production', kicker:'Dedikert produksjon', title:'Innhold laget for dere', text:'Egen produksjon gjennom sesongen, planlagt i et felles årshjul.', client:'', year:'', result:'', img:'', brand:'gamer', tiers:['t4'] }
];

export const MAX_TIER_CASES = 3;

export function caseById(cases, id) { return (cases || []).find(c => c.id === id) || null; }
export function casesForTier(cases, tierId) {
  return (cases || []).filter(c => !c.hidden && (c.tiers || []).includes(tierId));
}
/* kopien som legges inn i en slide. Ingen id — båndet til basen er bevisst kuttet. */
export function copyCase(c) {
  if (!c) return null;
  const out = { from: c.id };
  CASE_FIELDS.forEach(([k]) => { out[k] = c[k] == null ? '' : c[k]; });
  return out;
}
/* casene et prisnivå skal vise: admin-rekkefølgen først, ellers merkingen */
export function tierCaseSet(tier, cases) {
  const ids = (tier && tier.caseIds) || [];
  const picked = ids.map(id => caseById(cases, id)).filter(Boolean);
  const list = picked.length ? picked : casesForTier(cases, tier && tier.id);
  return list.slice(0, MAX_TIER_CASES).map(copyCase);
}

/* ---------- typografi: åpne skrifter fra Google Fonts ----------
   Hver oppføring er et par: én skrift til titler, én til brødtekst.
   Templaten setter valget. En pitch kan overstyre det, ellers arver den. */
const FONT_DEFS = [
  { id:'inter',   name:'Inter',                 note:'Nøytral grotesk. Standardvalget.',
    head:"'Inter'", body:"'Inter'",
    families:['Inter:wght@400;500;600;700;800;900'] },
  { id:'grotesk', name:'Space Grotesk / Inter', note:'Teknisk snert i titlene, rolig brødtekst.',
    head:"'Space Grotesk'", body:"'Inter'",
    families:['Space+Grotesk:wght@500;600;700','Inter:wght@400;500;600;700'] },
  { id:'archivo', name:'Archivo',               note:'Bred og journalistisk. Tåler store tall.',
    head:"'Archivo'", body:"'Archivo'",
    families:['Archivo:wght@400;500;600;700;800;900'] },
  { id:'sora',    name:'Sora / Inter',          note:'Geometrisk og moderne. Litt mer luft.',
    head:"'Sora'", body:"'Inter'",
    families:['Sora:wght@600;700;800','Inter:wght@400;500;600;700'] },
  { id:'oswald',  name:'Oswald / Inter',        note:'Smal og høylytt. Sport og esport.',
    head:"'Oswald'", body:"'Inter'",
    families:['Oswald:wght@500;600;700','Inter:wght@400;500;600;700'] },
  { id:'dm',      name:'DM Serif / DM Sans',    note:'Redaksjonell antikva mot ren grotesk.',
    head:"'DM Serif Display'", body:"'DM Sans'",
    families:['DM+Serif+Display','DM+Sans:wght@400;500;700'] }
];

export const FONTS = FONT_DEFS.map(f => ({
  ...f,
  headStack: f.head + ',system-ui,sans-serif',
  bodyStack: f.body + ',system-ui,sans-serif',
  url: 'https://fonts.googleapis.com/css2?' + f.families.map(x => 'family=' + x).join('&') + '&display=swap'
}));

/* ---------- flate: mørk eller lys. Tokenene settes som variabler på wrapperen,
   slidene leser dem, og fallback er den mørke verdien de alltid har hatt. ---------- */
export const SURFACES = {
  dark:  { id:'dark',  label:'Mørk',   paper:'#1B1826', ink:'#FFFFFF', inkSoft:'#C9C4D6', inkBody:'#E4E1EC',
           inkMute:'#8E88A3', plate:'#23202F', rule:'#302B3F', mix:'#FFFFFF' },
  beige: { id:'beige', label:'Beige',  paper:'#EAE4D6', ink:'#16131F', inkSoft:'#413A4E', inkBody:'#241F30',
           inkMute:'#6B6577', plate:'#F5F1E7', rule:'#D6CDBB', mix:'#16131F' }
};
export function surfaceOf(meta, tpl) {
  const id = (meta && meta.surface) || (tpl && tpl.surface) || 'dark';
  return SURFACES[id] || SURFACES.dark;
}
export function surfaceVars(sf) {
  return { '--paper': sf.paper, '--ink': sf.ink, '--ink-soft': sf.inkSoft, '--ink-body': sf.inkBody,
    '--ink-mute': sf.inkMute, '--plate2': sf.plate, '--rule': sf.rule, '--mix': sf.mix };
}

export const DEFAULT_FONT = 'inter';
export function fontById(id) { return FONTS.find(f => f.id === id) || FONTS[0]; }
/* pitchen vinner over templaten; uten valg noe sted brukes standard */
export function resolveFont(meta, tpl) {
  return fontById((meta && meta.font) || (tpl && tpl.font) || DEFAULT_FONT);
}

/* ---------- templates: data, ikke kode ---------- */
export const TEMPLATES = [
  { id:'master', name:'Master', lang:'no', desc:'Fullt løp. Bygger et premiss, dokumenterer det, og lander på en pris. Til reelle møter med tid.',
    blocks:['cover','umbrella','statement','brand','brand','brand','table','matrix','tiers','configurator','adrates','timeline','logowall','next','closing','divider','fullbleed'],
    brands:{ 3:'gamer', 4:'komplett', 5:'bl' } },
  { id:'simple', name:'Forenklet', lang:'no', desc:'Kald kontakt og oppfølging. Påstår heller enn å argumentere — hvem vi er, hva det koster, hva som skjer videre.',
    blocks:['cover','umbrella','brand','metrics','configurator','next','closing'], brands:{ 2:'gamer' } },
  { id:'media', name:'Mediekjøp', lang:'no', desc:'Ren annonsepitch mot Gamer.no. Publikum, formater, CPM og innholdsmarkedsføring — ingen ligapartnerskap.',
    blocks:['cover','brand','metrics','adrates','showcase','logowall','next','closing'], brands:{ 1:'gamer' } },
  { id:'blank', name:'Fra bunnen', lang:'no', desc:'Bare forside og avslutning. Bygg resten selv fra biblioteket.',
    blocks:['cover','closing'], brands:{} },
  { id:'catalog', name:'Blokkatalog', lang:'no', desc:'Én slide av hver blokktype i biblioteket, i standardutforming. Til gjennomgang — slett de du ikke vil bruke, så har du et løp.',
    blocks:['cover','spotlight','statement','umbrella','brand','pillars','metrics','table','matrix','benchmark','audience','showcase','proof','frames','placement','case','cases','logowall','tiers','configurator','adrates','invest','options','homebase','timeline','next','closing','divider','fullbleed'],
    brands:{ 4:'gamer' } },

  /* Engelsk løp bygget på HEROIC × Malta-forslaget. Innholdet ligger på radene,
     så løpet bruker husets egne blokktyper i stedet for egne utforminger. */
  { id:'malta', name:'Nasjonspartnerskap', lang:'en', accent:'#C8143C', surface:'beige',
    desc:'English national-partnership run. Organisation, audience, the four fronts of the deal, investment. Built from the HEROIC × Malta proposal.',
    brands:{},
    blocks:[
      { type:'cover', title:'Cover', img:'mt-cover', data:{
        kicker:'', title:'HEROIC × GamingMalta',
        sub:"The World's First Esports Nation Partnership",
        note:'A proposal for GamingMalta and the Government of Malta',
        imgHint:'Team photo — players on stage, wide' } },

      { type:'showcase', title:'About HEROIC', img:'mt-lineup', data:{
        eyebrow:'About HEROIC', title:'A top tier organization, built to compete at the highest level.',
        body:['15+ Championships', 'Competing in global sold out arenas', 'Millions watching, every match'],
        imgHint:'Team lineup on stage' } },

      { type:'benchmark', title:'The numbers', img:'mt-crowd', data:{
        eyebrow:'The numbers', title:'Reach that stands up to sport’s biggest names',
        imgHint:'Photo — crowd at a live event',
        stats:[
          { value:'460M', label:'Impressions in 2025' },
          { value:'2M+',  label:'Followers, org & players' },
          { value:'60+',  label:'Tournaments attended' },
          { value:'930M', label:'Peak viewers, 365 days' },
          { value:'40M+', label:'Hours watched, 365 days' }
        ],
        barLabel:'Engagement rate',
        rows:[
          { name:'Borussia Dortmund',    value:'5.49%', logo:'images/malta/club-dortmund.png' },
          { name:'HEROIC',               value:'5.12%', logo:'images/malta/club-heroic.png', hi:true },
          { name:'Golden State Warriors',value:'5.07%', logo:'images/malta/club-warriors.png' },
          { name:'FC Inter',             value:'4.44%', logo:'images/malta/club-inter.png' },
          { name:'Manchester United',    value:'3.91%', logo:'images/malta/club-manutd.png' },
          { name:'FaZe Clan',            value:'3.48%', logo:'images/malta/club-faze.png' }
        ],
        source:'HEROIC out-engages Man United, FaZe Clan, Inter, and the Warriors — and sits within a fraction of Dortmund, a club with over a century’s head start.' } },

      { type:'audience', title:'Who is watching', data:{
        eyebrow:"Who's watching", title:'CS2 audience',
        genderLabel:'Gender',
        gender:[{ value:'81%', label:'Male' }, { value:'14%', label:'Female' }, { value:'5%', label:'Other' }],
        ageLabel:'Core demo',
        age:[{ value:'40%', label:'Aged 18–24' }, { value:'46.6%', label:'Aged 25–34' }],
        big:'1M', bigLabel:'Followers across players and channels',
        marketLabel:'Top markets',
        markets:[{ value:'12.1%', label:'USA' }, { value:'7.2%', label:'Nordics' }, { value:'4.2%', label:'Germany' }],
        source:'' } },

      { type:'showcase', title:'CS2 roster', img:'mt-celebration', data:{
        eyebrow:'HEROIC CS2', title:'From dark horse to title contender',
        body:[
          'Fresh ambitions. Already in motion.',
          "HEROIC's CS2 roster has undergone major overhaul, bringing in world-famous star power alongside the team's core talent.",
          'The rebuild is built for one purpose: taking HEROIC from dark horse to genuine title contender.'
        ],
        imgHint:'Team celebration' } },

      { type:'pillars', title:'The opportunity', data:{
        title:'The opportunity',
        lead:'Malta becomes the operational and spiritual home of a Tier 1 esports organization.',
        sub:"This isn't a logo-on-a-jersey deal. It's a structural partnership across four fronts:",
        cards:[
          { img:'', head:'Marketing', text:'HEROIC becomes the face of Malta as a destination, on and off the server', align:'top', imgHint:'Portrait — player in kit' },
          { img:'', head:'B2B & Industry', text:'HEROIC’s leadership carries the “Malta is the esports hub” message onto the industry’s biggest stages', align:'bottom', imgHint:'Crest detail on fabric' },
          { img:'', head:'Grassroots', text:'Maltese kids get a direct line into professional esports', align:'top', imgHint:'Esports classroom — rows of PCs' },
          { img:'', head:'Corporate presence', text:'HEROIC relocates its operating base to Malta, becoming the first Tier 1 esports team headquartered on the island', align:'bottom', imgHint:'Stage talk to an audience' }
        ] } },

      { type:'proof', title:'Proof of performance', data:{
        eyebrow:'Track record', title:'Proof of performance',
        sub:'Two recent partnerships, real numbers.',
        note:"Beyond these two, HEROIC's campaign track record includes: Red Bull talent campaign (149M+ reach, $800K brand value), Wolt awareness campaign (18.2M impressions, $588K brand value), Acer production & paid (19M views, 336K link clicks), and the Esports World Cup x Prime launch event (280+ guests, 21M+ followers reached, 400+ organic posts).",
        cases:[
          { img:'', tag:'Razed', caption:'Partnership Launch Brand activation campaign', when:'Sep–Dec 2025', side:'left', rot:-3, imgHint:'Portrait — Razed',
            stats:[
              { value:'141.2M+', label:'Estimated total reach' },
              { value:'11.1M+',  label:'Engagements' },
              { value:'55.7M+',  label:'Live tournament impressions' },
              { value:'$1.9M+',  label:'Brand value created' }
            ] },
          { img:'', tag:'Loaded', caption:'Active Partner Campaign run:', when:'Jan–Nov 2025', side:'right', rot:3, imgHint:'Portrait — Loaded',
            stats:[
              { value:'20M+',   label:'Estimated total reach' },
              { value:'635K+',  label:'Engagements' },
              { value:'32.3M+', label:'Live tournament impressions' },
              { value:'$300K+', label:'Brand value created' }
            ] }
        ] } },

      { type:'frames', title:'Ambassadors', data:{
        eyebrow:'Ambassadors', title:'The faces of the partnership',
        sub:'More ambassadors to be announced this month.',
        items:[
          { img:'', tag:'@Martinsire (Martin)', caption:"HEROIC's in-house short-form talent", rot:-6, imgHint:'Portrait — Martin' },
          { img:'', tag:'@Wabisabii', caption:'One of the fastest-growing Counter-Strike creators in the scene', rot:3, imgHint:'Portrait — Wabisabii' },
          { img:'', tag:'@Tynka', caption:'', rot:-2, imgHint:'Portrait — Tynka' }
        ] } },

      { type:'showcase', title:'Marketing partnership', img:'mt-lineup', data:{
        eyebrow:'Marketing partnership', title:"GamingMalta's most visible asset in competitive gaming",
        body:[
          "Jersey integration on HEROIC's pro CS2 kit — worn at every official match, LAN, and Major",
          'GamingMalta named Official Destination & National Partner of HEROIC',
          "A dedicated announcement video and ongoing social promotion across HEROIC's channels",
          "Placement carries across match broadcasts, VODs, player streams, and HEROIC's own content"
        ],
        imgHint:'Jersey mockup — partner logo on pro CS2 kit' } },

      { type:'showcase', title:'Content & destination', img:'mt-island', data:{
        eyebrow:'Content', title:'Malta sells itself once people actually see it.',
        body:[
          'Short-form video series and team vlogs filmed on the island — an area where HEROIC leads: bootcamp life, behind-the-scenes, player personalities',
          'Content built to travel outside the esports bubble, into travel and lifestyle feeds'
        ],
        imgHint:'Content still — bootcamp life on the island' } },

      { type:'showcase', title:'B2B positioning', img:'mt-industry', data:{
        eyebrow:'B2B & industry positioning', title:"Malta's pitch to the industry",
        body:['Delivered by an organization the industry already trusts'],
        imgHint:'Industry event — stage or booth, wide' } },

      { type:'statement', title:'Grassroots', data:{
        eyebrow:'Grassroots: overview',
        text:'Long-term relevance is built at home, not just on broadcast.',
        attribution:'A sponsorship that only shows up on a jersey has a shelf life. One that builds the next generation of Maltese talent has a legacy.' } },

      { type:'fullbleed', title:'Grassroots imagery', img:'mt-facility', data:{
        eyebrow:'Grassroots', title:'On the island',
        caption:'Local play, local talent, local venues.',
        imgHint:'Split image — grassroots play and island location' } },

      { type:'homebase', title:'Malta as home base', img:'mt-homebase', data:{
        kicker:'Corporate restructure:', title:'Malta as home base',
        tag:"The world's first Tier 1 esports team, based in Malta",
        points:[
          'HEROIC becomes the first Tier 1 esports organization headquartered in Malta',
          'Relocation of select staff to the island',
          'A HEROIC corporate entity established and tax-resident in Malta'
        ],
        askLabel:'The ask:',
        ask:"Application of Malta's Highly Qualified Persons (HQP) tax scheme to relocating staff — an existing incentive, no new legislation required.",
        askEmph:'In exchange, Malta gets a live case study: a global esports brand that chose to build here, not just advertise here.',
        imgHint:'Photo — team facility, wide' } },

      { type:'invest', title:'Deliverables & investment', data:{
        eyebrow:'Partnership', title:'Partnership deliverables & investment',
        sub:'What GamingMalta gets. What it costs.',
        rows:[
          { label:'Marketing', items:[
            'Jersey integration',
            'Partnership launch (announcement video, PR push)',
            'Branding integration into all HEROIC and HEROIC player social media channels'
          ] },
          { label:'Content', items:[
            'x8 short form videos as part of an overall series highlighting Malta as both a go to travel destination and the esports hub of Europe',
            'x2 team long form videos integrating Malta (the team sees the sites, enjoys the country, trivia about the island etc)'
          ] },
          { label:'B2B', items:[
            'CEO / Senior staff presence at industry conferences presenting the HEROIC story of coming to Malta, as well as highlighting our experience with Malta as a hub and destination both for business and esports. We will commit to a minimum of 4 events per year.'
          ] },
          { label:'Grassroots', items:[
            'Up to x2 school / university visits per year, with HEROIC staff talking about opportunities for careers in esports',
            'Establishment of HEROIC x Malta esports academy.'
          ] }
        ],
        amountLabel:'Annual investment', amount:'$1M', unit:'usd per year',
        note:'Potentially to be discussed further' } },

      { type:'options', title:'Additional opportunities', data:{
        eyebrow:'Beyond the annual partnership',
        titleTop:'Additional', titleAccent:'Opportunities',
        intro:'',
        cards:[
          { head:'Bootcamp investment',
            text:'HEROIC as an investor in establishing and marketing a dedicated Malta bootcamp facility, acting as lead advisor on setup.',
            tag:'Pricing scoped separately' },
          { head:'Corporate esports league',
            text:"A Malta-based corporate league, positioning the island's business community inside the esports narrative it's funding.",
            tag:'' }
        ],
        source:'' } },

      { type:'closing', title:'Close', img:'mt-crowd', data:{
        text:"Malta doesn't need to claim it's an esports hub. It can own one.",
        contact:'', imgHint:'Closing image — players on stage, wide' } }
    ] }
];

/* ---------- hjelpere ---------- */
export const nf = n => new Intl.NumberFormat('nb-NO').format(Math.round(n));
export const uid = () => Math.random().toString(36).slice(2, 9);
export const slugify = s => String(s || 'pitch').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[æ]/g,'ae').replace(/[ø]/g,'o').replace(/[å]/g,'a')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'pitch';

export function readableInk(hex) {
  const h = String(hex || '#000').replace('#', '');
  const n = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(n.substr(i, 2), 16) / 255);
  const f = c => (c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4));
  return .2126 * f(r) + .7152 * f(g) + .0722 * f(b) > .45 ? '#12101A' : '#FFFFFF';
}

export function blockDef(type) { return LIBRARY.find(b => b.type === type); }

/* ---------- slide-biblioteket: data, ikke kode ----------
   store.library eier navn, beskrivelse, kategori, felter og standardinnhold.
   «base» peker på utformingen i koden — den er det eneste som ikke kan endres fra admin. */
export function seedLibrary() {
  return LIBRARY.map(b => ({
    type: b.type, base: b.type, name: b.name, cat: b.cat, desc: b.desc,
    fields: JSON.parse(JSON.stringify(b.fields || [])),
    defaults: JSON.parse(JSON.stringify(b.defaults || {})),
    prevDefaults: JSON.parse(JSON.stringify(b.defaults || {})),
    seedDefaults: JSON.parse(JSON.stringify(b.defaults || {})),
    /* plassering: tomt betyr utformingens egen plassering */
    layout: {}, prevLayout: {}, seedLayout: {},
    rev: 1, custom: false
  }));
}
export function libAll(library) {
  const list = (library || []).filter(b => b && b.fields);
  return list.length ? list : seedLibrary();
}
export function libEntry(library, type) {
  return libAll(library).find(b => b.type === type) || null;
}
/* utformingen en blokk skal rendres med */
export function blockBase(blk, library) {
  if (!blk) return '';
  if (blk.base) return blk.base;
  const e = libEntry(library, blk.type);
  return (e && e.base) || blk.type;
}
export function libCats(library) {
  const out = [...CATEGORIES];
  libAll(library).forEach(b => { if (b.cat && !out.includes(b.cat)) out.push(b.cat); });
  return out;
}

export function makeBlock(type, over, library) {
  const def = libEntry(library, type) || blockDef(type);
  const brandKey = over && over.brand;
  const content = (def && def.base) === 'brand' && brandKey && BRAND_CONTENT[brandKey] ? BRAND_CONTENT[brandKey] : null;
  return {
    id: uid(), type, base: (def && def.base) || type, rev: (def && def.rev) || 1,
    data: JSON.parse(JSON.stringify({ ...(def ? def.defaults : {}), ...(content || {}), ...(over || {}) })),
    /* plasseringen kopieres inn ved opprettelse. Senere flytting i pitchen er lokal,
       og biblioteket når den bare gjennom «hent ny versjon». */
    layout: JSON.parse(JSON.stringify((def && def.layout) || {}))
  };
}

/* Hvor mye av det levende laget bak som slipper gjennom slidens grunnflate.
   «auto» er husets standard: mye på forside og skille, et anstrøk på innholdsslidene. */
export const VEILS = { auto: null, tett: 1, lett: 0.9, middels: 0.72, apen: 0.5 };
export const VEIL_LABELS = { auto: 'Auto', tett: 'Tett', lett: 'Lett', middels: 'Middels', apen: 'Åpen' };
export function veilBg(veil, isHero, ambientOn) {
  if (!ambientOn) return '#1B1826';
  const a = VEILS[veil || 'auto'];
  const alpha = a == null ? (isHero ? 0.34 : 0.55) : a;
  return 'rgba(27,24,38,' + alpha + ')';
}

/* utformingene der elementene kan flyttes, skaleres og skjules */
export const MOVABLE_BASES = ['cover', 'umbrella', 'statement', 'brand', 'metrics', 'membership', 'table', 'matrix',
  'showcase', 'case', 'cases', 'tiers', 'configurator', 'adrates', 'placement', 'timeline',
  'logowall', 'next', 'fullbleed', 'closing', 'divider', 'benchmark', 'audience', 'spotlight', 'frames', 'proof', 'pillars',
  'briefing', 'activation', 'partnership', 'formation', 'productscene'];
export function canMove(base) { return MOVABLE_BASES.includes(base); }

/* en slide er tom for egne plasseringer når ingenting er flyttet, skalert eller skjult */
export function layoutCount(layout) {
  return Object.keys(layout || {}).filter(k => {
    const v = (layout || {})[k] || {};
    return v.hidden || (v.x || 0) !== 0 || (v.y || 0) !== 0 || (v.s || 1) !== 1;
  }).length;
}

/* Henter inn ny versjon av standardinnholdet. Verdier selgeren har endret står,
   resten følger biblioteket. Returnerer hva som ble tatt og hva som ble beholdt. */
export function refreshBlock(blk, def) {
  if (!blk || !def) return { taken: 0, kept: 0 };
  const next = def.defaults || {};
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  /* «urørt» måles mot forrige standard og mot den opprinnelige — ellers ville en serie
     små redigeringer i admin gjort at ingenting lenger regnes som urørt */
  const untouched = (k, cur) => cur === undefined
    || same(cur, (def.prevDefaults || {})[k]) || same(cur, (def.seedDefaults || {})[k]);
  let taken = 0, kept = 0;
  Object.keys(next).forEach(k => {
    const cur = blk.data[k];
    if (untouched(k, cur)) {
      if (!same(cur, next[k])) { blk.data[k] = JSON.parse(JSON.stringify(next[k])); taken++; }
    } else if (!same(cur, next[k])) kept++;
  });
  /* felter som er fjernet fra biblioteket ryddes bort */
  const keys = (def.fields || []).map(f => f[0]);
  Object.keys(blk.data).forEach(k => { if (keys.length && !keys.includes(k) && next[k] === undefined) delete blk.data[k]; });
  /* plasseringen følger samme regel: det selgeren selv har flyttet blir stående */
  {
    const nextL = def.layout || {};
    const curL = blk.layout || (blk.layout = {});
    const untouchedL = (k, cur) => cur === undefined
      || same(cur, (def.prevLayout || {})[k]) || same(cur, (def.seedLayout || {})[k]);
    Object.keys(nextL).forEach(k => {
      const cur = curL[k];
      if (untouchedL(k, cur)) {
        if (!same(cur, nextL[k])) { curL[k] = JSON.parse(JSON.stringify(nextL[k])); taken++; }
      } else if (!same(cur, nextL[k])) kept++;
    });
  }
  blk.base = def.base || blk.base;
  blk.rev = def.rev || 1;
  return { taken, kept };
}

/* templater lagrer blokker enten som type-streng (gammelt) eller som {type,title,brand} */
export function tplBlocks(t) {
  const brands = (t && t.brands) || {};
  return ((t && t.blocks) || []).map((b, i) => typeof b === 'string'
    ? { type: b, title: '', brand: brands[i] || '', img: '', caseId: '', layout: {}, data: null }
    : { type: b.type, title: b.title || '', brand: b.brand || '', img: b.img || '', caseId: b.caseId || '', layout: b.layout || {}, data: b.data || null });
}

/* ---------- bildebasen er fasit ---------- */
/* En template lagrer bare en referanse. Finnes den ikke i bildebasen lenger,
   blir den droppet — ellers kan et slettet bilde snike seg inn igjen via templaten. */
export function galleryImg(ref, images) {
  if (!ref || !images) return '';
  const hit = images.find(im => im.id === ref) || images.find(im => im.src === ref);
  return hit ? hit.src : '';
}
export function inGallery(ref, images) { return !!galleryImg(ref, images); }

export function makePitchFromTemplate(tpl, meta, images, library, cases, noFill) {
  const t = tpl || TEMPLATES[0];
  /* et bilde fra en avslått mappe (f.eks. Logoer) skal aldri følge med fra templaten
     inn i en ny pitch — logoer er logoflater, ikke bildeflater */
  const skipCats = noFill || NOFILL_CATS;
  const allowed = ref => {
    const rec = (images || []).find(im => im.id === ref) || (images || []).find(im => im.src === ref);
    return rec ? !skipCats.includes(rec.cat) : false;
  };
  return {
    $schema: VERSION.schema,
    id: uid(),
    meta: {
      client: 'Ny kunde', slug: 'ny-kunde', logo: null, logoPlate: 'light', accent: '#1434CB',
      lang: t.lang || 'no', owner: 'Sindre', subtitle: 'Partnerskapsforslag 2026',
      created: new Date().toISOString().slice(0, 10), template: t.id,
      factsVersion: VERSION.facts, status: 'kladd', ...meta
    },
    blocks: tplBlocks(t).map(b => {
      const blk = makeBlock(b.type, b.brand ? { brand: b.brand } : null, library);
      /* templaten kan bære sin egen kopi — den legges oppe på bibliotekets standard,
         slik at et ferdig løp som Malta ikke krever egne blokktyper */
      if (b.data) Object.assign(blk.data, JSON.parse(JSON.stringify(b.data)));
      if (b.title) blk.label = b.title;
      const img = allowed(b.img) ? galleryImg(b.img, images) : '';
      if (img) blk.data.img = img;
      else if (blk.data.img && !allowed(blk.data.img)) blk.data.img = '';
      /* casen kopieres inn ved opprettelse — senere endringer i basen rører ikke pitchen */
      const c = b.caseId ? copyCase(caseById(cases, b.caseId)) : null;
      if (c) Object.keys(c).forEach(k => { if (k !== 'from' && c[k] !== '') blk.data[k] = c[k]; });
      if (c) blk.data.case = b.caseId;
      /* templaten kan flytte elementer selv — den plasseringen følger med inn i pitchen */
      if (b.layout) blk.layout = JSON.parse(JSON.stringify({ ...(blk.layout || {}), ...b.layout }));
      return blk;
    }),
    overrides: []
  };
}

export function makePitch(meta, templateId, images, library, cases, noFill) {
  return makePitchFromTemplate(TEMPLATES.find(t => t.id === templateId), meta, images, library, cases, noFill);
}

/* ---------- statverdi: fra facts hvis referert, ellers fritekst ---------- */
export function statValue(st, facts) {
  if (st && st.fact && facts[st.fact]) {
    const f = facts[st.fact];
    return { value: st.value != null ? st.value : f.value, label: st.label || f.label, source: f.source, locked: st.value == null, fact: st.fact };
  }
  return { value: st ? st.value : '', label: st ? st.label : '', source: st ? st.source : '', locked: false, fact: null };
}

/* ---------- bilder inn i pitchen ---------- */
export function hasImageSlot(type, library) {
  const d = libEntry(library, type) || blockDef(type);
  return !!(d && (d.fields || []).some(f => f[2] === 'image'));
}

/* Fyller tomme bildefelt fra bildebasen. Samme bilde gjentas ikke før poolen er tom.
   Referanser som ikke finnes i basen regnes som tomme og blir fylt på nytt. */
export function applyImageProfile(pitch, images, cat, force, library, noFill) {
  const all = images || [];
  const skip = noFill || NOFILL_CATS;
  const pool = all.filter(im => !skip.includes(im.cat) && (!cat || cat === 'Alle' || im.cat === cat));
  let n = 0;
  pitch.blocks.forEach(b => {
    if (!hasImageSlot(b.type, library)) return;
    if (b.data.img && !inGallery(b.data.img, all)) b.data.img = '';
    if (b.data.img && !force) return;
    if (!pool.length) return;
    b.data.img = pool[n % pool.length].src;
    n++;
  });
  return pitch;
}

/* Rydder døde bildereferanser i en hel pitch — kjøres når en pitch åpnes. */
export function pruneImages(pitch, images) {
  let dropped = 0;
  (pitch.blocks || []).forEach(b => {
    if (b.data && b.data.img && !inGallery(b.data.img, images)) { b.data.img = ''; dropped++; }
  });
  return dropped;
}

/* Logoveggen tok bare navn før. Nå kan hver rute ha logo, krone og en liten merknad. */
export function wallRows(list) {
  return (list || []).map(x => (typeof x === 'string'
    ? { text: x, img: '', crown: false, note: '' }
    : { text: x.text || '', img: x.img || '', crown: !!x.crown, note: x.note || '' }));
}
