/* PROIECTOR FĂRĂ FRONTIERE · sandbox.js — rulează NUMAI în iframe-ul izolat al unui widget (srcdoc, sandbox="allow-scripts", fără allow-same-origin).
   Aici nu există nimic din pagina-gazdă: nici DOM-ul ei, nici stocarea, nici cookie-urile, nici rețeaua (CSP). Singura punte este un MessagePort privat primit la pornire.
   Tot ce iese pe port este un șir JSON (câmpul j) pe care gazda îl validează (tip, mărime, permisiuni, ritm). Cod ES2017, fără dependențe. */
var PFS = (function () {
  'use strict';
  var port = null, W = null, api = null, lang = 'en', peers = [], rid = 0, waiting = {}, LIVE = null;
  var L = { message: [], join: [], leave: [], peers: [], lock: [], state: [], lang: [], theme: [] };
  var ROOT = document.getElementById('root');
  var COMMON = {
    en: { locked: 'Locked by the teacher', host: 'Projector', you: 'you', werr: 'This widget stopped working.' },
    ro: { locked: 'Blocat de profesor', host: 'Proiector', you: 'tu', werr: 'Acest widget s-a oprit din funcționare.' },
    fr: { locked: 'Verrouillé par l’enseignant', host: 'Projecteur', you: 'vous', werr: 'Ce widget a cessé de fonctionner.' },
    de: { locked: 'Von der Lehrkraft gesperrt', host: 'Projektor', you: 'du', werr: 'Dieses Widget funktioniert nicht mehr.' },
    es: { locked: 'Bloqueado por el docente', host: 'Proyector', you: 'tú', werr: 'Este widget ha dejado de funcionar.' },
    it: { locked: 'Bloccato dall’insegnante', host: 'Proiettore', you: 'tu', werr: 'Questo widget ha smesso di funzionare.' },
    hu: { locked: 'A tanár zárolta', host: 'Kivetítő', you: 'te', werr: 'Ez a modul leállt.' },
    pt: { locked: 'Bloqueado pelo professor', host: 'Projetor', you: 'você', werr: 'Este widget deixou de funcionar.' }
  };

  function post(m) { if (!port) return false; try { port.postMessage(m); return true; } catch (e) { return false; } }
  function jstr(v) { try { var s = JSON.stringify(v); return typeof s === 'string' ? s : null; } catch (e) { return null; } }
  function jparse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function err(e) { post({ t: 'err', m: String((e && e.message) || e).slice(0, 160) }); }
  function emit(ev, a, b) {
    var l = L[ev]; if (!l) return;
    l.slice().forEach(function (f) { try { f(a, b); } catch (e) { err(e); } });
  }
  function applyTheme(th) {
    var c = document.documentElement.classList;
    th = th || {};
    c[th.dark ? 'add' : 'remove']('t-dark'); c[th.hc ? 'add' : 'remove']('t-hc'); c[th.xl ? 'add' : 'remove']('t-xl');
  }
  /** Traducere: textele widgetului (strings[lang] → strings.en) apoi cele comune; {n} se înlocuiește din vars. */
  function t(key, vars) {
    var S = (W && W.strings) || {}, d = S[lang] || {}, e = S.en || {}, c = COMMON[lang] || COMMON.en;
    var s = d[key] != null ? d[key] : (e[key] != null ? e[key] : (c[key] != null ? c[key] : (COMMON.en[key] != null ? COMMON.en[key] : key)));
    return vars ? String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }) : String(s);
  }
  /** Creează un element. props: class, text, on:{ev:fn}, css:{--x:v} (CSSOM, nu atribut style=), data:{k:v}, value/checked/disabled/hidden/selected sunt proprietăți; restul sunt atribute. */
  function h(tag, p, kids) {
    var e = document.createElement(tag);
    p = p || {};
    Object.keys(p).forEach(function (k) {
      var v = p[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (n) { e.addEventListener(n, v[n]); });
      else if (k === 'css') Object.keys(v).forEach(function (n) { e.style.setProperty(n, v[n]); });
      else if (k === 'data') Object.keys(v).forEach(function (n) { e.setAttribute('data-' + n, v[n]); });
      else if (k === 'value') e.value = v;
      else if (k === 'checked' || k === 'disabled' || k === 'hidden' || k === 'selected') e[k] = true;
      else e.setAttribute(k, v === true ? '' : String(v));
    });
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    });
    return e;
  }
  function announce(text) { if (LIVE) { LIVE.textContent = ''; LIVE.textContent = String(text).slice(0, 200); } }
  function ask(m) {
    return new Promise(function (res, rej) {
      var id = ++rid; waiting[id] = { res: res, rej: rej };
      m.t = 'store'; m.id = id;
      if (!post(m)) { delete waiting[id]; rej(new Error('closed')); }
    });
  }
  function crash(e) {
    err(e);
    ROOT.textContent = '';
    ROOT.appendChild(h('p', { class: 'pfs-card pfs-bad', role: 'alert', text: t('werr') }));
  }
  function init(m) {
    if (api) return;
    lang = m.lang || 'en'; peers = m.peers || [];
    document.documentElement.lang = lang; applyTheme(m.theme);
    if (m.locked) document.documentElement.setAttribute('data-locked', '1');
    LIVE = h('div', { class: 'pfs-sr', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(LIVE);
    api = {
      id: m.id, version: m.version, role: m.role, me: m.me, lang: lang, locked: !!m.locked, perms: (m.perms || []).slice(), theme: m.theme || {},
      state: m.state === undefined ? null : m.state,
      peers: function () { return peers.slice(); },
      /** d = date JSON; o.to = 'all' (implicit) | 'host' | id-ul unui telefon. Returnează false dacă nu poate fi trimis. */
      send: function (d, o) { var j = jstr(d); if (j === null) return false; return post({ t: 'send', j: j, to: (o && o.to) || 'all' }); },
      /** Doar gazda: starea comună (≤ 16 KiB), trimisă automat telefoanelor (și celor care intră mai târziu). */
      setState: function (s) { var j = jstr(s); if (j === null) return false; api.state = jparse(j); return post({ t: 'state', j: j }); },
      on: function (a, b) {
        var ev = typeof a === 'function' ? 'message' : a, fn = typeof a === 'function' ? a : b;
        if (!L[ev] || typeof fn !== 'function') return function () {};
        L[ev].push(fn);
        return function () { var i = L[ev].indexOf(fn); if (i >= 0) L[ev].splice(i, 1); };
      },
      /** Necesită permisiunea «storage»; fiecare widget are propriul spațiu, pe acest dispozitiv. */
      store: {
        get: function (k) { return ask({ op: 'get', k: String(k) }); },
        set: function (k, v) { var j = jstr(v); if (j === null) return Promise.reject(new Error('json')); return ask({ op: 'set', k: String(k), j: j }); },
        remove: function (k) { return ask({ op: 'del', k: String(k) }); }
      },
      /** Necesită permisiunea «download»: gazda oferă fișierul spre salvare (imagine PNG sau text ≤ limite). data = URL data: pentru imagini, text pentru restul. */
      save: function (name, mime, data) { return post({ t: 'save', name: String(name), mime: String(mime), data: String(data) }); },
      announce: announce, t: t, h: h
    };
    try { W.mount(ROOT, api); } catch (e) { crash(e); return; }
    post({ t: 'mounted' });
  }
  function onPort(ev) {
    var m = ev.data;
    if (!m || typeof m !== 'object' || typeof m.t !== 'string') return;
    try {
      if (m.t === 'init') { init(m); return; }
      if (!api) return;
      if (m.t === 'msg') { if (typeof m.j === 'string') emit('message', jparse(m.j), m.f || {}); }
      else if (m.t === 'state') { if (typeof m.j === 'string') { api.state = jparse(m.j); emit('state', api.state); } }
      else if (m.t === 'peers') { peers = m.peers || []; emit('peers', peers.slice()); }
      else if (m.t === 'join') emit('join', m.peer);
      else if (m.t === 'leave') emit('leave', m.peer);
      else if (m.t === 'lock') {
        api.locked = !!m.locked;
        if (api.locked) document.documentElement.setAttribute('data-locked', '1'); else document.documentElement.removeAttribute('data-locked');
        emit('lock', api.locked);
      } else if (m.t === 'lang') { lang = m.lang || 'en'; api.lang = lang; document.documentElement.lang = lang; emit('lang', lang); }
      else if (m.t === 'theme') { applyTheme(m.theme); api.theme = m.theme || {}; emit('theme', api.theme); }
      else if (m.t === 'store') {
        var w = waiting[m.id]; if (!w) return; delete waiting[m.id];
        if (m.ok) w.res(typeof m.j === 'string' ? jparse(m.j) : null); else w.rej(new Error(m.e || 'denied'));
      } else if (m.t === 'bye') {
        if (W && W.unmount) { try { W.unmount(); } catch (e) { /* ignorat */ } }
        ROOT.textContent = '';
      }
    } catch (e) { err(e); }
  }
  window.addEventListener('message', function (e) {
    if (port || e.source !== window.parent || !e.data || e.data.pfs !== 1 || !e.ports || !e.ports[0]) return;
    port = e.ports[0]; port.onmessage = onPort; post({ t: 'ready' });
  });
  return { start: function (w) { W = w; } };
})();
