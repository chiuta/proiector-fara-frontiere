/* Cronometru comun (numărătoare inversă). Gazda comandă, telefoanele afișează.
   Starea comună {run, left, total} (ms) este trimisă doar când se schimbă; fiecare dispozitiv numără local între mesaje (eroare ≈ latența rețelei locale, sub o secundă).
   Widgetul nu atinge nimic în afara iframe-ului său: permisiuni ["none"]. */
export const strings = {
  en: { title: 'Countdown timer', min: 'Minutes', sec: 'Seconds', set: 'Set time', start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Reset', done: 'Time is up!', only: 'The teacher controls the timer.', pre: '{n} min', a60: 'One minute left', a10: '10 seconds left' },
  ro: { title: 'Cronometru', min: 'Minute', sec: 'Secunde', set: 'Setează timpul', start: 'Pornește', pause: 'Pauză', resume: 'Reia', reset: 'Resetează', done: 'Timpul a expirat!', only: 'Cronometrul este controlat de profesor.', pre: '{n} min', a60: 'Mai este un minut', a10: 'Au mai rămas 10 secunde' },
  fr: { title: 'Minuteur', min: 'Minutes', sec: 'Secondes', set: 'Régler le temps', start: 'Démarrer', pause: 'Pause', resume: 'Reprendre', reset: 'Réinitialiser', done: 'Temps écoulé !', only: 'L’enseignant contrôle le minuteur.', pre: '{n} min', a60: 'Il reste une minute', a10: 'Il reste 10 secondes' },
  de: { title: 'Countdown-Timer', min: 'Minuten', sec: 'Sekunden', set: 'Zeit einstellen', start: 'Start', pause: 'Pause', resume: 'Fortsetzen', reset: 'Zurücksetzen', done: 'Die Zeit ist um!', only: 'Die Lehrkraft steuert den Timer.', pre: '{n} Min.', a60: 'Noch eine Minute', a10: 'Noch 10 Sekunden' },
  es: { title: 'Cuenta atrás', min: 'Minutos', sec: 'Segundos', set: 'Fijar tiempo', start: 'Iniciar', pause: 'Pausa', resume: 'Reanudar', reset: 'Reiniciar', done: '¡Se acabó el tiempo!', only: 'El docente controla el temporizador.', pre: '{n} min', a60: 'Queda un minuto', a10: 'Quedan 10 segundos' },
  it: { title: 'Conto alla rovescia', min: 'Minuti', sec: 'Secondi', set: 'Imposta il tempo', start: 'Avvia', pause: 'Pausa', resume: 'Riprendi', reset: 'Azzera', done: 'Tempo scaduto!', only: 'L’insegnante controlla il timer.', pre: '{n} min', a60: 'Manca un minuto', a10: 'Mancano 10 secondi' },
  hu: { title: 'Visszaszámláló', min: 'Perc', sec: 'Másodperc', set: 'Idő beállítása', start: 'Indítás', pause: 'Szünet', resume: 'Folytatás', reset: 'Alaphelyzet', done: 'Lejárt az idő!', only: 'Az időzítőt a tanár vezérli.', pre: '{n} perc', a60: 'Még egy perc van hátra', a10: 'Még 10 másodperc van hátra' },
  pt: { title: 'Contagem regressiva', min: 'Minutos', sec: 'Segundos', set: 'Definir tempo', start: 'Iniciar', pause: 'Pausar', resume: 'Retomar', reset: 'Repor', done: 'O tempo acabou!', only: 'O professor controla o temporizador.', pre: '{n} min', a60: 'Falta um minuto', a10: 'Faltam 10 segundos' }
};

export function fmt(ms) {
  var s = Math.ceil(Math.max(0, ms) / 1000), m = Math.floor(s / 60), r = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
}
export function remaining(st, now) { return st.run ? Math.max(0, st.left - (now - st.at)) : st.left; }
export function clampTotal(min, sec) {
  var m = Math.max(0, Math.min(99, Math.floor(+min || 0))), s = Math.max(0, Math.min(59, Math.floor(+sec || 0)));
  return Math.max(1000, (m * 60 + s) * 1000);
}

export function mount(box, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var st = { run: false, left: 60000, total: 60000, at: Date.now() }, said = {}, els = {};

  function publish() { if (host) api.setState({ run: st.run, left: Math.max(0, remaining(st, Date.now())), total: st.total }); }
  function apply(s) {
    if (!s || typeof s !== 'object') return;
    st = { run: !!s.run, left: Math.max(0, +s.left || 0), total: Math.max(1000, +s.total || 60000), at: Date.now() };
    said = {}; draw();
  }
  function setTotal(ms) { st = { run: false, left: ms, total: ms, at: Date.now() }; said = {}; publish(); draw(); }
  function toggle() {
    var left = remaining(st, Date.now());
    if (st.run) st = { run: false, left: left, total: st.total, at: Date.now() };
    else if (left > 0) st = { run: true, left: left, total: st.total, at: Date.now() };
    publish(); draw();
  }
  function reset() { st = { run: false, left: st.total, total: st.total, at: Date.now() }; said = {}; publish(); draw(); }
  function draw() {
    if (!els.big) return;
    var left = remaining(st, Date.now());
    if (host && st.run && left <= 0) { st = { run: false, left: 0, total: st.total, at: Date.now() }; publish(); }
    els.big.textContent = fmt(left);
    els.fill.style.width = Math.max(0, Math.min(100, (left / st.total) * 100)) + '%';
    els.wrap.className = 'pfs-col tm-wrap' + (left <= 0 ? ' is-done' : '');
    els.msg.textContent = left <= 0 && !st.run && st.left === 0 ? t('done') : '';
    if (st.run) {
      if (left <= 60000 && st.total > 60000 && !said.a60) { said.a60 = 1; api.announce(t('a60')); }
      if (left <= 10000 && !said.a10) { said.a10 = 1; api.announce(t('a10')); }
    }
    if (left <= 0 && !said.fin && (st.run || st.left === 0)) { said.fin = 1; if (st.left === 0 || st.run) api.announce(t('done')); }
    if (els.go) els.go.textContent = st.run ? t('pause') : (left < st.total && left > 0 ? t('resume') : t('start'));
    if (els.go) els.go.disabled = !st.run && left <= 0;
  }
  function build() {
    box.textContent = '';
    els = {};
    els.big = h('div', { class: 'pfs-big tm-time', role: 'timer', 'aria-live': 'off' });
    els.fill = h('div', { class: 'tm-fill' });
    els.msg = h('p', { class: 'pfs-bad tm-msg', role: 'status' });
    els.wrap = h('div', { class: 'pfs-col tm-wrap' }, [h('h2', { class: 'pfs-sr', text: t('title') }), els.big, h('div', { class: 'tm-meter', 'aria-hidden': 'true' }, [els.fill]), els.msg]);
    box.appendChild(els.wrap);
    if (host) {
      var mi = h('input', { type: 'number', id: 'tm-m', min: '0', max: '99', value: String(Math.floor(st.total / 60000)), inputmode: 'numeric' });
      var si = h('input', { type: 'number', id: 'tm-s', min: '0', max: '59', value: String(Math.floor((st.total % 60000) / 1000)), inputmode: 'numeric' });
      var pres = [1, 5, 10, 15].map(function (n) { return h('button', { type: 'button', class: 'pfs-btn', text: t('pre', { n: n }), on: { click: function () { setTotal(n * 60000); mi.value = String(n); si.value = '0'; } } }); });
      els.go = h('button', { type: 'button', class: 'pfs-btn pri', on: { click: toggle } });
      var panel = h('div', { class: 'pfs-card tm-ctl' }, [
        h('div', { class: 'pfs-row' }, pres),
        h('div', { class: 'pfs-row' }, [
          h('div', {}, [h('label', { for: 'tm-m', text: t('min') }), mi]),
          h('div', {}, [h('label', { for: 'tm-s', text: t('sec') }), si]),
          h('button', { type: 'button', class: 'pfs-btn', text: t('set'), on: { click: function () { setTotal(clampTotal(mi.value, si.value)); } } })
        ]),
        h('div', { class: 'pfs-row' }, [els.go, h('button', { type: 'button', class: 'pfs-btn', text: t('reset'), on: { click: reset } })])
      ]);
      box.appendChild(panel);
    } else {
      box.appendChild(h('p', { class: 'pfs-muted tm-only', text: t('only') }));
    }
    draw();
  }
  build();
  api.on('state', apply);
  api.on('lang', build);
  if (api.state) apply(api.state);
  var iv = setInterval(draw, 250);
  mount.stop = function () { clearInterval(iv); };
}
export function unmount() { if (mount.stop) mount.stop(); }
