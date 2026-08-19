/* Skagerrak Pitch Studio — grensesnittspråk.
   Studioet er skrevet på norsk. Ordboka her bytter grensesnittet til engelsk;
   pitchinnhold og faktabase røres ikke — der styrer templatens språkmerking.
   Nøkkel = den norske strengen slik den står i grensesnittet. Treff må være eksakt. */

export const LANGS = [{ id: 'no', label: 'NO', name: 'Norsk' }, { id: 'en', label: 'EN', name: 'English' }];

export const NO_EN = {
  /* ---- topplinje og navigasjon ---- */
  'Ny pitch': 'New pitch',
  '+ Ny pitch': '+ New pitch',
  'Kundeside': 'Client view',
  'Rediger': 'Edit',
  'Ta kontakt': 'Get in touch',
  'Åpne i Pitch Studio': 'Open in Pitch Studio',
  'Åpne kundeside': 'Open client view',
  'Åpne kundesiden': 'Open client view',
  'Åpner kundesiden på samme slide': 'Opens the client view on the same slide',
  'Tilbake til redigering på samme slide': 'Back to editing on the same slide',
  'Forrige seksjon': 'Previous section',
  'Neste seksjon': 'Next section',
  'Språk i grensesnittet': 'Interface language',

  /* ---- dashboard ---- */
  '↑ Importer pitch.json': '↑ Import pitch.json',
  'Hver pitch er én fil. Kunden ser bare sin egen lenke. Tall hentes fra faktabasen ved rendering, så en oppdatering slår gjennom i alle pitcher som ikke har låst opp feltet.':
    'Every pitch is one file. The client only ever sees their own link. Figures are pulled from the fact base at render time, so an update carries through to every pitch that has not unlocked the field.',
  'Ingen pitcher ennå. Start med «Ny pitch».': 'No pitches yet. Start with “New pitch”.',
  'Tom pitch': 'Empty pitch',
  'Dupliser': 'Duplicate',
  'Slett': 'Delete',
  'Fjern': 'Remove',
  'Ferdig': 'Done',
  'Avbryt': 'Cancel',
  'Lukk': 'Close',

  /* ---- ny pitch ---- */
  'Steg 1 · Kunden': 'Step 1 · The client',
  'Steg 2 · Løpet': 'Step 2 · The run',
  'Hvem er dette for?': 'Who is this for?',
  'Kundenavn': 'Client name',
  'Lenke kunden får': 'Link the client gets',
  'Kundelogo': 'Client logo',
  'Aksentfarge — foreslått fra logoen': 'Accent colour — suggested from the logo',
  'Avsender': 'Sender',
  'Bildeprofil': 'Image profile',
  'Velg utgangspunkt': 'Choose a starting point',
  'Opprett pitch': 'Create pitch',
  'Klikk for å laste opp kundelogo': 'Click to upload a client logo',
  'Kundelogo lastet opp': 'Client logo uploaded',

  /* ---- editor ---- */
  'Disposisjon': 'Outline',
  '+ Legg til blokk': '+ Add block',
  'Sett inn blokk her': 'Insert a block here',
  'Leveringssjekk': 'Delivery check',
  'Blokkbibliotek': 'Block library',
  'Innhold': 'Content',
  'Pitch': 'Pitch',
  'Hent inn': 'Pull in',
  '+ Legg til': '+ Add',
  '+ Legg til tall': '+ Add figure',
  '+ Linje': '+ Line',
  '+ Felt': '+ Field',
  'Velg fra bildebasen': 'Choose from the image base',
  'Velg bilde': 'Choose image',
  'Velg bilde for denne sliden': 'Choose an image for this slide',
  'Last opp': 'Upload',
  'Last opp nytt': 'Upload new',
  'Bytt bilde': 'Change image',
  'Bytt bilde for denne sliden': 'Change the image on this slide',
  'Fjern bildet': 'Remove the image',
  'Flytt opp': 'Move up',
  'Flytt ned': 'Move down',
  'Bakgrunn gjennom denne sliden': 'Background through this slide',
  'Dra elementer på sliden for å flytte dem. Hjørnet skalerer, den runde knotten roterer, Alt slår av snapping. Flytting her gjelder bare denne pitchen.':
    'Drag elements on the slide to move them. The corner scales, the round knob rotates, Alt turns off snapping. Moves here apply to this pitch only.',
  'Dra elementer for å flytte dem. Hjørnet skalerer, den runde knotten roterer, Alt slår av snapping.':
    'Drag elements to move them. The corner scales, the round knob rotates, Alt turns off snapping.',
  'Dra elementer for å flytte dem. Plasseringen følger med inn i nye pitcher fra denne templaten.':
    'Drag elements to move them. The placement carries into new pitches built from this template.',
  'Denne slidetypen støtter ikke flytting ennå. Innholdet redigeres i feltene til høyre.':
    'This slide type does not support moving yet. Edit the content in the fields on the right.',
  'Denne slidetypen støtter ikke flytting ennå. Innholdet redigeres i feltene under.':
    'This slide type does not support moving yet. Edit the content in the fields below.',
  'Denne slidetypen støtter ikke flytting ennå — her ser du bare hvordan sliden blir.':
    'This slide type does not support moving yet — this is just how the slide will look.',
  'Sliden vises med en eksempelkunde. Felter som settes per pitch står tomme her.':
    'The slide is shown with a sample client. Fields set per pitch are empty here.',
  'Full slide': 'Full slide',
  'Åpne full slide': 'Open full slide',
  'Åpne sliden i full størrelse og flytt elementene': 'Open the slide full size and move the elements',
  'Feltene under er en kopi. Endringer her påvirker bare denne pitchen.':
    'The fields below are a copy. Changes here affect this pitch only.',
  'Hent inn i alle slides i denne pitchen': 'Pull into every slide in this pitch',
  'Låst til faktabasen. Klikk for å overstyre.': 'Locked to the fact base. Click to override.',
  'Overstyrt. Klikk for å låse tilbake.': 'Overridden. Click to lock again.',
  'Tilbake til automatisk': 'Back to automatic',
  'Ingen bilde valgt': 'No image chosen',
  'Ingen case valgt': 'No case chosen',
  'Fjern casen': 'Remove the case',
  'Casen finnes ikke i basen lenger': 'The case is no longer in the base',
  'Velg en case fra basen': 'Choose a case from the base',
  'Uten tittel': 'Untitled',
  'Slett varianten': 'Delete the variant',
  'Ny variant': 'New variant',
  'Nytt format': 'New format',
  'Ny flate': 'New surface',
  'Ny aktivitet': 'New activity',
  'Ny linje': 'New line',
  'Ny pakke': 'New package',
  'Nytt felt': 'New field',
  'Nytt navn': 'New name',
  'Rute': 'Cell',
  'Krone av': 'Crown off',
  'Foreløpig': 'Provisional',
  'Glød': 'Glow',
  'Hårstrek': 'Hairline',
  'Mørk': 'Dark',
  'Åpen': 'Open',
  'Auto': 'Auto',
  'Tett': 'Dense',
  'Lett': 'Faint',
  'Middels': 'Medium',

  /* ---- pitchinnstillinger ---- */
  'Logoen nederst på forside og avslutning. Kontaktlinja på takk-sliden hentes herfra — e-post og telefon settes i Admin.':
    'The logo at the foot of the cover and closing slides. The contact line on the thank-you slide comes from here — email and phone are set in Admin.',
  'Ingen logo lastet opp': 'No logo uploaded',
  'Fyll alle bildeflater på nytt': 'Refill every image surface',
  'Logoflate': 'Logo plate',
  'Hvit logo forsvinner på hvit flate. Sjekk visuelt på forsiden.':
    'A white logo disappears on a white plate. Check it on the cover.',
  'Aksentfarge': 'Accent colour',
  'Typografi': 'Typography',
  'Flate': 'Surface',
  'Mørk': 'Dark',
  'Beige': 'Beige',
  'Mørk flate — husets standard.': 'Dark surface — the house default.',
  'Lys flate. Bilder og aksentflater står som de er, tekst og skillelinjer snus til mørkt blekk.':
    'Light surface. Photos and accent panels stay as they are; text and rules flip to dark ink.',
  'Følger templaten. Endres skriften på templaten, følger denne pitchen etter.':
    'Follows the template. Change the typeface on the template and this pitch follows.',
  'Følg template': 'Follow template',
  'Skrift': 'Typeface',
  'Skriften hele templaten settes i. Hver pitch kan overstyre den under Utseende.':
    'The typeface the whole template is set in. Each pitch can override it under Appearance.',
  'Overstyrer templatens skrift for denne pitchen. Titler og brødtekst byttes sammen.':
    'Overrides the template typeface for this pitch. Headings and body text change together.',
  'Fargeforløp på bilder': 'Gradient on photos',
  'Fargeforløp på bildene': 'Gradient on the photos',
  'Følg pitchen': 'Follow the pitch',
  'På her': 'On here',
  'Forløp på denne sliden': 'Gradient on this slide',
  'Av her': 'Off here',
  'Av': 'Off',
  'På': 'On',
  'Vinkel': 'Angle',
  'Utstrekning': 'Reach',
  'Styrke': 'Strength',
  'Forløpet legges over alle bilder i pitchen, i aksentfargen. Vinkel er retningen, utstrekning hvor langt inn i bildet det når, styrke hvor tett fargen ligger.':
    'The gradient sits over every photo in the pitch, in the accent colour. Angle is the direction, reach how far into the photo it carries, strength how dense the colour is.',
  'Legger et forløp i aksentfargen over bildene, slik at de knyttes til kundens farge.':
    'Lays a gradient in the accent colour over the photos, tying them to the client colour.',
  'Nøytral grotesk. Standardvalget.': 'Neutral grotesque. The default.',
  'Teknisk snert i titlene, rolig brødtekst.': 'Technical edge in the headings, calm body text.',
  'Bred og journalistisk. Tåler store tall.': 'Wide and editorial. Holds big figures well.',
  'Geometrisk og moderne. Litt mer luft.': 'Geometric and modern. A little more air.',
  'Smal og høylytt. Sport og esport.': 'Narrow and loud. Sport and esport.',
  'Redaksjonell antikva mot ren grotesk.': 'Editorial serif against a clean grotesque.',
  'Levende bakgrunn': 'Live background',
  'Intensitet': 'Intensity',
  'Visning': 'Presentation',
  'Ramme rundt sidene': 'Frame around the pages',
  'Underlag': 'Backdrop',
  'Undertittel': 'Subtitle',
  'Lenke': 'Link',
  'Status': 'Status',
  'Overstyrte tall': 'Overridden figures',
  'Ingen. Alle tall kommer fra faktabasen.': 'None. Every figure comes from the fact base.',
  'Ingen overstyrte tall': 'No overridden figures',
  '⎙ Eksporter PDF': '⎙ Export PDF',
  'Fem levende flater: bølgende punktgitter, heksagonringer som slår ut i flaten, et nettverk som driver, en tunnel av rammer, og et radarsveip. Alle følger aksentfargen, stopper når sliden er ute av synsfeltet, og står stille ved redusert bevegelse. Et bilde på sliden går foran bakgrunnen. Lett støv ligger på alle slides uansett valg.':
    'Five live surfaces: a rippling dot grid, hexagon rings breaking across the plane, a drifting network, a tunnel of frames, and a radar sweep. All follow the accent colour, stop when the slide leaves the viewport, and hold still under reduced motion. An image on the slide sits in front of the background. A light dust lies over every slide whatever you choose.',
  'Bakgrunnen går sammenhengende gjennom hele presentasjonen — sterkest på forside og skille, et anstrøk bak innholdsslidene.':
    'The background runs unbroken through the whole presentation — strongest on the cover and dividers, a trace behind the content slides.',
  'Stille flate gir samme mørke bakgrunn på alle slides.': 'A still plane gives every slide the same dark background.',
  'Stille flate': 'Still plane',
  'Rullingen låser seg til én side av gangen.': 'Scrolling locks to one page at a time.',
  'Sammenhengende rulling uten synlige sideskiller.': 'Continuous scrolling with no visible page breaks.',
  'Hver slide står som et eget ark med ramme og luft rundt': 'Each slide stands as its own sheet with a frame and air around it',
  'Slidene henger sammen som én rullende side': 'The slides run together as one scrolling page',
  'Så vidt merkbar — trygg bak tunge tallslides': 'Barely there — safe behind heavy figure slides',
  'Tydelig bevegelse — best på korte pitcher': 'Clear movement — best on short pitches',
  'Settes per pitch.': 'Set per pitch.',
  'Tall settes per pitch fra faktabasen.': 'Figures are set per pitch from the fact base.',

  /* ---- admin ---- */
  'Åtte datalag med tydelig eierskap. Alt her er delt: en endring slår gjennom i alle pitcher som ikke har låst opp feltet.':
    'Eight data layers with clear ownership. Everything here is shared: a change carries through to every pitch that has not unlocked the field.',
  'Tall og kilder': 'Figures and sources',
  'Et tall uten kilde er ikke salgbart. Endringer stemples med dato og forrige verdi havner i historikken.':
    'A figure without a source cannot be sold. Changes are stamped with a date and the previous value goes into the history.',
  'Verdier med kilde og dato': 'Values with source and date',
  '↓ Excel-ark': '↓ Excel sheet',
  '↑ Last opp oppdaterte tall': '↑ Upload updated figures',
  '+ Nytt tall': '+ New figure',
  'Nøkkel': 'Key',
  'Verdi': 'Value',
  'Etikett': 'Label',
  'Kilde': 'Source',
  'Kilde og dato': 'Source and date',
  'Kilde og dato — påkrevd': 'Source and date — required',
  'Ingen kilde — tallet er ikke salgbart uten.': 'No source — the figure cannot be sold without one.',
  'Sist endret': 'Last changed',
  'Rådata for utviklere': 'Raw data for developers',
  'Caser': 'Cases',
  'Casebasen, merket per prisnivå': 'The case base, tagged per price tier',
  'Én case, ett sted. Merkingen sier hvilke prisnivåer den kan brukes på. En case som velges inn i en slide blir kopiert, så senere endringer her rører ikke sendte pitcher.':
    'One case, one place. The tagging says which price tiers it can be used on. A case pulled into a slide is copied, so later changes here never touch pitches already sent.',
  'Basen': 'The base',
  '+ Ny case': '+ New case',
  'Ingen caser ennå.': 'No cases yet.',
  'Slett casen': 'Delete the case',
  'Prisnivåer': 'Price tiers',
  'Caser per prisnivå': 'Cases per price tier',
  'Maks tre. Uten valgt rekkefølge plukker sliden selv fra merkingen.':
    'Three at most. With no chosen order the slide picks from the tagging itself.',
  'nullstill': 'reset',
  'valgt rekkefølge': 'chosen order',
  'automatisk fra merkingen': 'automatic from the tagging',
  'ingen nivåer': 'no tiers',
  'ikke i bruk': 'not in use',
  'Slide-bibliotek': 'Slide library',
  'Slidene, feltene og standardinnholdet': 'The slides, the fields and the default content',
  'Navn, felter og standardinnhold. Endringer gir en ny versjon, som hver pitch selv kan hente inn.':
    'Names, fields and default content. A change makes a new version, which each pitch can pull in for itself.',
  'Slides': 'Slides',
  '+ Ny slide': '+ New slide',
  'Felter': 'Fields',
  'Nøkkelen binder feltet til utformingen. Endrer du den, mister feltet plassen sin på sliden.':
    'The key binds the field to the layout. Change it and the field loses its place on the slide.',
  'Standardinnhold': 'Default content',
  'Pitcher på en eldre versjon': 'Pitches on an older version',
  'Alle pitcher ligger på gjeldende versjon.': 'Every pitch is on the current version.',
  'Åpne →': 'Open →',
  'Når brukes denne sliden?': 'When is this slide used?',
  'Fjern feltet': 'Remove the field',
  'Slett fra biblioteket': 'Delete from the library',
  'Templates': 'Templates',
  'Ferdige stabler av blokker': 'Ready-made stacks of blocks',
  'Klikk en blokk i paletten for å legge den til. Dra eller bruk pilene for å endre rekkefølge, og gi hver slide sin egen tittel.':
    'Click a block in the palette to add it. Drag or use the arrows to reorder, and give each slide its own title.',
  '+ Ny template': '+ New template',
  'Palett': 'Palette',
  'Tom. Klikk i paletten.': 'Empty. Click in the palette.',
  'Gi nytt navn': 'Rename',
  'Slett template': 'Delete the template',
  'Casen kopieres inn når en pitch lages fra templaten': 'The case is copied in when a pitch is built from the template',
  'Språk': 'Language',
  'Språket templaten er skrevet på. Nye pitcher arver merkingen.': 'The language the template is written in. New pitches inherit the tag.',
  'Merkevare': 'Brand',
  'Logoer og produktfarger': 'Logos and product colours',
  'Hver logo vises på både mørk og lys flate, siden det er der feil oppdages.':
    'Every logo is shown on both a dark and a light plate, because that is where mistakes show up.',
  '+ Ny merkevare': '+ New brand',
  'Bytt logo': 'Change logo',
  'Optisk skala': 'Optical scale',
  'Produktfarge': 'Product colour',
  'Merknad — hva som er lett å gjøre feil': 'Note — what is easy to get wrong',
  'Slett merkevaren': 'Delete the brand',
  'Bilder': 'Images',
  'Bildebase med kategorier': 'Image base with categories',
  'Kategorien styrer hvilke bilder en pitch fylles med.': 'The category decides which images a pitch is filled with.',
  '+ Ny kategori': '+ New category',
  'Fyller bildeflater': 'Fills image surfaces',
  'Mapper som er av brukes aldri til å fylle bilderammer automatisk. De kan fortsatt velges manuelt.':
    'Folders switched off are never used to fill image frames automatically. They can still be chosen by hand.',
  'Ingen bilder i denne kategorien ennå.': 'No images in this category yet.',
  'Slett bildet': 'Delete the image',
  'Hvem pitchen kommer fra': 'Who the pitch comes from',
  'Hvem pitchen kommer fra. Logoen står nederst på forside og avslutning, på mørk flate.':
    'Who the pitch comes from. The logo sits at the foot of the cover and closing slides, on a dark plate.',
  '+ Ny avsender': '+ New sender',
  'Kontaktlinje på takk-sliden:': 'Contact line on the thank-you slide:',
  'Ingen kontaktinfo — takk-sliden står tom': 'No contact details — the thank-you slide is empty',
  'Bilde på takk-sliden': 'Image on the thank-you slide',
  'Velg takk-bilde': 'Choose thank-you image',
  'Bytt takk-bilde': 'Change thank-you image',
  'Slett avsender': 'Delete sender',
  'E-post': 'Email',
  'Telefon': 'Phone',
  'Nettsted eller annet': 'Website or other',
  'Prismodell': 'Price model',
  'Trapp, rabatter og lisens': 'Ladder, discounts and licence',
  'Prisene er faste. Rabatt gis gjennom avtalelengde og volum, aldri ved å forhandle ned nivået.':
    'Prices are fixed. Discount comes through contract length and volume, never by negotiating the tier down.',
  'Nivå': 'Tier',
  'Pris': 'Price',
  'Rekkevidde': 'Reach',
  'Plattformaktiveringer': 'Platform activations',
  'Lisens, ikke eksponering. Holdes utenfor CPM og medieverdi.':
    'A licence, not exposure. Kept out of CPM and media value.',
  'Rabatt og multiplikatorer': 'Discount and multipliers',
  'Salg og marked': 'Sales and marketing',
  'Klikk for å laste opp PNG eller SVG': 'Click to upload a PNG or SVG',
  'PNG med gjennomsiktig bakgrunn ser best ut på veggen': 'A PNG with a transparent background looks best on the wall',
  'Velg eller last opp logo': 'Choose or upload a logo',
  'Velg eller last opp mockup': 'Choose or upload a mockup',
  'Bytt mockup': 'Change mockup',
  'Bytt kundelogo': 'Change client logo',
  'Logo lastet opp — klikk for å bytte': 'Logo uploaded — click to change',
  'Eget opplastet bilde': 'Own uploaded image',
  'Bildet settes på sliden du redigerer': 'The image is set on the slide you are editing',
  'Bildet festes til raden i templaten': 'The image is pinned to the row in the template',
  'Bildet brukes på takk-sliden for denne avsenderen': 'The image is used on the thank-you slide for this sender',
  'Maks filstørrelse': 'Maximum file size',
  'Skjult — kan ikke velges': 'Hidden — cannot be chosen',
  'Synlig i velgerne': 'Visible in the pickers',
  'Størrelser': 'Sizes',
  'Sosiale kanaler': 'Social channels',
  'Fyller bare tomme flater. «Fyll på nytt» bytter alle bildene i pitchen til profilen.':
    'Fills empty surfaces only. “Refill” swaps every image in the pitch to the profile.',
  'Lys aksent — tekst på aksentflate settes automatisk til mørk.':
    'Light accent — text on an accent plate is set to dark automatically.',
  'Mørk aksent — hvit tekst på aksentflate. Sjekk at fargen også leses mot lys flate.':
    'Dark accent — white text on an accent plate. Check the colour also reads against a light plate.',

  /* ---- feltnavn i blokkbiblioteket ---- */
  'Kicker': 'Kicker',
  'Tittel': 'Title',
  'Beskrivelse': 'Description',
  'Resultat': 'Result',
  'Kunde': 'Client',
  'Årstall': 'Year',
  'Bilde': 'Image',
  'Bildeanvisning': 'Image direction',
  'Bildeanvisning for varianten': 'Image direction for the variant',
  'Mockup for varianten': 'Mockup for the variant',
  'Ledetekst (fet)': 'Lead-in (bold)',
  'Merkelapp — Display': 'Tag — Display',
  'Variantnavn — Toppbanner': 'Variant name — Top banner',
  'Varianttittel (valgfri)': 'Variant title (optional)',
  'Detaljer — ett punkt per linje': 'Details — one point per line',
  'Detaljer — vises når man peker på aktiviteten': 'Details — shown on hover over the activity',
  'Krone — vises når man peker på ruten': 'Crown — shown on hover over the cell',
  'Navn — vises når ruten er uten logo': 'Name — shown when the cell has no logo',
  'Etikett — summen regnes ut automatisk': 'Label — the sum is worked out automatically',
  'Tekst i rammen — gamer.no': 'Text in the frame — gamer.no',
  'URL i ramme': 'URL in frame',
  'Uthev linjen i årshjulet': 'Highlight the row in the year wheel',
  'Årshjulet har faktiske datoer, ikke generiske kvartaler': 'The year wheel has real dates, not generic quarters',
  'Resultat, f.eks. 4,2 mill. visninger': 'Result, e.g. 4.2m impressions',
  'Kontakt (tom = fra avsender)': 'Contact (empty = from sender)',
  'Når': 'When',
  'Åpning': 'Opening',
  'Økosystem': 'Ecosystem',
  'Økosystemet': 'The ecosystem',
  'Bevis': 'Proof',
  'Kommersielt': 'Commercial',
  'Avslutning': 'Closing',
  'Vedlegg': 'Appendix',
  'Slide': 'Slide',
  'Årshjul': 'Year wheel',
  'Neste steg': 'Next step',
  'Ekstra aktivering': 'Extra activation',
  /* nye slidetyper */
  'Fire fronter': 'Four fronts', 'Kort': 'Cards', 'Overskrift': 'Heading', 'Tekst': 'Text',
  'Tekst øverst': 'Text at the top', 'Tekst nederst': 'Text at the bottom',
  'Aksentflate med fire kort. Hvert kort har eget bilde, overskrift og tekst, og kan flyttes for seg.':
    'An accent plane with four cards. Each card has its own image, heading and text, and moves on its own.',
  'Dokumentasjon': 'Track record', 'Caser': 'Cases', 'Merkelapp — Razed': 'Tag — Razed',
  'Periode — Sep–Des 2025': 'Period — Sep–Dec 2025', 'Bilde til venstre': 'Image on the left', 'Bilde til høyre': 'Image on the right',
  'Helning i grader — -3': 'Tilt in degrees — -3',
  'To samarbeid med faktiske tall. Polaroid på hver sin side, fire tall hver, og en merknad øverst.':
    'Two partnerships with real numbers. A polaroid on each side, four figures each, and a note at the top.',
  'Sammenligning': 'Benchmark', 'Publikum': 'Audience', 'Blikkfang': 'Spotlight', 'Bilderammer': 'Photo frames',
  'Rammer': 'Frames', 'Ramme': 'Frame', 'Ramme 1': 'Frame 1', 'Ramme 2': 'Frame 2', 'Ramme 3': 'Frame 3',
  'Merkelapp — @navn': 'Tag — @name', 'Bildetekst': 'Caption', 'Helning i grader — -6': 'Tilt in degrees — -6',
  'Polaroider på tvers av flaten. Hver ramme flyttes og skaleres for seg, og har sitt eget bilde, merkelapp og bildetekst.':
    'Polaroids across the plane. Each frame moves and scales on its own, with its own image, tag and caption.',
  'Nøkkeltall': 'Key figures', 'Overskrift diagram': 'Chart heading', 'Rader': 'Rows',
  'Underlinje': 'Sub-line', 'Merknad': 'Note', 'Navn': 'Name', 'Rad': 'Row', 'Ny rad': 'New row',
  'Kjønn': 'Gender', 'Overskrift kjønn': 'Gender heading', 'Alder': 'Age', 'Overskrift alder': 'Age heading',
  'Stort tall': 'Headline figure', 'Etikett stort tall': 'Headline figure label',
  'Overskrift marked': 'Markets heading', 'Markeder': 'Markets',
  'Uthev raden': 'Highlight the row', 'Bytt logo': 'Change logo',
  'Verdi — 5,12 %': 'Value — 5.12%',
  'Nøkkeltall øverst, rangerte stolper med logo under. Til når tallet må måles mot noen.':
    'Key figures on top, ranked bars with logos below. For when the number has to be measured against someone.',
  'Demografi: kjønn, alder og markeder stilt opp rundt ett stort tall.':
    'Demographics: gender, age and markets set around one headline figure.',
  'Ett bilde midt på flaten med overskrift og underlinje. Til ansikter og produkter.':
    'One image centred on the plane with a headline and a sub-line. For faces and products.'
};

/* Fraser som bare finnes i dialogtekst, satt sammen i koden.
   Byttes som delstreng, lengste først, så «Slett» ikke spiser «Slett casen». */
export const PHRASES_NO_EN = {
  'Slette pitchen for ': 'Delete the pitch for ',
  'Nye tall må ha kilde:': 'New figures need a source:',
  'Faktabasen er oppdatert.': 'The fact base has been updated.',
  'Fant ingen rader med nøkkel i arket.': 'No rows with a key were found in the sheet.',
  'Filen har feil form. Forventet': 'The file has the wrong shape. Expected',
  'Det finnes allerede en case med samme tittel.': 'A case with that title already exists.',
  'Det finnes allerede en slide med id «': 'A slide already exists with the id “',
  'Fant ingen slide med id «': 'No slide found with the id “',
  'Kategorien finnes allerede.': 'That category already exists.',
  'Merkevaren finnes allerede.': 'That brand already exists.',
  'Nøkkelen finnes allerede.': 'That key already exists.',
  'Minst én avsender må finnes.': 'There must be at least one sender.',
  'Minst én merkevare må finnes.': 'There must be at least one brand.',
  'Minst én template må finnes.': 'There must be at least one template.',
  'Navn på ny template': 'Name for the new template',
  'Navn på den nye sliden': 'Name for the new slide',
  'Navn på ny kategori': 'Name for the new category',
  'Navn på merkevaren': 'Name of the brand',
  'Navn på avsender': 'Name of the sender',
  'Tittel på den nye casen': 'Title of the new case',
  'Nøkkel for det nye tallet, uten «': 'Key for the new figure, without “',
  'Hvilken utforming skal den bruke?': 'Which layout should it use?',
  'Utformingen må være en av: ': 'The layout must be one of: ',
  'Kopier felter og innhold fra hvilken slide? Skriv id, eller la stå tomt for en tom slide.':
    'Copy fields and content from which slide? Enter an id, or leave blank for an empty slide.',
  'Hvorfor overstyres «': 'Why is “',
  'Ingen egne endringer ble rørt.': 'No local changes were touched.',
  'Ny versjon av «': 'New version of “',
  'Slette «': 'Delete “',
  'Egendefinert template fra admin.': 'Custom template from admin.',
  'Ny slide fra admin.': 'New slide from admin.',
  'Kunne ikke lagre bildet': 'Could not save the image',
  'Casen er kopiert inn i ': 'The case is copied into ',
  'kopiert inn i ': 'copied into ',
  'Hentet inn ': 'Pulled in ',
  'Oppdaterte ': 'Updated ',
  'Den er i bruk på ': 'It is in use on ',
  ' slides. De står som de er. Slette den fra basen?': ' slides. They stay as they are. Delete it from the base?',
  ' slides — de faller tilbake til første merkevare.': ' slides — they fall back to the first brand.',
  '» fra bildebasen? Slides som bruker det blir stående tomme.':
    '” from the image base? Slides using it will be left empty.',
  'Tilbakestill plassering': 'Reset placement',
  'Tilbakestill alle': 'Reset all',
  'brukt i ': 'used in ',
  'brukt ': 'used ',
  'versjon ': 'version ',
  'Steg ': 'Step ',
  'Bygget mot gjeldende faktaversjon (': 'Built against the current fact version (',
  'Dekket har pris': 'The deck has a price',
  'Dekket har en ask (Neste steg)': 'The deck has an ask (Next step)',
  'Ingen placeholder-tekst (XXX, Lorem, TODO, TBD)': 'No placeholder text (XXX, Lorem, TODO, TBD)',
  'Alle tall har kilde': 'Every figure has a source',
  ' slide': ' slide',
  ' år': ' yr'
};

/* Etiketter som settes sammen med et tall eller et navn. Ordboka treffer bare eksakt,
   så tellinger og eierlinjer får hvert sitt mønster i stedet for én rad per verdi. */
const PAT_EN = [
  [/^(\d+) blokker\b/, '$1 blocks'],
  [/^(\d+) tall$/, '$1 figures'],
  [/^(\d+) caser?$/, '$1 cases'],
  [/^(\d+) bilder?$/, '$1 images'],
  [/^(\d+) slides?$/, '$1 slides'],
  [/^brukt i (\d+) pitcher?$/, 'used in $1 pitches'],
  [/^brukt i (\d+) slides?$/, 'used in $1 slides'],
  [/^brukt (\d+) steder?$/, 'used in $1 places'],
  [/^på (\d+) slides?$/, 'on $1 slides'],
  [/^Slide (\d+) av (\d+)$/, 'Slide $1 of $2'],
  [/^versjon (\S+)$/, 'version $1'],
  [/ · brukes som utgangspunkt i «Ny pitch»$/, ' · used as a starting point in “New pitch”'],
  [/^Eier: /, 'Owner: '],
  [/^Tilbakestill alle \((\d+)\)$/, 'Reset all ($1)'],
  [/^Tilbakestill plassering \((\d+)\)$/, 'Reset placement ($1)']
];
const PAT_NO = [
  [/^(\d+) blocks\b/, '$1 blokker'],
  [/^(\d+) figures$/, '$1 tall'],
  [/^(\d+) cases$/, '$1 caser'],
  [/^(\d+) images$/, '$1 bilder'],
  [/^used in (\d+) pitches$/, 'brukt i $1 pitcher'],
  [/^used in (\d+) slides$/, 'brukt i $1 slides'],
  [/^used in (\d+) places$/, 'brukt $1 steder'],
  [/^on (\d+) slides$/, 'på $1 slides'],
  [/^Slide (\d+) of (\d+)$/, 'Slide $1 av $2'],
  [/^version (\S+)$/, 'versjon $1'],
  [/ · used as a starting point in “New pitch”$/, ' · brukes som utgangspunkt i «Ny pitch»'],
  [/^Owner: /, 'Eier: '],
  [/^Reset all \((\d+)\)$/, 'Tilbakestill alle ($1)'],
  [/^Reset placement \((\d+)\)$/, 'Tilbakestill plassering ($1)']
];

/* Roller og statuser står som frie ord i basen, men er husets egne — de oversettes. */
Object.assign(NO_EN, {
  'Én navngitt person': 'One named person', 'Systemansvarlig': 'System owner',
  'Salgsledelse': 'Sales management', 'Design': 'Design', 'Marked': 'Marketing',
  'kladd': 'draft', 'sendt': 'sent', 'signert': 'signed',
  'Kladd': 'Draft', 'Sendt': 'Sent', 'Signert': 'Signed',
  /* valgetiketter satt i renderVals: bakgrunn, intensitet, visning, varianter */
  'Punktgitter': 'Dot grid', 'Datafelt': 'Data field', 'Heksagonringer': 'Hexagon rings', 'Nettverk': 'Network',
  'Tunnel': 'Tunnel', 'Radarsveip': 'Radar sweep',
  'Rolig': 'Calm', 'Normal': 'Normal', 'Markant': 'Marked',
  'Landingsside': 'Landing page', 'Sider': 'Pages', 'Lys': 'Light',
  'Aksent': 'Accent', 'Ingen': 'None',
  'Kull': 'Coal', 'Natt': 'Night', 'Aksenttone': 'Accent tone',
  'Delt': 'Split', 'Kompakt': 'Compact', 'Stablet': 'Stacked',
  'Ingen case': 'No case', 'Legg til case…': 'Add case…', 'Standard': 'Standard',
  'Alle': 'All', 'Norsk': 'Norwegian', 'Generelt': 'General', 'Logoer': 'Logos',
  'Ingen pitcher på dette språket ennå.': 'No pitches in this language yet.',
  /* teller og etikett rendres som hver sin node, så substantivet står alene */
  'Eier:': 'Owner:', 'tall': 'figures', 'caser': 'cases', 'bilder': 'images',
  'pitcher': 'pitches', 'blokker': 'blocks', 'merkevarer': 'brands', 'avsendere': 'senders',
  'nivåer': 'tiers', 'felter': 'fields', 'kategorier': 'categories'
});

const REV = (() => {
  const r = {};
  for (const k in NO_EN) { const v = NO_EN[k]; if (v !== k && !(v in NO_EN) && !(v in r)) r[v] = k; }
  return r;
})();

const PHRASE_KEYS = Object.keys(PHRASES_NO_EN).sort((a, b) => b.length - a.length);

/* Eksakt oppslag begge veier. Alt som ikke står i ordboka står som det står. */
export function tr(s, lang) {
  const k = String(s);
  if (lang === 'en') {
    if (NO_EN[k]) return NO_EN[k];
    let o = k;
    for (const [re, to] of PAT_EN) o = o.replace(re, to);
    return o;
  }
  if (REV[k]) return REV[k];
  let o = k;
  for (const [re, to] of PAT_NO) o = o.replace(re, to);
  return o;
}

/* Dialogtekst: satt sammen i koden, så her byttes fraser inne i strengen. */
export function trPhrase(s, lang) {
  if (lang !== 'en') return s;
  let out = String(s);
  if (NO_EN[out]) return NO_EN[out];
  for (const k of PHRASE_KEYS) if (out.includes(k)) out = out.split(k).join(PHRASES_NO_EN[k]);
  return out;
}

export const ATTRS = ['title', 'placeholder', 'aria-label'];
