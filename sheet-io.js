/* Excel inn og ut for faktabasen. Ett ark, kolonnene nøkkel / verdi / etikett / kilde / oppdatert. */

const TBL = (() => { const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = TBL[(c ^ u[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
const ENC = new TextEncoder();
const u16 = v => [v & 255, (v >> 8) & 255];
const u32 = v => [v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255];

function zip(files) {
  const parts = [], central = []; let off = 0;
  for (const [name, text] of files) {
    const nb = ENC.encode(name), db = ENC.encode(text), c = crc32(db);
    const lh = new Uint8Array([...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(c), ...u32(db.length), ...u32(db.length), ...u16(nb.length), ...u16(0)]);
    parts.push(lh, nb, db);
    central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(c), ...u32(db.length), ...u32(db.length), ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nb);
    off += lh.length + nb.length + db.length;
  }
  let cdLen = 0; central.forEach(p => cdLen += p.length);
  parts.push(...central, new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0),
    ...u16(files.length), ...u16(files.length), ...u32(cdLen), ...u32(off), ...u16(0)]));
  return new Blob(parts, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const colName = i => String.fromCharCode(65 + i);
const sheetXml = (rows, widths, headerRows = 1) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="${headerRows}" topLeftCell="A${headerRows + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols><sheetData>${rows.map((r, ri) => `<row r="${ri + 1}">${r.map((v, ci) => v === '' ? '' : `<c r="${colName(ci)}${ri + 1}" t="inlineStr"${ri < headerRows ? ' s="1"' : ''}><is><t xml:space="preserve">${esc(v)}</t></is></c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;

const README = [
  ['Slik oppdaterer du tallene'], [''],
  ['1', 'Fyll inn nye verdier i kolonnen «verdi» på fanen Tall.'],
  ['2', 'Rett kilden hvis den har endret seg. Et tall uten kilde blir avvist ved opplasting.'],
  ['3', 'Sett «oppdatert» til datoen tallet gjelder fra, format ÅÅÅÅ-MM-DD. Står den tom, brukes dagens dato.'],
  ['4', 'Lagre som .xlsx og last opp under Tall og kilder i pitch-studioet.'], [''],
  ['Regler'], [''],
  ['nøkkel', 'Må stå urørt. Nøkkelen binder tallet til slidene. Ny rad med ny nøkkel oppretter et nytt tall.'],
  ['verdi', 'Skrives som den skal vises: 250 000, 60 %, 18–39, fra 40.'],
  ['etikett', 'Teksten under tallet på sliden.'],
  ['kilde', 'Hvor tallet kommer fra, med periode. Vises i kildelisten bak dekket.'],
  ['oppdatert', 'Dato. Endres en verdi, flyttes den forrige automatisk til historikken.'], [''],
  ['Rader du sletter i arket blir ikke slettet i systemet. Fjern tall i studioet.']
];

export function factsToXlsx(facts) {
  const rows = [['nøkkel', 'verdi', 'etikett', 'kilde', 'oppdatert']];
  Object.keys(facts).forEach(k => rows.push([k, facts[k].value, facts[k].label, facts[k].source, facts[k].updated]));
  return zip([
    ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`],
    ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Tall" sheetId="1" r:id="rId1"/><sheet name="Les meg" sheetId="2" r:id="rId2"/></sheets></workbook>`],
    ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ['xl/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`],
    ['xl/worksheets/sheet1.xml', sheetXml(rows, [26, 14, 30, 52, 13])],
    ['xl/worksheets/sheet2.xml', sheetXml(README, [14, 96])]
  ]);
}

/* ---------- lesing ---------- */

async function inflateRaw(bytes) {
  if (typeof DecompressionStream !== 'function') throw new Error('Nettleseren kan ikke pakke ut .xlsx. Lagre arket som CSV og last opp det.');
  const ds = new DecompressionStream('deflate-raw');
  const buf = await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
  return new Uint8Array(buf);
}

async function unzip(buffer) {
  const b = new Uint8Array(buffer), dv = new DataView(buffer);
  let eocd = -1;
  for (let i = b.length - 22; i >= 0 && i > b.length - 66000; i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('Filen er ikke et gyldig regneark.');
  const n = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const out = {};
  for (let i = 0; i < n; i++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), elen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    const lho = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(b.subarray(p + 46, p + 46 + nlen));
    const dstart = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true);
    const raw = b.subarray(dstart, dstart + csize);
    out[name] = { method, raw };
    p += 46 + nlen + elen + clen;
  }
  const read = async name => {
    const e = out[name]; if (!e) return null;
    const bytes = e.method === 0 ? e.raw : await inflateRaw(e.raw);
    return new TextDecoder().decode(bytes);
  };
  return { names: Object.keys(out), read };
}

const unesc = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d)).replace(/&amp;/g, '&');
const colIdx = ref => { const m = /^([A-Z]+)/.exec(ref); if (!m) return 0;
  let n = 0; for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64); return n - 1; };
const EXCEL_EPOCH = Date.UTC(1899, 11, 30);
const serialToDate = n => new Date(EXCEL_EPOCH + n * 86400000).toISOString().slice(0, 10);

function sheetToGrid(xml, shared) {
  const grid = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  let rm;
  while ((rm = rowRe.exec(xml))) {
    const cells = [];
    const cRe = /<c([^>]*?)(\/>|>([\s\S]*?)<\/c>)/g;
    let cm;
    while ((cm = cRe.exec(rm[1]))) {
      const attrs = cm[1], body = cm[3] || '';
      const ref = (/r="([A-Z]+\d+)"/.exec(attrs) || [])[1] || '';
      const type = (/t="([^"]+)"/.exec(attrs) || [])[1] || 'n';
      const style = (/s="(\d+)"/.exec(attrs) || [])[1];
      let val = '';
      if (type === 'inlineStr') val = unesc((/<t[^>]*>([\s\S]*?)<\/t>/.exec(body) || [, ''])[1]);
      else if (type === 's') val = shared[+((/<v>([\s\S]*?)<\/v>/.exec(body) || [, '0'])[1])] || '';
      else if (type === 'str') val = unesc((/<v>([\s\S]*?)<\/v>/.exec(body) || [, ''])[1]);
      else {
        const raw = (/<v>([\s\S]*?)<\/v>/.exec(body) || [, ''])[1];
        val = raw;
        if (raw && /^\d+(\.\d+)?$/.test(raw) && style && DATE_STYLES.has(+style)) val = serialToDate(+raw);
      }
      cells[ref ? colIdx(ref) : cells.length] = val;
    }
    grid.push(cells);
  }
  return grid;
}

let DATE_STYLES = new Set();
function dateStyles(stylesXml) {
  const set = new Set();
  if (!stylesXml) return set;
  const custom = new Set();
  const fmtRe = /<numFmt[^>]*numFmtId="(\d+)"[^>]*formatCode="([^"]*)"/g;
  let m; while ((m = fmtRe.exec(stylesXml))) if (/[dmyDMY]/.test(m[2]) && !/[eE]\+/.test(m[2])) custom.add(m[1]);
  const builtin = new Set(['14', '15', '16', '17', '22']);
  const xfs = (/<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/.exec(stylesXml) || [, ''])[1];
  const xfRe = /<xf[^>]*numFmtId="(\d+)"[^>]*?\/?>/g;
  let i = 0;
  while ((m = xfRe.exec(xfs))) { if (builtin.has(m[1]) || custom.has(m[1])) set.add(i); i++; }
  return set;
}

function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  const t = text.replace(/^\uFEFF/, '');
  const delim = (t.split('\n')[0].match(/;/g) || []).length > (t.split('\n')[0].match(/,/g) || []).length ? ';' : ',';
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const HEADERS = { key: ['nøkkel', 'nokkel', 'key', 'id'], value: ['verdi', 'value', 'tall'],
  label: ['etikett', 'label', 'tekst'], source: ['kilde', 'source'], updated: ['oppdatert', 'updated', 'dato', 'date'] };

/* Leser en fil og gir tilbake { rows: [{key,value,label,source,updated}], sheet } */
export async function readFactRows(file) {
  const name = (file.name || '').toLowerCase();
  let grid, sheet = 'CSV';
  if (name.endsWith('.csv') || name.endsWith('.txt')) grid = parseCsv(await file.text());
  else {
    const z = await unzip(await file.arrayBuffer());
    const wb = await z.read('xl/workbook.xml');
    const rels = await z.read('xl/_rels/workbook.xml.rels');
    let target = 'xl/worksheets/sheet1.xml';
    const first = /<sheet[^>]*name="([^"]*)"[^>]*r:id="([^"]+)"/.exec(wb || '');
    if (first) {
      sheet = unesc(first[1]);
      const rel = new RegExp('Id="' + first[2] + '"[^>]*Target="([^"]+)"').exec(rels || '');
      if (rel) target = 'xl/' + rel[1].replace(/^\/?xl\//, '').replace(/^\.\//, '');
    }
    const sx = await z.read(target) || await z.read('xl/worksheets/sheet1.xml');
    if (!sx) throw new Error('Fant ikke arket i filen.');
    const ss = await z.read('xl/sharedStrings.xml');
    const shared = ss ? [...ss.matchAll(/<si>([\s\S]*?)<\/si>/g)]
      .map(m => unesc([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(x => x[1]).join(''))) : [];
    DATE_STYLES = dateStyles(await z.read('xl/styles.xml'));
    grid = sheetToGrid(sx, shared);
  }
  grid = grid.filter(r => r && r.some(c => String(c || '').trim()));
  if (!grid.length) throw new Error('Arket er tomt.');
  const head = grid[0].map(c => String(c || '').trim().toLowerCase());
  const at = {};
  Object.keys(HEADERS).forEach(k => { at[k] = head.findIndex(h => HEADERS[k].includes(h)); });
  if (at.key < 0 || at.value < 0)
    throw new Error('Fant ikke kolonnene «nøkkel» og «verdi» i første rad. Bruk Excel-malen fra studioet.');
  const rows = grid.slice(1).map(r => {
    const g = i => i >= 0 ? String(r[i] == null ? '' : r[i]).trim() : '';
    return { key: g(at.key), value: g(at.value), label: g(at.label), source: g(at.source), updated: g(at.updated) };
  }).filter(r => r.key);
  return { rows, sheet };
}
