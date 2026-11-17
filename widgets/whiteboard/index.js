/* Tablă comună. Fiecare telefon desenează cu culoarea lui (atribuită de gazdă); gazda desenează cu culoarea textului temei.
   Liniile circulă ca mesaje mici (puncte în coordonate logice 1600×900), retransmise de gazdă; cine intră mai târziu primește tabla de la gazdă.
   Permisiuni: «drawing» (ritm mai mare de mesaje) și «download» (salvare PNG). Limite: 600 de linii și 60 000 de puncte pe tablă, cele mai vechi se elimină. */
export const strings = {
  en: { title: 'Whiteboard', pen: 'Pen size', s: 'Thin', m: 'Medium', l: 'Thick', undo: 'Undo my last stroke', clrm: 'Clear my drawing', clra: 'Clear everything', sure: 'Click again to confirm', save: 'Save as image (PNG)', legend: 'Colours', canvas: 'Whiteboard drawing area. Draw with a finger or the mouse.', hint: 'Draw with your finger or the mouse.' },
  ro: { title: 'Tablă', pen: 'Grosimea creionului', s: 'Subțire', m: 'Medie', l: 'Groasă', undo: 'Anulează ultima mea linie', clrm: 'Șterge desenul meu', clra: 'Șterge tot', sure: 'Apasă din nou pentru confirmare', save: 'Salvează ca imagine (PNG)', legend: 'Culori', canvas: 'Zona de desen a tablei. Desenează cu degetul sau cu mouse-ul.', hint: 'Desenează cu degetul sau cu mouse-ul.' },
  fr: { title: 'Tableau blanc', pen: 'Taille du crayon', s: 'Fin', m: 'Moyen', l: 'Épais', undo: 'Annuler mon dernier trait', clrm: 'Effacer mon dessin', clra: 'Tout effacer', sure: 'Cliquez à nouveau pour confirmer', save: 'Enregistrer en image (PNG)', legend: 'Couleurs', canvas: 'Zone de dessin du tableau. Dessinez avec le doigt ou la souris.', hint: 'Dessinez avec le doigt ou la souris.' },
  de: { title: 'Whiteboard', pen: 'Stiftstärke', s: 'Dünn', m: 'Mittel', l: 'Dick', undo: 'Meinen letzten Strich zurücknehmen', clrm: 'Meine Zeichnung löschen', clra: 'Alles löschen', sure: 'Zum Bestätigen erneut klicken', save: 'Als Bild speichern (PNG)', legend: 'Farben', canvas: 'Zeichenfläche des Whiteboards. Mit Finger oder Maus zeichnen.', hint: 'Mit Finger oder Maus zeichnen.' },
  es: { title: 'Pizarra', pen: 'Grosor del lápiz', s: 'Fino', m: 'Medio', l: 'Grueso', undo: 'Deshacer mi último trazo', clrm: 'Borrar mi dibujo', clra: 'Borrar todo', sure: 'Pulsa de nuevo para confirmar', save: 'Guardar como imagen (PNG)', legend: 'Colores', canvas: 'Zona de dibujo de la pizarra. Dibuja con el dedo o el ratón.', hint: 'Dibuja con el dedo o el ratón.' },
  it: { title: 'Lavagna', pen: 'Spessore della penna', s: 'Sottile', m: 'Medio', l: 'Spesso', undo: 'Annulla il mio ultimo tratto', clrm: 'Cancella il mio disegno', clra: 'Cancella tutto', sure: 'Tocca di nuovo per confermare', save: 'Salva come immagine (PNG)', legend: 'Colori', canvas: 'Area di disegno della lavagna. Disegna con il dito o il mouse.', hint: 'Disegna con il dito o il mouse.' },
  hu: { title: 'Tábla', pen: 'Toll vastagsága', s: 'Vékony', m: 'Közepes', l: 'Vastag', undo: 'Utolsó vonalam visszavonása', clrm: 'Saját rajzom törlése', clra: 'Mindent töröl', sure: 'A megerősítéshez kattints újra', save: 'Mentés képként (PNG)', legend: 'Színek', canvas: 'A tábla rajzterülete. Rajzolj ujjal vagy egérrel.', hint: 'Rajzolj ujjal vagy egérrel.' },
  pt: { title: 'Quadro', pen: 'Espessura do lápis', s: 'Fino', m: 'Médio', l: 'Grosso', undo: 'Desfazer o meu último traço', clrm: 'Apagar o meu desenho', clra: 'Apagar tudo', sure: 'Toque de novo para confirmar', save: 'Guardar como imagem (PNG)', legend: 'Cores', canvas: 'Área de desenho do quadro. Desenhe com o dedo ou o rato.', hint: 'Desenhe com o dedo ou o rato.' }
};
export var W = 1600, H = 900, MAX_STROKES = 600, MAX_POINTS = 60000, WIDTHS = [4, 9, 18];
/** Validează și normalizează punctele primite (listă plată x,y,x,y…): numere întregi în tablă, cel mult 400 de puncte. */
export function cleanPoints(p) {
  if (!Array.isArray(p)) return [];
  var out = [], n = Math.min(p.length - (p.length % 2), 800), i;
  for (i = 0; i < n; i++) {
    var v = p[i];
    if (typeof v !== 'number' || !isFinite(v)) return [];
    out.push(Math.max(0, Math.min(i % 2 ? H : W, Math.round(v))));
  }
  return out;
}
export function cleanWidth(w) { return WIDTHS.indexOf(w) >= 0 ? w : WIDTHS[1]; }
export function countPoints(strokes) { return strokes.reduce(function (a, s) { return a + s.p.length / 2; }, 0); }

export function mount(box, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var strokes = [], byKey = {}, mySeq = 0, width = WIDTHS[1], cur = null, sure = false, sureTimer = null, els = {}, flushTimer = null;

  function ink(s) { return s.c || '#111111'; }
  function key(by, id) { return by + ':' + id; }
  function addPoints(by, id, w, c, p) {
    var s = byKey[key(by, id)];
    if (!s) {
      s = { by: by, id: id, w: cleanWidth(w), c: c || '', p: [] };
      strokes.push(s); byKey[key(by, id)] = s;
      while (strokes.length > MAX_STROKES || countPoints(strokes) > MAX_POINTS) { var old = strokes.shift(); delete byKey[key(old.by, old.id)]; fullRedraw = true; }
    }
    var from = s.p.length;
    s.p = s.p.concat(p);
    return { s: s, from: from };
  }
  var fullRedraw = false;
  function line(ctx, s, from) {
    var p = s.p, i = Math.max(0, from - 2);
    ctx.strokeStyle = ink(s); ctx.fillStyle = ink(s); ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (p.length === 2) { ctx.beginPath(); ctx.arc(p[0], p[1], s.w / 2, 0, Math.PI * 2); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(p[i], p[i + 1]);
    for (i += 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
    ctx.stroke();
  }
  function redraw() {
    var ctx = els.cv.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    strokes.forEach(function (s) { if (s.p.length >= 2) line(ctx, s, 0); });
    fullRedraw = false;
  }
  function paint(r) { if (fullRedraw) redraw(); else if (r.s.p.length >= 2) line(els.cv.getContext('2d'), r.s, r.from); }
  function drop(pred) {
    strokes = strokes.filter(function (s) { if (pred(s)) { delete byKey[key(s.by, s.id)]; return false; } return true; });
    redraw();
  }

  /* ----- desenare locală + trimitere în loturi ----- */
  function pos(ev) {
    var r = els.cv.getBoundingClientRect(), pt = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
    return [Math.max(0, Math.min(W, Math.round((pt.clientX - r.left) * W / r.width))), Math.max(0, Math.min(H, Math.round((pt.clientY - r.top) * H / r.height)))];
  }
  function flush(end) {
    if (!cur) return;
    if (cur.out.length || end) { api.send({ k: 's', id: cur.id, w: cur.w, p: cur.out, e: end ? 1 : 0 }, { to: 'all' }); cur.out = []; }
    if (end) { cur = null; clearInterval(flushTimer); flushTimer = null; }
  }
  function down(ev) {
    if (api.locked) return;
    ev.preventDefault();
    var p = pos(ev);
    cur = { id: ++mySeq, w: width, out: p.slice(), last: p };
    paint(addPoints(api.me.id, cur.id, cur.w, api.me.color, p.slice()));
    flushTimer = setInterval(function () { flush(false); }, 60);
  }
  function move(ev) {
    if (!cur) return;
    ev.preventDefault();
    var p = pos(ev), dx = p[0] - cur.last[0], dy = p[1] - cur.last[1];
    if (dx * dx + dy * dy < 4) return;
    cur.last = p; cur.out.push(p[0], p[1]);
    paint(addPoints(api.me.id, cur.id, cur.w, api.me.color, p.slice()));
    if (cur.out.length >= 48) flush(false);
  }
  function up(ev) { if (!cur) return; if (ev && ev.preventDefault) ev.preventDefault(); flush(true); }
  function undoMine() { var mine = strokes.filter(function (s) { return s.by === api.me.id; }); if (!mine.length || api.locked) return; var l = mine[mine.length - 1]; drop(function (s) { return s === l; }); api.send({ k: 'u' }, { to: 'all' }); }
  function clearMine() { if (api.locked) return; drop(function (s) { return s.by === api.me.id; }); api.send({ k: 'cm' }, { to: 'all' }); }
  function clearAll() { strokes = []; byKey = {}; redraw(); api.send({ k: 'ca' }, { to: 'all' }); }
  function savePng() { try { api.save('whiteboard.png', 'image/png', els.cv.toDataURL('image/png')); } catch (e) { /* ignorat */ } }

  function legend() {
    var ps = api.peers(), kids = [];
    if (host) kids.push(h('li', {}, [h('span', { class: 'pfs-chip wb-host' }), t('host')]));
    ps.forEach(function (p) { kids.push(h('li', {}, [h('span', { class: 'pfs-chip', css: { '--c': p.color || '#999999' } }), p.name + (p.id === api.me.id ? ' (' + t('you') + ')' : '')])); });
    return h('ul', { class: 'wb-leg', 'aria-label': t('legend') }, kids);
  }
  function render() {
    box.textContent = '';
    els = {};
    els.cv = h('canvas', { class: 'wb-cv', width: String(W), height: String(H), role: 'img', 'aria-label': t('canvas') });
    var widthBtns = [['s', 0], ['m', 1], ['l', 2]].map(function (x) {
      return h('button', { type: 'button', class: 'pfs-btn', text: t(x[0]), 'aria-pressed': width === WIDTHS[x[1]] ? 'true' : 'false', on: { click: function () { width = WIDTHS[x[1]]; render(); } } });
    });
    var bar = h('div', { class: 'pfs-row pfs-in wb-bar', role: 'group', 'aria-label': t('pen') }, widthBtns.concat([
      h('button', { type: 'button', class: 'pfs-btn', text: t('undo'), on: { click: undoMine } }),
      h('button', { type: 'button', class: 'pfs-btn', text: t('clrm'), on: { click: clearMine } })
    ]));
    var kids = [h('h2', { class: 'pfs-sr', text: t('title') }), bar, h('div', { class: 'wb-wrap pfs-in' }, [els.cv]), h('p', { class: 'pfs-muted', text: t('hint') }), legend()];
    if (host) kids.push(h('div', { class: 'pfs-row' }, [
      h('button', { type: 'button', class: 'pfs-btn', text: sure ? t('sure') : t('clra'), on: { click: function () {
        if (!sure) { sure = true; clearTimeout(sureTimer); sureTimer = setTimeout(function () { sure = false; render(); }, 4000); render(); return; }
        sure = false; clearAll(); render();
      } } }),
      h('button', { type: 'button', class: 'pfs-btn', text: t('save'), on: { click: savePng } })
    ]));
    kids.forEach(function (k) { box.appendChild(k); });
    redraw();
    if (window.PointerEvent) {
      els.cv.addEventListener('pointerdown', function (e) { if (e.button > 0) return; try { els.cv.setPointerCapture(e.pointerId); } catch (er) { /* ignorat */ } down(e); });
      els.cv.addEventListener('pointermove', move);
      els.cv.addEventListener('pointerup', up); els.cv.addEventListener('pointercancel', up);
    } else {
      els.cv.addEventListener('touchstart', down); els.cv.addEventListener('touchmove', move); els.cv.addEventListener('touchend', up); els.cv.addEventListener('touchcancel', up);
      els.cv.addEventListener('mousedown', function (e) { down(e); document.addEventListener('mousemove', move); document.addEventListener('mouseup', function fin(ev) { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', fin); up(ev); }); });
    }
  }

  api.on(function (d, from) {
    if (!d || typeof d !== 'object' || !from || !from.id) return;
    if (d.k === 's') {
      var p = cleanPoints(d.p); if (!p.length || typeof d.id !== 'number') return;
      paint(addPoints(from.id, d.id, d.w, from.role === 'host' ? '' : from.color, p));
    } else if (d.k === 'u') {
      var mine = strokes.filter(function (s) { return s.by === from.id; });
      if (mine.length) { var l = mine[mine.length - 1]; drop(function (s) { return s === l; }); }
    } else if (d.k === 'cm') drop(function (s) { return s.by === from.id; });
    else if (d.k === 'ca' && from.role === 'host') { strokes = []; byKey = {}; redraw(); }
    else if (d.k === 'full' && from.role === 'host' && Array.isArray(d.list)) {
      d.list.forEach(function (s) {
        if (!s || typeof s.by !== 'string' || typeof s.id !== 'number') return;
        var p2 = cleanPoints(s.p); if (p2.length) addPoints(s.by, s.id, s.w, typeof s.c === 'string' ? s.c.slice(0, 9) : '', p2);
      });
      redraw();
    }
  });
  if (host) {
    api.on('join', function (peer) {
      var batch = [], size = 0;
      function send() { api.send({ k: 'full', list: batch }, { to: peer.id }); batch = []; size = 0; }
      strokes.forEach(function (s) {
        var item = { by: s.by, id: s.id, w: s.w, c: s.by === api.me.id ? '' : s.c, p: s.p };
        if (size + s.p.length > 700 && batch.length) send();
        batch.push(item); size += s.p.length;
      });
      if (batch.length) send();
    });
  }
  api.on('peers', function () { var l = box.querySelector('.wb-leg'); if (l && l.parentNode) l.parentNode.replaceChild(legend(), l); });
  api.on('lang', render);
  render();
}
