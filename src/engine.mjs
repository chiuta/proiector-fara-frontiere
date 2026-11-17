/* PROIECTOR FĂRĂ FRONTIERE · engine.mjs — logică pură (fără DOM, fără rețea): protocolul dintre proiector și telefoane, lista participanților,
   rutarea mesajelor widgeturilor, limitele și validările. Gazda este autoritară: tot ce vine de la un telefon sau dintr-un widget trece pe aici înainte să fie folosit. */
export const PROTO = 1;
/** Culori pe telefon (≥ 3:1 pe alb, distincte între ele; tabla le folosește pentru linii). Culoarea gazdei este «» (culoarea textului temei). */
export const COLORS = ['#0072B2', '#D55E00', '#009E73', '#B04A86', '#B36B00', '#7A3FBF', '#C2185B', '#00796B', '#6D4C41', '#33691E', '#546E7A', '#1A237E'];
export const LIMITS = {
  peers: 30,                 // telefoane simultan
  name: 24,                  // caractere în nume
  wid: 40,                   // lungimea id-ului de widget
  state: 16384,              // octeți (șir JSON) pentru starea comună a unui widget
  msg: { none: 4096, drawing: 8192 },
  rate: { none: { rps: 10, burst: 20 }, drawing: { rps: 40, burst: 80 } },
  relay: { rps: 1500, burst: 3000 },  // LIVRĂRI/secundă retransmise de gazdă între telefoane, în total (apărare împotriva amplificării 1→N; un jeton pe destinatar)
  slow: 524288,              // octeți în coada unui canal peste care mesajele nevitale sunt omise
  storeKey: 40, storeVal: 16384, storeTotal: 65536,
  saveText: 1048576, saveImage: 4194304, saveEveryMs: 2000,
  queue: 200,                // mesaje reținute de un telefon până pornește widgetul
  // — apărare împotriva inundațiilor (un telefon sau un widget care trimite fără încetare nu are cum să încetinească gazda sau celelalte telefoane) —
  phone: { rps: 300, burst: 600 },    // ORICE mesaj de la un telefon, aruncat înainte de orice analiză
  ctl: { rps: 5, burst: 15 },         // mesajele rare ale unui telefon: «name» și «rdy»
  store: { rps: 20, burst: 40 },      // operațiile de stocare ale unui widget
  stateEveryMs: 100,                  // starea comună a gazdei se difuzează cel mult de 10 ori pe secundă (ultima valoare ajunge întotdeauna)
  rosterEveryMs: 250,                 // lista de telefoane se difuzează cel mult de 4 ori pe secundă (ultima versiune ajunge întotdeauna)
  errEveryMs: 5000                    // cel mult o notificare de eroare a unui widget la 5 s
};
/** Permisiuni cunoscute. «camera» și «microphone» sunt rezervate: NU sunt implementate și un widget care le cere este refuzat. */
export const PERMS = ['none', 'drawing', 'storage', 'download'];
export const RESERVED = ['camera', 'microphone'];
export const SAVE_MIME = { 'image/png': 'png', 'text/plain': 'txt', 'text/csv': 'csv' };

/** Normalizează lista de permisiuni a unui descriptor. Returnează {ok, perms, why}. */
export function checkPerms(list) {
  if (!Array.isArray(list) || !list.length) return { ok: false, perms: [], why: 'missing' };
  const seen = [];
  for (const p of list) {
    if (RESERVED.indexOf(p) >= 0) return { ok: false, perms: [], why: 'reserved:' + p };
    if (PERMS.indexOf(p) < 0) return { ok: false, perms: [], why: 'unknown:' + p };
    if (seen.indexOf(p) < 0) seen.push(p);
  }
  if (seen.indexOf('none') >= 0 && seen.length > 1) return { ok: false, perms: [], why: 'none-alone' };
  return { ok: true, perms: seen.filter((p) => p !== 'none'), why: '' };
}
export const budgetFor = (perms) => ({
  bytes: perms.indexOf('drawing') >= 0 ? LIMITS.msg.drawing : LIMITS.msg.none,
  rate: perms.indexOf('drawing') >= 0 ? LIMITS.rate.drawing : LIMITS.rate.none
});

/** Nume afișat: fără caractere de control sau de direcție (bidi), spații comprimate, cel mult LIMITS.name caractere (puncte de cod). */
export function cleanName(s, fallback) {
  // controale C0/C1, caractere de lățime zero și de direcție (bidi): U+200B–200F, U+202A–202E, U+2066–2069, U+FEFF
  const t = String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, ' ').replace(/\s+/g, ' ').trim();
  const cut = Array.from(t).slice(0, LIMITS.name).join('').trim();
  return cut || fallback || '';
}
export const okWid = (w) => typeof w === 'string' && w.length > 0 && w.length <= LIMITS.wid && /^[a-z0-9-]+$/.test(w);
/** Culoare la formă #rrggbb (altfel «»). */
export const okColor = (c) => (typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c) ? c : '');

/** Găleată cu jetoane (token bucket): take(now) → true dacă mesajul poate trece. now în ms. */
export class Bucket {
  constructor(rps, burst, now) { this.rps = rps; this.max = burst; this.tokens = burst; this.at = now || 0; }
  take(now) {
    const dt = Math.max(0, now - this.at); this.at = now;
    this.tokens = Math.min(this.max, this.tokens + (dt * this.rps) / 1000);
    if (this.tokens < 1) return false;
    this.tokens -= 1; return true;
  }
}
/** Parsează un șir JSON primit de la un widget/telefon, cu limită de lungime. */
export function parseJson(str, max) {
  if (typeof str !== 'string' || str.length === 0 || str.length > max) return { ok: false, why: typeof str !== 'string' ? 'type' : (str.length ? 'size' : 'empty') };
  try { return { ok: true, v: JSON.parse(str) }; } catch (e) { return { ok: false, why: 'json' }; }
}
/** Cheie în spațiul de stocare al unui widget: [A-Za-z0-9._-], ≤ 40 de caractere. */
export const okStoreKey = (k) => typeof k === 'string' && k.length > 0 && k.length <= LIMITS.storeKey && /^[A-Za-z0-9._-]+$/.test(k);
/** Nume de fișier sigur: litere/cifre/._-, fără cale, ≤ 60 de caractere, extensia impusă de tipul MIME. */
export function safeFileName(name, ext) {
  let b = String(name == null ? '' : name).split(/[\\/]/).pop().replace(/\.[A-Za-z0-9]{1,5}$/, '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^[.-]+/, '').slice(0, 56);
  if (!b) b = 'file';
  return b + '.' + ext;
}
/** CSV deschis într-o foaie de calcul: o celulă care începe cu = + - @ (sau tab/CR) poate fi executată ca formulă (exfiltrare prin HYPERLINK/WEBSERVICE, DDE).
    Numele telefoanelor sunt alese de elevi, deci ajung în fișiere. O astfel de celulă primește un apostrof în față; numerele obișnuite (-5, +3,2) rămân neatinse.
    Delimitatori tratați: virgulă, punct și virgulă, tab (foile de calcul din unele limbi folosesc «;»). Idempotentă: o celulă care începe deja cu apostrof nu mai e atinsă. */
export function csvNeutralize(text) {
  const s = String(text), n = s.length, DELIM = /[,;\t\r\n]/, NUM = /^[+-]\d+(?:[.,]\d+)?(?:[eE][+-]?\d+)?$/;
  const fix = (v) => (/^[=+\-@\t\r]/.test(v) && !NUM.test(v) ? "'" + v : v);
  let out = '', i = 0;
  while (i <= n) {
    if (s.charAt(i) === '"') {
      let val = ''; i++;
      while (i < n) {
        const ch = s.charAt(i);
        if (ch === '"') { if (s.charAt(i + 1) === '"') { val += '""'; i += 2; continue; } i++; break; }
        val += ch; i++;
      }
      let tail = ''; while (i < n && !DELIM.test(s.charAt(i))) { tail += s.charAt(i); i++; }   // text după ghilimeaua de închidere (CSV malformat): păstrat ca atare
      out += '"' + fix(val) + '"' + tail;
    } else {
      let j = i; while (j < n && !DELIM.test(s.charAt(j))) j++;
      out += fix(s.slice(i, j)); i = j;
    }
    if (i >= n) break;
    out += s.charAt(i); i++;
  }
  return out;
}
/** Validează o cerere de salvare a unui widget: permisiunea, tipul MIME admis, mărimea și conținutul. */
export function checkSave(perms, m) {
  if (perms.indexOf('download') < 0) return { ok: false, why: 'perm' };
  if (!m || typeof m.mime !== 'string' || typeof m.data !== 'string' || typeof m.name !== 'string') return { ok: false, why: 'type' };
  const ext = SAVE_MIME[m.mime];
  if (!ext) return { ok: false, why: 'mime' };
  if (m.mime === 'image/png') {
    const pre = 'data:image/png;base64,';
    if (m.data.indexOf(pre) !== 0 || m.data.length > LIMITS.saveImage * 1.4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(m.data.slice(pre.length))) return { ok: false, why: 'data' };
    return { ok: true, name: safeFileName(m.name, ext), mime: m.mime, data: m.data.slice(pre.length), base64: true };
  }
  if (m.data.length > LIMITS.saveText) return { ok: false, why: 'size' };
  return { ok: true, name: safeFileName(m.name, ext), mime: m.mime, data: m.mime === 'text/csv' ? csvNeutralize(m.data) : m.data, base64: false };
}

/** Lista participanților, ținută de gazdă. Fiecare telefon primește id (p1, p2…), nume, culoare și starea de blocare. */
export class Roster {
  constructor(max) { this.max = max || LIMITS.peers; this.all = []; this.seq = 0; this.lockAll = false; }
  find(id) { for (const p of this.all) if (p.id === id) return p; return null; }
  here() { return this.all.filter((p) => p.here); }
  /** Un telefon intră (cid = identificator ales de telefon și niciodată difuzat, ca să își recapete locul după o reconectare, chiar dacă gazda nu a observat încă închiderea sesiunii vechi).
      Rezultat: {peer, again, replaced} sau null dacă sala e plină. */
  join(cid, name) {
    const nm = cleanName(name, '');
    const key = typeof cid === 'string' && cid ? cid.slice(0, 64) : '';
    const old = key ? this.all.find((p) => p.cid === key) : null;
    if (old) { const replaced = old.here; old.here = true; if (nm) old.name = nm; return { peer: old, again: true, replaced }; }
    if (this.here().length >= this.max) return null;
    const used = this.here().map((p) => p.color), free = COLORS.filter((c) => used.indexOf(c) < 0);
    const color = free.length ? free[0] : COLORS[this.seq % COLORS.length];
    const peer = { id: 'p' + ++this.seq, cid: key, name: nm || 'P' + this.seq, color, locked: this.lockAll, here: true };
    this.all.push(peer);
    if (this.all.length > this.max * 3) { // păstrăm pe cei prezenți și cei mai recenți absenți (ca să li se poată recupera locul)
      const gone = this.all.filter((p) => !p.here), keep = gone.slice(Math.max(0, gone.length - this.max * 2));
      this.all = this.all.filter((p) => p.here || keep.indexOf(p) >= 0);
    }
    return { peer, again: false, replaced: false };
  }
  leave(id) { const p = this.find(id); if (p) p.here = false; return p; }
  rename(id, name) { const p = this.find(id), nm = cleanName(name, ''); if (p && nm) p.name = nm; return p; }
  setLocked(id, on) { const p = this.find(id); if (p) p.locked = !!on; return p; }
  setLockAll(on) { this.lockAll = !!on; for (const p of this.all) p.locked = !!on; }
  /** Vedere publică (ce se trimite telefoanelor). */
  view() { return this.here().map((p) => ({ id: p.id, name: p.name, color: p.color, locked: p.locked })); }
}

/** Decide cui i se livrează un mesaj de widget venit de la un telefon (gazda îl primește mereu dacă to ≠ id-ul altui telefon). */
export function routeFromGuest(to, fromId, hereIds) {
  if (to === 'host') return { host: true, to: [] };
  if (to === 'all') return { host: true, to: hereIds.filter((id) => id !== fromId) };
  if (typeof to === 'string' && hereIds.indexOf(to) >= 0 && to !== fromId) return { host: false, to: [to] };
  return { host: false, to: [], drop: 'to' };
}
/** Validează plicul unui mesaj de widget venit de la un telefon: {t:'w', w, n, to, j}. */
export function checkEnvelope(m, active, perms) {
  if (!m || typeof m !== 'object') return { ok: false, why: 'type' };
  if (!active || m.w !== active.w || m.n !== active.n) return { ok: false, why: 'stale' };
  if (typeof m.to !== 'string' || m.to.length > 12) return { ok: false, why: 'to' };
  const b = budgetFor(perms), r = parseJson(m.j, b.bytes);
  if (!r.ok) return { ok: false, why: r.why };
  return { ok: true, v: r.v };
}
