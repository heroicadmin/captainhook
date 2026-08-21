/* Skagerrak Pitch Studio — skylagret datalag.
   Erstatter localStorage (pitcher, faktabase, priser) og IndexedDB (bilder)
   med Supabase: Postgres for data, Storage for bilder, Auth for innlogging.

   Alt som var lokalt på én maskin ligger nå på ett sted hele teamet deler.
   API-et er holdt likt det gamle, så redigeringsflaten trenger små endringer:
     loadStore()  ->  samme objekt som localStorage ga før
     saveStore()  ->  skriver bare det som faktisk er endret
     putAsset()   ->  laster opp til Storage, returnerer «asset:<id>»-referanse
*/

const CONFIG_KEY = 'skgr.supabase.config';   // kun tilkobling, ingen pitchdata
const SHARED_KEYS = ['facts', 'pricing', 'brands', 'senders', 'library',
                     'templates', 'cases', 'imageCats', 'images', 'catDomains', 'pricingByDomain',
                     /* Styringsnøkler. De MÅ lagres: gravsteinene husker hva som er slettet, og
                        versjonstallene stopper re-seedingen. Uten dem kom kodens standardbilder
                        og -caser tilbake ved neste innlasting, så «slett» så ut til å ikke virke. */
                     'imagesRemoved', 'imagesVersion', 'casesRemoved', 'casesVersion',
                     'catsNoFill', 'noFillStamp', 'logoRefiled'];

let _sb = null, _cfg = null, _snapshot = { pitches: {}, shared: {} }, _saveTimer = null;
let _pending = null, _saving = false, _listeners = new Set();

/* ------------------------------------------------------------------ oppsett */

export function readConfig() {
  if (_cfg) return _cfg;
  if (typeof window !== 'undefined' && window.SUPABASE_CONFIG &&
      window.SUPABASE_CONFIG.url && window.SUPABASE_CONFIG.anonKey) {
    _cfg = { ...window.SUPABASE_CONFIG };
    return _cfg;
  }
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) { const c = JSON.parse(raw); if (c && c.url && c.anonKey) _cfg = c; }
  } catch (e) {}
  return _cfg;
}

export function saveConfig(url, anonKey) {
  _cfg = { url: String(url || '').replace(/\/+$/, ''), anonKey: String(anonKey || '').trim() };
  try { localStorage.setItem(CONFIG_KEY, JSON.stringify(_cfg)); } catch (e) {}
  _sb = null;
  return _cfg;
}

export function isConfigured() { const c = readConfig(); return !!(c && c.url && c.anonKey); }

export async function client() {
  if (_sb) return _sb;
  const c = readConfig();
  if (!c) throw new Error('Supabase er ikke satt opp ennå.');
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.45.4');
  _sb = createClient(c.url, c.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return _sb;
}

/* -------------------------------------------------------------- innlogging */

export async function session() {
  const sb = await client();
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

export async function me() {
  const s = await session();
  if (!s) return null;
  const sb = await client();
  const { data } = await sb.from('profiles').select('*').eq('id', s.user.id).maybeSingle();
  return data || { id: s.user.id, email: s.user.email, name: s.user.email };
}

export async function onAuth(cb) {
  const sb = await client();
  const { data } = sb.auth.onAuthStateChange((_e, s) => cb(s || null));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  const sb = await client();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUp(email, password, name) {
  const sb = await client();
  const { data, error } = await sb.auth.signUp({
    email, password, options: { data: { name: name || '' } } });
  if (error) throw error;
  return data.session;
}

export async function sendMagicLink(email) {
  const sb = await client();
  const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href } });
  if (error) throw error;
}

export async function resetPassword(email) {
  const sb = await client();
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.href });
  if (error) throw error;
}

export async function signOut() {
  const sb = await client();
  await sb.auth.signOut();
  _snapshot = { pitches: {}, shared: {} };
}

/* ------------------------------------------------------------ les og skriv */

/* Samme form som localStorage-butikken hadde, slik at redigeringsflaten
   kan brukes uendret: { version, pitches: [...], facts, pricing, ... } */
export async function loadStore() {
  const sb = await client();
  const [pitchRes, sharedRes] = await Promise.all([
    sb.from('pitches').select('id, slug, client, title, status, data, owner_id, expires_at, view_password, updated_at')
      .order('updated_at', { ascending: false }),
    sb.from('shared_data').select('key, value')
  ]);
  if (pitchRes.error) throw pitchRes.error;
  if (sharedRes.error) throw sharedRes.error;

  const store = { version: 1, pitches: [] };
  _snapshot = { pitches: {}, shared: {} };

  (pitchRes.data || []).forEach(row => {
    const p = { ...(row.data || {}), id: row.id, slug: row.slug };
    p.meta = { ...(p.meta || {}), client: row.client, slug: row.slug, status: row.status };
    p.hasPassword = !!row.view_password;
    p.expiresAt = row.expires_at || '';
    p.ownerId = row.owner_id || null;
    store.pitches.push(p);
    _snapshot.pitches[row.id] = JSON.stringify(stripLocal(p));
  });

  (sharedRes.data || []).forEach(row => {
    store[row.key] = row.value;
    _snapshot.shared[row.key] = JSON.stringify(row.value);
  });

  return store;
}

function stripLocal(p) {
  const { hasPassword, expiresAt, ownerId, ...rest } = p;
  return rest;
}

/* Skriver bare det som er endret siden forrige lesing/lagring, og samler
   raske tastetrykk i én skriving. Uten dette ville hver bokstav i et
   tekstfelt blitt en runde mot databasen. */
export function saveStore(store, opts = {}) {
  _pending = store;
  if (opts.immediate) { clearTimeout(_saveTimer); return flush(); }
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(flush, opts.wait || 700);
  return Promise.resolve({ queued: true });
}

export async function flush() {
  if (!_pending || _saving) return { skipped: true };
  const store = _pending; _pending = null; _saving = true;
  emit({ saving: true });
  try {
    const sb = await client();
    const s = await session();
    const uid = s ? s.user.id : null;

    const pitchRows = [], seen = new Set();
    (store.pitches || []).forEach(p => {
      seen.add(p.id);
      const clean = stripLocal(p);
      const json = JSON.stringify(clean);
      if (_snapshot.pitches[p.id] === json) return;         // uendret
      const meta = p.meta || {};
      pitchRows.push({
        id: p.id,
        slug: meta.slug || p.slug || p.id,
        client: meta.client || '',
        title: (p.blocks || []).find(b => b.type === 'cover')?.data?.title || meta.client || '',
        status: meta.status || 'kladd',
        data: clean,
        owner_id: p.ownerId || uid,
        updated_at: new Date().toISOString()
      });
      _snapshot.pitches[p.id] = json;
    });

    const sharedRows = [];
    SHARED_KEYS.forEach(k => {
      if (store[k] === undefined) return;
      const json = JSON.stringify(store[k]);
      if (_snapshot.shared[k] === json) return;
      sharedRows.push({ key: k, value: store[k], updated_at: new Date().toISOString(), updated_by: uid });
      _snapshot.shared[k] = json;
    });

    const removed = Object.keys(_snapshot.pitches).filter(id => !seen.has(id));

    if (pitchRows.length) {
      const { error } = await sb.from('pitches').upsert(pitchRows, { onConflict: 'id' });
      if (error) throw error;
    }
    if (sharedRows.length) {
      const { error } = await sb.from('shared_data').upsert(sharedRows, { onConflict: 'key' });
      if (error) throw error;
    }
    if (removed.length) {
      await sb.from('pitches').delete().in('id', removed);
      removed.forEach(id => delete _snapshot.pitches[id]);
    }
    emit({ saving: false, savedAt: Date.now(),
           wrote: pitchRows.length + sharedRows.length + removed.length });
    return { pitches: pitchRows.length, shared: sharedRows.length, removed: removed.length };
  } catch (e) {
    emit({ saving: false, error: e.message || String(e) });
    throw e;
  } finally {
    _saving = false;
    if (_pending) { clearTimeout(_saveTimer); _saveTimer = setTimeout(flush, 250); }
  }
}

/* status til lagringsindikatoren i grensesnittet */
export function onStatus(cb) { _listeners.add(cb); return () => _listeners.delete(cb); }
function emit(s) { _listeners.forEach(cb => { try { cb(s); } catch (e) {} }); }

/* -------------------------------------------------------------- passordlås */

export async function setPitchPassword(pitchId, password) {
  const sb = await client();
  const { error } = await sb.rpc('set_pitch_password', { p_id: pitchId, p_password: password || '' });
  if (error) throw error;
}

export async function setPitchExpiry(pitchId, iso) {
  const sb = await client();
  const { error } = await sb.from('pitches').update({ expires_at: iso || null }).eq('id', pitchId);
  if (error) throw error;
}

/* ------------------------------------------------------------------- bilder */

export const assetId = () => 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

/* Skalerer ned før opplasting. En 6 MB skjermdump trenger ikke full oppløsning
   bak en slide som er 1920 bred. PNG med gjennomsiktighet beholdes som PNG,
   resten blir JPEG — ellers ville hvite logoer fått svart bakgrunn. */
export function shrink(file, maxEdge = 1800, quality = 0.86) {
  return new Promise((res, rej) => {
    if (!/^image\//.test(file.type)) return rej(new Error('Bare bildefiler.'));
    if (/svg/.test(file.type)) return res({ blob: file, ext: 'svg', w: 0, h: 0 });
    const fr = new FileReader();
    fr.onerror = () => rej(new Error('Kunne ikke lese filen'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => rej(new Error('Kunne ikke lese bildet'));
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const png = /png/.test(file.type) && hasAlpha(ctx, w, h);
        c.toBlob(b => res({ blob: b, ext: png ? 'png' : 'jpg', w, h }),
                 png ? 'image/png' : 'image/jpeg', quality);
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

function hasAlpha(ctx, w, h) {
  const step = Math.max(1, Math.floor(Math.min(w, h) / 40));
  const d = ctx.getImageData(0, 0, w, h).data;
  for (let y = 0; y < h; y += step)
    for (let x = 0; x < w; x += step)
      if (d[(y * w + x) * 4 + 3] < 250) return true;
  return false;
}

export async function putAsset(file, meta = {}) {
  const sb = await client();
  const s = await session();
  const { blob, ext, w, h } = await shrink(file, meta.maxEdge || 1800);
  const id = meta.id || assetId();
  const path = `${id}.${ext}`;

  const up = await sb.storage.from('pitch-assets')
    .upload(path, blob, { contentType: blob.type || 'image/jpeg', upsert: true });
  if (up.error) throw up.error;

  const rec = {
    id, path, name: meta.name || file.name || 'uten navn',
    cat: meta.cat || null, mime: blob.type, width: w, height: h,
    bytes: blob.size, created_by: s ? s.user.id : null
  };
  const { error } = await sb.from('assets').upsert(rec, { onConflict: 'id' });
  if (error) throw error;
  return { ...rec, src: publicURL(path) };
}

export function publicURL(path) {
  const c = readConfig();
  if (!c || !path) return '';
  if (/^https?:/.test(path)) return path;
  return `${c.url}/storage/v1/object/public/pitch-assets/${path}`;
}

export function toURL(rec) { return publicURL(rec && (rec.path || rec.src)); }

/* { id: url } — samme form som IndexedDB-laget ga, så resolveSrc() er uendret */
export async function allAssets() {
  try {
    const sb = await client();
    const { data, error } = await sb.from('assets').select('id, path');
    if (error) throw error;
    const map = {};
    (data || []).forEach(r => { map[r.id] = publicURL(r.path); });
    return map;
  } catch (e) { return {}; }
}

export async function delAsset(id) {
  const sb = await client();
  const { data } = await sb.from('assets').select('path').eq('id', id).maybeSingle();
  if (data && data.path) await sb.storage.from('pitch-assets').remove([data.path]);
  await sb.from('assets').delete().eq('id', id);
}

/* -------------------------------------------------- klientsiden (uinnlogget) */

export async function pitchGate(slug) {
  const sb = await client();
  const { data, error } = await sb.rpc('pitch_gate', { p_slug: slug });
  if (error) throw error;
  return data;
}

export async function pitchPublic(slug, password) {
  const sb = await client();
  const { data, error } = await sb.rpc('pitch_public', { p_slug: slug, p_password: password || null });
  if (error) throw error;
  return data;
}

/* ------------------------------------------------------------------ sporing */

/* Måler hvor langt klienten kom og hvor lenge de så på hver slide.
   Rapporterer samlet hvert 10. sekund og når fanen lukkes, slik at
   ett gjennomsyn ikke blir hundre databasekall. */
export function tracker(slug) {
  const sid = sessionKey();
  let viewId = null, current = -1, since = 0, maxScroll = 0;
  const pending = new Map();   // slideIndex -> { label, ms }
  let timer = null, started = false;

  const queue = () => {
    if (current >= 0 && since) {
      const ms = Date.now() - since;
      const row = pending.get(current) || { label: null, ms: 0 };
      row.ms += ms;
      pending.set(current, row);
    }
    since = Date.now();
  };

  const send = async () => {
    queue();
    if (!viewId || !pending.size) return;
    const sb = await client();
    const rows = [...pending.entries()];
    pending.clear();
    for (const [idx, row] of rows) {
      await sb.rpc('track_progress', {
        p_view: viewId, p_slide: idx, p_label: row.label || null,
        p_dwell_ms: Math.round(row.ms), p_max_scroll: maxScroll });
    }
  };

  return {
    async start() {
      if (started) return;
      started = true;
      try {
        const sb = await client();
        const { data } = await sb.rpc('track_open', {
          p_slug: slug, p_session: sid,
          p_ua: navigator.userAgent, p_ref: document.referrer || null });
        viewId = data || null;
      } catch (e) { return; }
      since = Date.now();
      timer = setInterval(() => send().catch(() => {}), 10000);
      addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') send().catch(() => {});
      });
      addEventListener('pagehide', () => send().catch(() => {}));
    },
    slide(index, label) {
      if (index === current) return;
      queue();
      current = index;
      const row = pending.get(index) || { label, ms: 0 };
      row.label = label || row.label;
      pending.set(index, row);
    },
    scroll(pct) { maxScroll = Math.max(maxScroll, Math.min(100, Math.round(pct))); },
    stop() { clearInterval(timer); return send().catch(() => {}); }
  };
}

function sessionKey() {
  const K = 'skgr.viewsession';
  try {
    let v = sessionStorage.getItem(K);
    if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem(K, v); }
    return v;
  } catch (e) { return Math.random().toString(36).slice(2); }
}

/* --------------------------------------------------------------- statistikk */

export async function pitchStats(pitchId) {
  const sb = await client();
  const views = await sb.from('pitch_views')
    .select('id, session_id, opened_at, last_seen, max_scroll, slides_seen, total_ms, referrer, user_agent')
    .eq('pitch_id', pitchId).order('opened_at', { ascending: false }).limit(200);
  if (views.error) throw views.error;
  const ids = (views.data || []).map(v => v.id);
  let slides = [];
  if (ids.length) {
    const st = await sb.from('pitch_slide_time')
      .select('view_id, slide_index, slide_label, dwell_ms').in('view_id', ids);
    slides = st.data || [];
  }
  return { views: views.data || [], slides };
}

export async function recentActivity(limit = 40) {
  const sb = await client();
  const { data, error } = await sb.from('pitch_views')
    .select('id, slug, opened_at, max_scroll, slides_seen, total_ms, referrer')
    .order('opened_at', { ascending: false }).limit(limit);
  if (error) throw error;
  return data || [];
}

/* ------------------------------------------------------------- flytt data inn */

/* Engangsjobb: tar alt som ligger i denne nettleseren (pitcher i localStorage,
   bilder i IndexedDB) og legger det i databasen. Bildene lastes opp direkte
   fra nettleseren, så ingenting må gjennom en mellomserver. */
export async function migrateFromBrowser(onProgress = () => {}) {
  const sb = await client();
  const s = await session();
  if (!s) throw new Error('Logg inn først.');

  let local = null;
  try { local = JSON.parse(localStorage.getItem('skgr.pitchstudio.v1') || 'null'); } catch (e) {}
  if (!local) throw new Error('Fant ingen lokal butikk å flytte.');

  const assets = await readIndexedDBAssets();
  const total = assets.length + (local.pitches || []).length + SHARED_KEYS.length;
  let done = 0;
  const step = label => { done++; onProgress({ done, total, label }); };

  // 1) bilder
  for (const rec of assets) {
    try {
      const blob = dataURLtoBlob(rec.src);
      const ext = /image\/png/.test(blob.type) ? 'png' : (/svg/.test(blob.type) ? 'svg' : 'jpg');
      const path = `${rec.id}.${ext}`;
      const up = await sb.storage.from('pitch-assets')
        .upload(path, blob, { contentType: blob.type, upsert: true });
      if (up.error && !/exists/i.test(up.error.message || '')) throw up.error;
      await sb.from('assets').upsert({
        id: rec.id, path, name: rec.name || rec.id, mime: blob.type,
        width: rec.w || null, height: rec.h || null, bytes: blob.size,
        created_by: s.user.id }, { onConflict: 'id' });
    } catch (e) { onProgress({ done, total, label: 'Hoppet over ' + (rec.name || rec.id), warn: true }); }
    step('Bilde ' + (rec.name || rec.id));
  }

  // 2) delt data
  for (const k of SHARED_KEYS) {
    if (local[k] === undefined) { step(k); continue; }
    await sb.from('shared_data').upsert(
      { key: k, value: local[k], updated_by: s.user.id, updated_at: new Date().toISOString() },
      { onConflict: 'key' });
    step(k);
  }

  // 3) pitcher
  for (const p of (local.pitches || [])) {
    const meta = p.meta || {};
    await sb.from('pitches').upsert({
      id: p.id,
      slug: meta.slug || p.id,
      client: meta.client || '',
      title: (p.blocks || []).find(b => b.type === 'cover')?.data?.title || meta.client || '',
      status: meta.status || 'kladd',
      data: p,
      owner_id: s.user.id,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
    step('Pitch ' + (meta.client || p.id));
  }

  _snapshot = { pitches: {}, shared: {} };
  return { assets: assets.length, pitches: (local.pitches || []).length, shared: SHARED_KEYS.length };
}

export function readIndexedDBAssets() {
  return new Promise(res => {
    let out = [];
    const req = indexedDB.open('skgr.assets', 1);
    req.onerror = () => res([]);
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('assets')) return res([]);
      const tx = db.transaction('assets', 'readonly');
      const all = tx.objectStore('assets').getAll();
      all.onsuccess = () => res(all.result || []);
      all.onerror = () => res([]);
    };
  });
}

function dataURLtoBlob(src) {
  const [head, b64] = String(src).split(',');
  const type = (/data:([^;]+)/.exec(head) || [])[1] || 'image/png';
  if (!/;base64/.test(head)) return new Blob([decodeURIComponent(b64)], { type });
  const bin = atob(b64), buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return new Blob([buf], { type });
}

/* Hvor mye ligger lokalt? Brukes av oppsettssiden før flyttingen. */
export async function localFootprint() {
  let local = null;
  try { local = JSON.parse(localStorage.getItem('skgr.pitchstudio.v1') || 'null'); } catch (e) {}
  const assets = await readIndexedDBAssets();
  const bytes = assets.reduce((n, a) => n + (a.src ? a.src.length : 0), 0);
  return {
    pitches: local && local.pitches ? local.pitches.length : 0,
    assets: assets.length,
    mb: +(bytes / 1024 / 1024).toFixed(1),
    names: assets.slice(0, 60).map(a => a.name || a.id)
  };
}
