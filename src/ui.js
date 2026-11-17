/* PROIECTOR FĂRĂ FRONTIERE · interfața (cod clasic ES2017). Folosește din ambalaj: DATA (descriptorii widgeturilor), I18N, tr(), FFF (kitul),
   PROTO/LIMITS/Roster/Bucket/checkPerms/budgetFor/cleanName/okWid/okColor/parseJson/okStoreKey/checkSave/checkEnvelope/routeFromGuest din engine.mjs.
   Arhitectura: gazda (proiectorul) este autoritară. Fiecare widget rulează într-un <iframe sandbox="allow-scripts" srcdoc> fără origine, fără rețea (CSP) și fără acces la
   pagină; comunică numai printr-un MessagePort privat, iar tot ce iese este validat aici (tip, mărime, ritm, permisiuni). Vederea sesiunii este un strat peste pagină,
   ca să supraviețuiască reafișării paginii la schimbarea limbii. */
var PF_SET = 'proiector-fara-frontiere.settings';
var PF_ORDER = ['timer', 'poll', 'quiz', 'notes', 'whiteboard'];
function appVer() { return (window.APP && window.APP.version) || ''; }
var pf = {
  lang: 'en', card: null, live: null, els: {}, role: null, name: '', cid: '', hc: false, xl: false,
  roster: null, recs: {}, me: null, gpeers: [], session: null, lost: false, weak: false,
  active: null, stage: null, instance: 0, relay: null, toastT: null, helloT: null, hiT: null, endT: null, hideSide: false, lookOpen: false, themeJ: '', themeMq: null, endSure: false, wakeOn: false, wake: null, hidden: [], prevFocus: null, msg: ''
};

/* ---------- ajutoare ---------- */
function T(k) { return tr(pf.lang, k); }
function Tf(k, a) { return fmt.apply(null, [T(k)].concat(a || [])); }   // fmt(s, a0, a1…) este definit de ambalaj
function h(tag, p, kids) {
  var e = document.createElement(tag);
  p = p || {};
  Object.keys(p).forEach(function (k) {
    var v = p[k];
    if (v == null || v === false) return;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'on') Object.keys(v).forEach(function (n) { e.addEventListener(n, v[n]); });
    else if (k === 'value') e.value = v;
    else if (k === 'checked' || k === 'disabled' || k === 'hidden' || k === 'selected') e[k] = true;
    else e.setAttribute(k, v === true ? '' : String(v));
  });
  (kids || []).forEach(function (c) { if (c == null || c === false) return; e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
  return e;
}
function rnd() {
  try { var a = new Uint8Array(12); crypto.getRandomValues(a); return Array.prototype.map.call(a, function (b) { return (b < 16 ? '0' : '') + b.toString(16); }).join(''); }
  catch (e) { return String(Math.random()).slice(2, 14) + String(Date.now()); }
}
function loadSet() {
  try {
    var s = JSON.parse(localStorage.getItem(PF_SET));
    if (s && typeof s === 'object') { pf.name = cleanName(s.name, ''); pf.hc = !!s.hc; pf.xl = !!s.xl; pf.cid = typeof s.cid === 'string' ? s.cid.slice(0, 40) : ''; }
  } catch (e) { /* stocarea poate lipsi */ }
  if (!pf.cid) pf.cid = rnd();
}
function saveSet() { try { localStorage.setItem(PF_SET, JSON.stringify({ name: pf.name, hc: pf.hc, xl: pf.xl, cid: pf.cid })); } catch (e) { /* ignorat */ } }
loadSet();
function isDark() {
  var t = document.documentElement.getAttribute('data-theme');
  if (t === 'dark') return true;
  if (t === 'light') return false;
  return !(window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches);
}
function themeView() { return { dark: isDark(), hc: pf.hc, xl: pf.xl }; }
function wName(d) { var i = d.i18n && d.i18n[pf.lang]; return (i && i.name) || (d.i18n && d.i18n.en && d.i18n.en.name) || d.name; }
function wDesc(d) { var i = d.i18n && d.i18n[pf.lang]; return (i && i.description) || (d.i18n && d.i18n.en && d.i18n.en.description) || d.description || ''; }
function widgetList() {
  var ks = Object.keys(DATA).sort(function (a, b) {
    var x = PF_ORDER.indexOf(a), y = PF_ORDER.indexOf(b);
    if (x < 0 && y < 0) return a < b ? -1 : (a > b ? 1 : 0);
    return (x < 0 ? 99 : x) - (y < 0 ? 99 : y);
  });
  return ks.map(function (k) { return DATA[k]; });
}
function permText(d) {
  var c = checkPerms(d.permissions);
  if (!c.ok) return '';
  return c.perms.length ? c.perms.map(function (p) { return T('p_' + p); }).join('; ') : T('p_none');
}
function rtcOk() { return !!(window.FFF && FFF.p2p && FFF.p2p.supported && FFF.p2p.supported()); }
function toast(msg) {
  var t = pf.els.toast;
  if (!t) { pf.msg = msg; renderCard(); return; }
  t.textContent = msg; clearTimeout(pf.toastT);
  pf.toastT = setTimeout(function () { t.textContent = ''; }, 6000);
}
function amHost() { return pf.role === 'host'; }
function myLocked() { if (amHost() || !pf.me) return false; for (var i = 0; i < pf.gpeers.length; i++) if (pf.gpeers[i].id === pf.me.id) return !!pf.gpeers[i].locked; return false; }
function hereIds() { return pf.roster ? pf.roster.here().filter(function (p) { return pf.recs[p.id] && pf.recs[p.id].session; }).map(function (p) { return p.id; }) : []; }
function peersView() { return amHost() ? pf.roster.view() : pf.gpeers.map(function (p) { return { id: p.id, name: p.name, color: p.color, locked: !!p.locked }; }); }
function meView() { return amHost() ? { id: 'h', name: T('b_host'), color: '' } : { id: pf.me.id, name: pf.me.name, color: pf.me.color }; }
function fromView(id) {
  if (id === 'h') return { id: 'h', name: T('b_host'), color: '', role: 'host' };
  var list = peersView();
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return { id: id, name: list[i].name, color: list[i].color, role: 'guest' };
  return null;
}
function sendTo(rec, obj) {
  var s = rec && rec.session;
  /* Canalul de date trebuie să fie deschis; starea «lost» a bătăii de inimă NU oprește trimiterea: canalul e fiabil și ordonat, iar mesajele ajung la revenire.
     (Înainte, un telefon marcat scurt «lost» pierdea definitiv «roster» și «open» și rămânea «conectat», dar fără activitate.) */
  if (!s || !s.open) return false;
  try { if (s.channel && s.channel.bufferedAmount > LIMITS.slow) { rec.slow = (rec.slow || 0) + 1; return false; } } catch (e) { /* ignorat */ }
  return s.send(obj);
}
function broadcast(obj) { Object.keys(pf.recs).forEach(function (id) { if (pf.recs[id].id) sendTo(pf.recs[id], obj); }); }
function sendHost(obj) { return pf.session ? pf.session.send(obj) : false; }       // send() trimite doar pe canal deschis; «lost» nu oprește (ca în sendTo)

/* ---------- scena: widgetul într-un iframe izolat ---------- */
/** Documentul iframe-ului = textul EXACT al blocurilor inerte din pagină (hash-urile lor sunt în CSP-ul paginii și în meta CSP din srcdoc). */
function stageDoc(id) {
  var sc = document.getElementById('w-' + id), st = document.getElementById('w-css');
  if (!sc || !st) return null;
  var hs = sc.getAttribute('data-sha256'), hc = st.getAttribute('data-sha256');
  if (!hs || !hc) return null;
  var th = themeView(), cls = (th.dark ? 't-dark ' : '') + (th.hc ? 't-hc ' : '') + (th.xl ? 't-xl' : '');
  return '<!doctype html><html lang="' + pf.lang + '" class="' + cls + '"><head><meta charset="utf-8">' +
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'sha256-' + hs + '\'; style-src \'sha256-' + hc + '\'; img-src data:; base-uri \'none\'; form-action \'none\'">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' + id + '</title><style>' + st.textContent + '</style></head><body><div id="root"></div><script>' + sc.textContent + '<' + '/script></body></html>';
}
function stagePost(st, m) { if (st.port) { try { st.port.postMessage(m); } catch (e) { /* ignorat */ } } }
function toWidget(st, m) {
  if (!st) return;
  if (!st.ready) { if (st.queue.length < LIMITS.queue) st.queue.push(m); return; }
  stagePost(st, m);
}
function closeStage() {
  var st = pf.stage;
  if (!st) return;
  pf.stage = null;
  clearTimeout(st.wsT);
  stagePost(st, { t: 'bye' });
  try { if (st.port) { st.port.onmessage = null; st.port.close(); } } catch (e) { /* ignorat */ }
  if (st.iframe && st.iframe.parentNode) st.iframe.parentNode.removeChild(st.iframe);
  renderLive();
}
function openStage(wid, n) {
  closeStage();
  var d = DATA[wid];
  if (!d) return false;
  var cp = checkPerms(d.permissions);
  if (!cp.ok) { toast(Tf('err_perm', [wName(d)])); return false; }
  var doc = stageDoc(wid);
  if (!doc) { toast(Tf('err_widget', [wName(d)])); return false; }
  var b = budgetFor(cp.perms), now = Date.now();
  var iframe = document.createElement('iframe');
  iframe.className = 'pf-frame';
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.setAttribute('title', Tf('frame_title', [wName(d)]));
  iframe.setAttribute('referrerpolicy', 'no-referrer');
  var st = { w: wid, n: n, iframe: iframe, port: null, ready: false, queue: [], desc: d, perms: cp.perms, budget: b, state: null, stateJ: null, up: new Bucket(b.rate.rps, b.rate.burst, now), lastSave: 0,
    sb: new Bucket(LIMITS.store.rps, LIMITS.store.burst, now), wsAt: 0, wsT: 0, lastErr: 0, sawReady: false };
  pf.stage = st;
  Object.keys(pf.recs).forEach(function (id) { pf.recs[id].bucket = new Bucket(b.rate.rps, b.rate.burst, now); });
  iframe.addEventListener('load', function () {
    if (pf.stage !== st || st.port) return;
    var mc = new MessageChannel();
    st.port = mc.port1;
    st.port.onmessage = function (e) { fromWidget(st, e.data); };
    try { iframe.contentWindow.postMessage({ pfs: 1 }, '*', [mc.port2]); } catch (e) { toast(Tf('err_widget', [wName(d)])); }
  });
  iframe.srcdoc = doc;
  pf.els.holder.appendChild(iframe);
  renderLive();
  return true;
}
function initMsg(st) {
  return { t: 'init', id: st.w, version: st.desc.version, role: pf.role, me: meView(), peers: peersView(), lang: pf.lang, theme: themeView(), locked: myLocked(), state: st.state, perms: st.perms };
}
function fromWidget(st, m) {
  if (pf.stage !== st || !m || typeof m !== 'object' || typeof m.t !== 'string') return;
  var now = Date.now();
  if (m.t === 'ready') { if (!st.sawReady) { st.sawReady = true; stagePost(st, initMsg(st)); } }   // o singură dată: widgetul nu poate cere la nesfârșit starea completă
  else if (m.t === 'mounted') {
    if (st.ready) return;
    st.ready = true;
    var q = st.queue; st.queue = [];
    q.forEach(function (x) { stagePost(st, x); });
    if (!amHost()) sendHost({ t: 'rdy', w: st.w, n: st.n });
  } else if (m.t === 'send') {
    if (!st.up.take(now)) return;
    var r = parseJson(m.j, st.budget.bytes);
    if (!r.ok || typeof m.to !== 'string' || m.to.length > 12) return;
    if (amHost()) {
      var env = { t: 'w', w: st.w, n: st.n, f: 'h', j: m.j };
      if (m.to === 'all') broadcast(env);
      else if (m.to !== 'host' && pf.recs[m.to] && pf.recs[m.to].id) sendTo(pf.recs[m.to], env);
    } else if (m.to === 'all' || m.to === 'host' || fromView(m.to)) sendHost({ t: 'w', w: st.w, n: st.n, to: m.to, j: m.j });
  } else if (m.t === 'state') {
    if (!amHost()) return;
    var s = parseJson(m.j, LIMITS.state);
    if (!s.ok) return;
    st.state = s.v; st.stateJ = m.j;   // starea locală și cea trimisă celor care intră mai târziu se actualizează imediat; difuzarea e limitată la LIMITS.stateEveryMs, cu ultima valoare garantat livrată
    var wait = st.wsAt + LIMITS.stateEveryMs - now;
    if (wait <= 0) { st.wsAt = now; broadcast({ t: 'ws', w: st.w, n: st.n, j: m.j }); }
    else if (!st.wsT) st.wsT = setTimeout(function () { st.wsT = 0; if (pf.stage === st && amHost() && st.stateJ) { st.wsAt = Date.now(); broadcast({ t: 'ws', w: st.w, n: st.n, j: st.stateJ }); } }, wait);
  } else if (m.t === 'store') onStore(st, m, now);
  else if (m.t === 'save') onSave(st, m, now);
  else if (m.t === 'err') { if (now - st.lastErr >= LIMITS.errEveryMs) { st.lastErr = now; toast(Tf('err_widget', [wName(st.desc)])); } }
}
/* spațiul de stocare al widgetului (permisiunea «storage»): chei prefixate, limite pe valoare și pe total, doar pe acest dispozitiv */
function onStore(st, m, now) {
  function reply(ok, j, e) { stagePost(st, { t: 'store', id: m.id, ok: ok, j: j, e: e }); }
  if (typeof m.id !== 'number') return;
  if (st.perms.indexOf('storage') < 0) return reply(false, null, 'perm');
  if (!st.sb.take(now)) return reply(false, null, 'rate');
  if (!okStoreKey(m.k)) return reply(false, null, 'key');
  var pre = 'pfs.w.' + st.w + '.', key = pre + m.k;
  try {
    if (m.op === 'get') { var raw = localStorage.getItem(key); return reply(true, raw == null ? null : raw, null); }
    if (m.op === 'del') { localStorage.removeItem(key); return reply(true, null, null); }
    if (m.op === 'set') {
      if (typeof m.j !== 'string' || m.j.length > LIMITS.storeVal) return reply(false, null, 'size');
      var total = 0, i, k;
      for (i = 0; i < localStorage.length; i++) { k = localStorage.key(i); if (k && k.indexOf(pre) === 0 && k !== key) total += k.length + (localStorage.getItem(k) || '').length; }
      if (total + key.length + m.j.length > LIMITS.storeTotal) return reply(false, null, 'size');
      localStorage.setItem(key, m.j); return reply(true, null, null);
    }
  } catch (e) { return reply(false, null, 'io'); }
  reply(false, null, 'op');
}
/* salvare de fișier cerută de widget (permisiunea «download»): tip MIME din lista albă, mărime limitată, nume sanitizat, cel mult unul la 2 s */
function onSave(st, m, now) {
  var c = checkSave(st.perms, m);
  if (!c.ok || now - st.lastSave < LIMITS.saveEveryMs) return;
  st.lastSave = now;
  var blob;
  try {
    if (c.base64) { var bin = atob(c.data), u = new Uint8Array(bin.length), i; for (i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); blob = new Blob([u], { type: c.mime }); }
    else blob = new Blob([c.mime === 'text/csv' ? '\ufeff' + c.data : c.data], { type: c.mime + ';charset=utf-8' });
  } catch (e) { return; }
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = c.name; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  toast(Tf('file_saved', [c.name]));
}

/* ---------- gazda: telefoane, protocol, activități ---------- */
function startHost() {
  pf.role = 'host';
  pf.roster = new Roster(LIMITS.peers);
  pf.relay = new Bucket(LIMITS.relay.rps, LIMITS.relay.burst, Date.now());
  pf.recs = {}; pf.active = null; pf.instance = 0; pf.rosterAt = 0; clearTimeout(pf.rosterT); pf.rosterT = 0;
  openLive();
}
function addPhone() {
  if (!rtcOk()) { toast(T('no_rtc')); return; }
  FFF.p2p.dialog({ title: T('dlg_host'), onOpen: onPhoneSession });
}
function onPhoneSession(s) {
  if (s.__pf) return;                       // protecție: aceeași sesiune nu se înregistrează de două ori
  s.__pf = true;
  if (!amHost()) { s.close('local'); return; }
  var rec = { session: s, id: null, bucket: null, weak: false, slow: 0, gate: null, all: new Bucket(LIMITS.phone.rps, LIMITS.phone.burst, Date.now()), ctl: new Bucket(LIMITS.ctl.rps, LIMITS.ctl.burst, Date.now()) };
  rec.gate = setTimeout(function () { if (!rec.id) s.close('timeout'); }, 15000);
  s.on('message', function (m) { onPhoneMsg(rec, m); });
  s.on('lost', function () { rec.weak = true; renderLive(); });
  s.on('recovered', function () { rec.weak = false; resync(rec); renderLive(); });
  s.on('close', function () { clearTimeout(rec.gate); phoneGone(rec); });
}
function rosterMsg() { return { t: 'roster', peers: pf.roster.view() }; }
/** După o întrerupere a legăturii: telefonul primește din nou lista și activitatea curentă. «open» este idempotent la telefon (aceeași activitate nu se redeschide). */
function resync(rec) {
  if (!rec.id || pf.recs[rec.id] !== rec || !amHost()) return;
  sendTo(rec, rosterMsg());
  if (pf.active) sendTo(rec, { t: 'open', w: pf.active.w, n: pf.active.n });
}
/** Lista de telefoane către toți: cel mult o dată la LIMITS.rosterEveryMs; o schimbare venită între timp se trimite la capătul intervalului (ultima versiune nu se pierde). */
function pushRoster() {
  var now = Date.now(), wait = pf.rosterAt + LIMITS.rosterEveryMs - now;
  if (wait > 0) { if (!pf.rosterT) pf.rosterT = setTimeout(function () { pf.rosterT = 0; if (pf.role === 'host') pushRoster(); }, wait); return; }
  pf.rosterAt = now;
  broadcast(rosterMsg()); var st = pf.stage; if (st) toWidget(st, { t: 'peers', peers: pf.roster.view() }); renderLive();
}
function onPhoneMsg(rec, m) {
  if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
  var now0 = Date.now();
  if (!rec.all.take(now0)) return;          // inundație: aruncat înainte de orice analiză
  if (!rec.id) {
    if (m.t !== 'hi') return;
    if (m.p !== PROTO) { rec.session.send({ t: 'bye', why: 'proto' }); setTimeout(function () { rec.session.close('local'); }, 200); return; }
    var j = pf.roster.join(typeof m.cid === 'string' ? m.cid : '', typeof m.name === 'string' ? m.name : '');
    if (!j) { rec.session.send({ t: 'bye', why: 'full' }); setTimeout(function () { rec.session.close('local'); }, 200); return; }
    var old = pf.recs[j.peer.id];
    if (old && old !== rec && old.session) { try { old.session.close('replaced'); } catch (e) { /* ignorat */ } }
    rec.id = j.peer.id; clearTimeout(rec.gate);
    var b = pf.stage ? pf.stage.budget.rate : LIMITS.rate.none;
    rec.bucket = new Bucket(b.rps, b.burst, Date.now());
    pf.recs[rec.id] = rec;
    rec.session.send({ t: 'hello', p: PROTO, app: appVer(), you: { id: j.peer.id, name: j.peer.name, color: j.peer.color }, peers: pf.roster.view(), active: pf.active });
    if (pf.active) rec.session.send({ t: 'open', w: pf.active.w, n: pf.active.n });
    toast(Tf('toast_join', [j.peer.name]));
    pushRoster();
    return;
  }
  var peer = pf.roster.find(rec.id);
  if (!peer || pf.recs[rec.id] !== rec) return;
  if (m.t === 'name') { if (!rec.ctl.take(now0)) return; pf.roster.rename(rec.id, typeof m.name === 'string' ? m.name : ''); pushRoster(); }
  else if (m.t === 'rdy') {
    if (!rec.ctl.take(now0)) return;
    var st = pf.stage;
    if (!st || m.w !== st.w || m.n !== st.n) return;
    if (st.stateJ) sendTo(rec, { t: 'ws', w: st.w, n: st.n, j: st.stateJ });
    toWidget(st, { t: 'join', peer: { id: peer.id, name: peer.name, color: peer.color, locked: peer.locked } });
  } else if (m.t === 'w') phoneWidgetMsg(rec, peer, m);
}
function phoneWidgetMsg(rec, peer, m) {
  var st = pf.stage;
  if (!st || peer.locked) return;
  var env = checkEnvelope(m, pf.active, st.perms);
  if (!env.ok) return;
  var now = Date.now();
  if (!rec.bucket || !rec.bucket.take(now)) return;
  var route = routeFromGuest(m.to, rec.id, hereIds());
  if (route.drop) return;
  if (route.host) toWidget(st, { t: 'msg', f: { id: peer.id, name: peer.name, color: peer.color, role: 'guest' }, j: m.j });
  if (route.to.length) {
    var out = { t: 'w', w: st.w, n: st.n, f: peer.id, j: m.j };
    route.to.forEach(function (id) { if (pf.relay.take(now)) sendTo(pf.recs[id], out); });   // un jeton pe livrare: limitează amplificarea 1→N
  }
}
function phoneGone(rec) {
  if (!rec.id || pf.recs[rec.id] !== rec) return;
  var p = pf.roster.leave(rec.id);
  delete pf.recs[rec.id];
  if (pf.stage) toWidget(pf.stage, { t: 'leave', peer: { id: rec.id, name: p ? p.name : '', color: p ? p.color : '' } });
  if (p) toast(Tf('toast_left', [p.name]));
  pushRoster();
}
function removePhone(id) { var rec = pf.recs[id]; if (rec && rec.session) { rec.session.send({ t: 'bye', why: 'removed' }); setTimeout(function () { rec.session.close('local'); }, 200); } }
function lockPhone(id, on) { pf.roster.setLocked(id, on); pushRoster(); }
function lockAll(on) { pf.roster.setLockAll(on); pushRoster(); renderLive(true); }
function openActivity(wid) {
  if (!amHost() || !DATA[wid]) return;
  var cp = checkPerms(DATA[wid].permissions);
  if (!cp.ok) { toast(Tf('err_perm', [wName(DATA[wid])])); return; }
  pf.instance += 1;
  pf.active = { w: wid, n: pf.instance };
  if (!openStage(wid, pf.instance)) { pf.active = null; return; }
  broadcast({ t: 'open', w: wid, n: pf.instance });
}
function closeActivity() {
  if (!amHost()) return;
  pf.active = null; closeStage();
  broadcast({ t: 'close' });
}

/* ---------- telefonul: legătura cu proiectorul ---------- */
function sayHi(session) { return session.send({ t: 'hi', p: PROTO, app: appVer(), name: pf.name, cid: pf.cid, lang: pf.lang }); }
function startGuest(session) {
  if (session.__pf) return;                 // protecție: aceeași sesiune nu pornește de două ori
  session.__pf = true;
  pf.role = 'guest'; pf.session = session; pf.lost = false; pf.weak = false; pf.me = null; pf.gpeers = []; pf.active = null;
  pf.inb = new Bucket(LIMITS.relay.rps, LIMITS.relay.burst, Date.now());   // un proiector ostil nu poate inunda telefonul
  session.on('message', onHostMsg);
  session.on('lost', function () { pf.weak = true; renderLive(); });
  session.on('recovered', function () { pf.weak = false; renderLive(); });
  session.on('close', function () { if (pf.role === 'guest') { pf.lost = true; closeStage(); renderLive(); } });
  sayHi(session);
  // salutul se repetă până vine «hello» (un mesaj sosit la gazdă înaintea evenimentului ei «open» s-ar putea pierde; gazda ignoră dublurile)
  clearInterval(pf.hiT);
  pf.hiT = setInterval(function () {
    if (pf.role !== 'guest' || pf.me || pf.session !== session) { clearInterval(pf.hiT); return; }
    sayHi(session);
  }, 1500);
  clearTimeout(pf.helloT);
  pf.helloT = setTimeout(function () { if (pf.role === 'guest' && !pf.me) { pf.msg = T('err_proto'); endLocal(); } }, 10000);
}
function joinSession() {
  if (!rtcOk()) { toast(T('no_rtc')); return; }
  FFF.p2p.dialog({ title: T('dlg_guest'), onOpen: startGuest });
}
function onHostMsg(m) {
  if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
  if (pf.inb && !pf.inb.take(Date.now())) return;
  if (m.t === 'hello') {
    if (m.p !== PROTO || !m.you || typeof m.you.id !== 'string' || m.you.id.length > 12 || !Array.isArray(m.peers)) { pf.msg = T('err_proto'); endLocal(); return; }
    clearTimeout(pf.helloT); clearInterval(pf.hiT);
    pf.me = { id: m.you.id, name: cleanName(m.you.name, 'P'), color: okColor(m.you.color) };
    pf.gpeers = cleanPeers(m.peers);
    openLive();
    if (m.active && okWid(m.active.w) && typeof m.active.n === 'number') guestOpen(m.active.w, m.active.n);
  } else if (!pf.me) return;
  else if (m.t === 'roster' && Array.isArray(m.peers)) {
    var was = myLocked();
    var before = pf.gpeers.map(function (p) { return p.id; });
    pf.gpeers = cleanPeers(m.peers);
    var st = pf.stage;
    if (st) {
      toWidget(st, { t: 'peers', peers: peersView() });
      pf.gpeers.forEach(function (p) { if (before.indexOf(p.id) < 0) toWidget(st, { t: 'join', peer: p }); });
      before.forEach(function (id) { if (!pf.gpeers.some(function (p) { return p.id === id; })) toWidget(st, { t: 'leave', peer: { id: id } }); });
      if (was !== myLocked()) toWidget(st, { t: 'lock', locked: myLocked() });
    }
    renderLive();
  } else if (m.t === 'open' && okWid(m.w) && typeof m.n === 'number') {
    if (pf.stage && pf.stage.w === m.w && pf.stage.n === m.n) return;      // dublură (după «hello» cu «active», sau după o resincronizare): activitatea rămâne cum este
    guestOpen(m.w, m.n);
  }
  else if (m.t === 'close') { pf.active = null; closeStage(); }
  else if (m.t === 'w' && pf.stage && m.w === pf.stage.w && m.n === pf.stage.n && typeof m.j === 'string' && m.j.length <= 70000) {
    var f = fromView(m.f);
    if (f) toWidget(pf.stage, { t: 'msg', f: f, j: m.j });
  } else if (m.t === 'ws' && pf.stage && m.w === pf.stage.w && m.n === pf.stage.n && typeof m.j === 'string' && m.j.length <= LIMITS.state) {
    var r = parseJson(m.j, LIMITS.state);
    if (r.ok) { pf.stage.state = r.v; pf.stage.stateJ = m.j; toWidget(pf.stage, { t: 'state', j: m.j }); }
  } else if (m.t === 'bye') {
    pf.msg = m.why === 'full' ? Tf('err_full', [LIMITS.peers]) : (m.why === 'proto' ? T('err_proto') : (m.why === 'removed' ? T('msg_removed') : T('msg_end')));
    endLocal();
  }
}
function cleanPeers(list) {
  return list.slice(0, LIMITS.peers + 1).filter(function (p) { return p && typeof p.id === 'string' && p.id.length <= 12; })
    .map(function (p) { return { id: p.id, name: cleanName(p.name, 'P'), color: okColor(p.color), locked: !!p.locked }; });
}
function guestOpen(w, n) {
  if (!DATA[w]) return;
  pf.active = { w: w, n: n };
  openStage(w, n);
}

/* ---------- vederea sesiunii: strat fix peste pagină (persistă la schimbarea limbii) ---------- */
function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
function fsCan() { var d = document.documentElement; return !!(d.requestFullscreen || d.webkitRequestFullscreen) && document.fullscreenEnabled !== false && document.webkitFullscreenEnabled !== false; }
function fsToggle() {
  var d = document.documentElement;
  try {
    if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    var p = (d.requestFullscreen || d.webkitRequestFullscreen).call(d);
    if (p && p.catch) p.catch(function () { /* refuzat de browser */ });
  } catch (e) { /* ignorat */ }
}
function wakeSet(on) {
  pf.wakeOn = !!on;
  if (!on) { if (pf.wake) { try { pf.wake.release(); } catch (e) { /* ignorat */ } pf.wake = null; } return; }
  if (!navigator.wakeLock || pf.wake || document.visibilityState === 'hidden') return;
  navigator.wakeLock.request('screen').then(function (l) {
    if (!pf.wakeOn) { try { l.release(); } catch (e) { /* ignorat */ } return; }
    pf.wake = l;
    if (l.addEventListener) l.addEventListener('release', function () { if (pf.wake === l) pf.wake = null; });
  }, function () { pf.wakeOn = false; renderLive(true); });
}
function applyLook() {
  var r = pf.els.root;
  if (!r) return;
  r.classList[pf.hc ? 'add' : 'remove']('pf-hc');
  r.classList[pf.xl ? 'add' : 'remove']('pf-xl');
}
function pushTheme(force) {
  var th = themeView(), j = JSON.stringify(th);
  if (!force && pf.themeJ === j) return;
  pf.themeJ = j;
  applyLook();
  if (pf.stage) toWidget(pf.stage, { t: 'theme', theme: th });
}
function applyLayout() {
  var E = pf.els;
  if (!E.main) return;
  E.main.classList[pf.hideSide ? 'add' : 'remove']('pf-noside');
  if (E.side) E.side.hidden = !!pf.hideSide;
}
/** Păstrează focusul pe același control (după data-fid) când un fragment al vederii este refăcut. */
function keepFocus(fn) {
  var a = document.activeElement, id = a && a.getAttribute ? a.getAttribute('data-fid') : null, was = !!(id && pf.els.root && pf.els.root.contains(a));
  fn();
  if (was) {
    var n = pf.els.root.querySelector('[data-fid="' + id + '"]');
    if (n && n !== document.activeElement) n.focus();
  }
}
function pageNodes() {
  var out = [], kids = document.body.children, i, e;
  for (i = 0; i < kids.length; i++) {
    e = kids[i];
    if (e === pf.els.root || /^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT|DIALOG)$/.test(e.tagName)) continue;
    if (/(^|\s)fff-/.test(typeof e.className === 'string' ? e.className : '') || /^fff-/.test(e.id || '')) continue;
    out.push(e);
  }
  return out;
}
function hidePage() {
  if (pf.hidden.length) return;
  pf.hidden = pageNodes().map(function (e) {
    var prev = { e: e, ah: e.getAttribute('aria-hidden'), inert: e.hasAttribute('inert') };
    e.setAttribute('aria-hidden', 'true'); e.setAttribute('inert', '');
    return prev;
  });
}
function showPage() {
  pf.hidden.forEach(function (p) {
    if (p.ah == null) p.e.removeAttribute('aria-hidden'); else p.e.setAttribute('aria-hidden', p.ah);
    if (!p.inert) p.e.removeAttribute('inert');
  });
  pf.hidden = [];
}
function trapFocus(e) {
  var r = pf.els.root, t = e.target;
  if (!r || !t || r.contains(t)) return;
  if (t.closest && t.closest('[class*="fff-"],[id^="fff-"],dialog')) return;
  var f = r.querySelector('button:not([disabled]),select,input,summary');
  if (f) f.focus(); else r.focus();
}
function tbtn(label, o) {
  var b = h('button', {
    type: 'button', class: 'pf-btn' + (o.cls ? ' ' + o.cls : ''), text: label, 'data-fid': o.fid || null,
    'aria-pressed': o.pressed == null ? null : String(!!o.pressed), 'aria-expanded': o.expanded == null ? null : String(!!o.expanded),
    'aria-controls': o.controls || null, 'aria-label': o.label || null, on: { click: o.click }
  });
  if (o.disabled) b.disabled = true;
  return b;
}
function langSelect() {
  var src = document.getElementById('langsel');
  var sel = h('select', {
    class: 'pf-sel', 'aria-label': T('lang_lbl'), 'data-fid': 'lang',
    on: { change: function () { var s = document.getElementById('langsel'); if (s) { s.value = sel.value; s.dispatchEvent(new Event('change', { bubbles: true })); } } }
  });
  if (src) Array.prototype.forEach.call(src.options, function (o) {
    var op = document.createElement('option');
    op.value = o.value; op.textContent = o.textContent; if (o.value === pf.lang) op.selected = true;
    sel.appendChild(op);
  });
  return sel;
}
function buildLive() {
  var E = pf.els;
  E.root = h('div', { class: 'pf-live', id: 'pf-live', role: 'region', tabindex: '-1' });
  E.bar = h('div', { class: 'pf-bar' });
  E.side = h('div', { class: 'pf-side', id: 'pf-side' });
  E.holder = h('div', { class: 'pf-holder' });
  E.idle = h('p', { class: 'pf-idle' });
  E.banner = h('p', { class: 'pf-banner', role: 'status' });
  E.stage = h('section', { class: 'pf-stage' }, [E.holder, E.idle, E.banner]);
  E.main = h('div', { class: 'pf-main' }, amHost() ? [E.side, E.stage] : [E.stage]);
  E.toast = h('div', { class: 'pf-toast', role: 'status', 'aria-live': 'polite' });
  E.root.appendChild(E.bar); E.root.appendChild(E.main); E.root.appendChild(E.toast);
  document.body.appendChild(E.root);
}
function renderBar() {
  var E = pf.els, host = amHost(), look, row;
  if (!E.bar) return;
  E.root.setAttribute('aria-label', T('live_label'));
  keepFocus(function () {
    E.bar.textContent = '';
    E.status = h('span', { class: 'pf-state', role: 'status', 'aria-live': 'polite' });
    var left = h('div', { class: 'pf-id' }, [h('span', { class: 'pf-badge', text: host ? T('b_host') : T('b_guest') }), h('strong', { class: 'pf-ttl', text: T('title') }), E.status]);
    var acts = h('div', { class: 'pf-acts-bar' });
    if (host) {
      acts.appendChild(tbtn(T('add_phone'), { cls: 'pf-pri', fid: 'add', click: addPhone }));
      acts.appendChild(tbtn(pf.roster.lockAll ? T('unlock_all') : T('lock_all'), { fid: 'lockall', pressed: pf.roster.lockAll, click: function () { lockAll(!pf.roster.lockAll); } }));
      acts.appendChild(tbtn(T('controls'), { fid: 'ctl', expanded: !pf.hideSide, controls: 'pf-side', click: function () { pf.hideSide = !pf.hideSide; applyLayout(); renderBar(); } }));
    }
    row = h('div', { class: 'pf-lookrow' });
    if (fsCan()) row.appendChild(tbtn(fsEl() ? T('fs_exit') : T('fs'), { fid: 'fs', pressed: !!fsEl(), click: fsToggle }));
    row.appendChild(tbtn(T('theme'), { fid: 'theme', click: function () { var b = document.getElementById('themebtn'); if (b) b.click(); pushTheme(); } }));
    row.appendChild(tbtn(T('hc'), { fid: 'hc', pressed: pf.hc, click: function () { pf.hc = !pf.hc; saveSet(); pushTheme(true); renderBar(); } }));
    row.appendChild(tbtn(T('xl'), { fid: 'xl', pressed: pf.xl, click: function () { pf.xl = !pf.xl; saveSet(); pushTheme(true); renderBar(); } }));
    if (navigator.wakeLock) row.appendChild(tbtn(T('wake'), { fid: 'wake', pressed: !!pf.wake, click: function () { wakeSet(!pf.wakeOn); setTimeout(function () { renderBar(); }, 400); } }));
    row.appendChild(langSelect());
    look = h('details', { class: 'pf-look' }, [h('summary', { text: T('h_look'), 'data-fid': 'look' }), row]);
    if (pf.lookOpen) look.open = true;
    look.addEventListener('toggle', function () { pf.lookOpen = look.open; });
    acts.appendChild(look);
    acts.appendChild(tbtn(host ? (pf.endSure ? T('end_sure') : T('end')) : T('leave'), { cls: 'pf-danger', fid: 'end', click: host ? endSession : leaveSession }));
    E.bar.appendChild(left); E.bar.appendChild(acts);
  });
  renderStatus();
}
function renderSide() {
  var E = pf.els;
  if (!amHost() || !E.side) return;
  keepFocus(function () {
    E.side.textContent = '';
    var ul = h('ul', { class: 'pf-list' });
    widgetList().forEach(function (d) {
      var on = !!(pf.active && pf.active.w === d.id), ok = checkPerms(d.permissions).ok, nm = wName(d), btn;
      if (!ok) btn = tbtn(Tf('err_perm', [nm]), { fid: 'a-' + d.id, disabled: true });
      else if (on) btn = tbtn(T('act_close'), { fid: 'a-' + d.id, label: T('act_close') + ': ' + nm, click: closeActivity });
      else btn = tbtn(T('act_open'), { cls: 'pf-pri', fid: 'a-' + d.id, label: T('act_open') + ': ' + nm, click: function () { openActivity(d.id); } });
      ul.appendChild(h('li', { class: 'pf-act' + (on ? ' on' : ''), 'aria-current': on ? 'true' : null }, [
        h('strong', { class: 'pf-actn', text: nm }), h('span', { class: 'pf-actd', text: wDesc(d) }),
        ok ? h('span', { class: 'pf-actp', text: Tf('perms', [permText(d)]) }) : null, btn
      ]));
    });
    E.side.appendChild(h('section', { class: 'pf-sec', 'aria-labelledby': 'pf-h-act' }, [h('h2', { id: 'pf-h-act', text: T('act_h') }), h('p', { class: 'pf-note', text: T('act_pick') }), ul]));
    var peers = pf.roster.view(), rl = h('ul', { class: 'pf-list pf-peers', 'aria-label': T('roster_aria') });
    peers.forEach(function (p) {
      var rec = pf.recs[p.id], dot = h('span', { class: 'pf-dot', 'aria-hidden': 'true' });
      if (p.color) dot.style.backgroundColor = p.color;
      rl.appendChild(h('li', { class: 'pf-peer' + (p.locked ? ' lk' : '') }, [
        dot, h('span', { class: 'pf-pn', text: p.name }),
        p.locked ? h('span', { class: 'pf-tag', text: T('peer_locked') }) : null,
        rec && rec.weak ? h('span', { class: 'pf-tag warn', text: T('st_weak') }) : null,
        tbtn(p.locked ? Tf('peer_unlock', [p.name]) : Tf('peer_lock', [p.name]), { fid: 'l-' + p.id, click: function () { lockPhone(p.id, !p.locked); } }),
        tbtn(Tf('peer_remove', [p.name]), { fid: 'r-' + p.id, click: function () { removePhone(p.id); } })
      ]));
    });
    E.side.appendChild(h('section', { class: 'pf-sec', 'aria-labelledby': 'pf-h-ros' }, [
      h('h2', { id: 'pf-h-ros', text: T('roster_h') + ' (' + peers.length + ')' }),
      peers.length ? rl : h('p', { class: 'pf-note', text: T('roster_empty') })
    ]));
  });
}
function renderStatus() {
  var E = pf.els, s, host = amHost(), lk;
  if (!E.root) return;
  if (host) { var n = pf.roster ? pf.roster.here().length : 0; s = n ? Tf('peers_n', [n]) : T('st_wait'); }
  else s = pf.lost ? T('st_lost') : (pf.weak ? T('st_weak') : T('st_conn'));
  if (E.status && E.status.textContent !== s) E.status.textContent = s;
  E.idle.hidden = !!pf.stage;
  E.idle.setAttribute('role', pf.lost ? 'alert' : 'status');
  E.idle.textContent = pf.stage ? '' : (host ? T('act_none') : (pf.lost ? T('st_lost') : T('act_wait')));
  lk = !host && !pf.lost && myLocked();
  E.banner.hidden = !lk;
  E.banner.textContent = lk ? T('banner_locked') : '';
  E.stage.setAttribute('aria-label', pf.stage ? Tf('frame_title', [wName(pf.stage.desc)]) : T('live_label'));
  if (pf.stage && pf.stage.iframe) pf.stage.iframe.setAttribute('title', Tf('frame_title', [wName(pf.stage.desc)]));
}
function renderLive(full) {
  if (!pf.els.root) return;
  if (full) renderBar();
  renderSide(); renderStatus();
}
function openLive() {
  if (pf.els.root) { renderLive(true); return; }
  pf.prevFocus = document.activeElement;
  buildLive();
  hidePage(); applyLook(); applyLayout();
  renderLive(true);
  document.addEventListener('focusin', trapFocus);
  wakeSet(true);
  pf.els.root.focus();
}
function closeLive() {
  var E = pf.els;
  if (!E.root) return;
  document.removeEventListener('focusin', trapFocus);
  wakeSet(false);
  if (fsEl()) fsToggle();
  clearTimeout(pf.toastT);
  if (E.root.parentNode) E.root.parentNode.removeChild(E.root);
  pf.els = {};
  showPage();
  try { if (pf.prevFocus && pf.prevFocus.focus && document.contains(pf.prevFocus)) pf.prevFocus.focus(); } catch (e) { /* ignorat */ }
}
function endSession() {
  if (!pf.endSure) {
    pf.endSure = true; renderBar();
    clearTimeout(pf.endT);
    pf.endT = setTimeout(function () { pf.endSure = false; renderBar(); }, 4000);
    return;
  }
  clearTimeout(pf.endT); pf.endSure = false;
  var recs = pf.recs;
  broadcast({ t: 'bye', why: 'end' });
  setTimeout(function () { Object.keys(recs).forEach(function (id) { try { recs[id].session.close('local'); } catch (e) { /* ignorat */ } }); }, 300);
  pf.msg = '';
  endLocal();
}
function leaveSession() { pf.msg = ''; endLocal(); }
/** Încheie sesiunea local: oprește scena, închide legăturile, scoate stratul și reafișează cardul. */
function endLocal() {
  var s = pf.session;
  clearTimeout(pf.helloT); clearInterval(pf.hiT); clearTimeout(pf.endT); clearTimeout(pf.rosterT); pf.rosterT = 0;
  pf.role = null; pf.session = null; pf.endSure = false;
  closeStage();
  if (s) { try { s.close('local'); } catch (e) { /* ignorat */ } }
  pf.roster = null; pf.recs = {}; pf.active = null; pf.me = null; pf.gpeers = []; pf.lost = false; pf.weak = false;
  closeLive();
  renderCard();
}

/* ---------- cardul din pagină: alegerea rolului ---------- */
function chk(id, label, on, fn) {
  return h('label', { class: 'pf-chk', for: id }, [h('input', { type: 'checkbox', id: id, checked: on, on: { change: function (e) { fn(e.target.checked); } } }), ' ' + label]);
}
function renderCard() {
  var el = pf.card;
  if (!el) return;
  el.textContent = '';
  var nameIn = h('input', { type: 'text', id: 'pf-name', class: 'pf-in', maxlength: '24', autocomplete: 'nickname', autocapitalize: 'words', spellcheck: 'false', value: pf.name, 'aria-describedby': 'pf-name-h' });
  nameIn.addEventListener('input', function () { pf.name = cleanName(nameIn.value, ''); saveSet(); });
  var kids = [h('p', { class: 'note', text: T('intro') })];
  if (!rtcOk()) kids.push(h('p', { class: 'pf-warn', text: T('no_rtc') }));
  kids.push(h('div', { class: 'pf-msg', role: 'status', 'aria-live': 'polite', text: pf.msg || '' }));
  kids.push(h('h3', { text: T('h_role') }));
  kids.push(h('div', { class: 'pf-roles' }, [
    h('div', { class: 'pf-role' }, [
      h('h4', { text: T('role_host') }), h('p', { text: T('role_host_d') }),
      h('button', { type: 'button', class: 'btn pri', id: 'pf-start-host', text: T('start_host'), on: { click: function () { pf.msg = ''; startHost(); } } })
    ]),
    h('div', { class: 'pf-role' }, [
      h('h4', { text: T('role_guest') }), h('p', { text: T('role_guest_d') }),
      h('label', { for: 'pf-name', text: T('lbl_name') }), nameIn, h('p', { id: 'pf-name-h', class: 'note', text: T('name_hint') }),
      h('button', { type: 'button', class: 'btn pri', id: 'pf-start-guest', text: T('start_guest'), on: { click: function () { pf.msg = ''; pf.name = cleanName(nameIn.value, ''); saveSet(); joinSession(); } } })
    ])
  ]));
  kids.push(h('h3', { text: T('h_look') }));
  kids.push(h('div', { class: 'pf-looks' }, [
    chk('pf-hc', T('hc'), pf.hc, function (v) { pf.hc = v; saveSet(); pushTheme(true); }),
    chk('pf-xl', T('xl'), pf.xl, function (v) { pf.xl = v; saveSet(); pushTheme(true); })
  ]));
  kids.push(h('h3', { text: T('h_know') }));
  kids.push(h('ul', { class: 'pf-know' }, ['k1', 'k2', 'k3', 'k4'].map(function (k) { return h('li', { text: T(k) }); })));
  kids.forEach(function (k) { el.appendChild(k); });
}
var pfInited = false;
function initOnce() {
  if (pfInited) return;
  pfInited = true;
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (n) { document.addEventListener(n, function () { if (pf.els.root) renderBar(); }); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible' && pf.wakeOn && !pf.wake && pf.els.root) wakeSet(true); });
  if (window.MutationObserver) new MutationObserver(function () { pushTheme(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  var mq = window.matchMedia && matchMedia('(prefers-color-scheme: light)');
  if (mq) { if (mq.addEventListener) mq.addEventListener('change', function () { pushTheme(); }); else if (mq.addListener) mq.addListener(function () { pushTheme(); }); }
  window.addEventListener('beforeunload', function (e) {
    if (pf.role === 'host' && pf.roster && pf.roster.here().length) { e.preventDefault(); e.returnValue = ''; return ''; }
  });
}
function mount(el, lang) {
  var card = el.parentNode;
  if (card && card.classList) card.classList.add('in');
  var changed = pf.lang !== lang;
  pf.card = el; pf.lang = lang;
  initOnce();
  renderCard();
  if (pf.els.root) {
    renderLive(true);
    if (changed && pf.stage) toWidget(pf.stage, { t: 'lang', lang: lang });
  }
}
