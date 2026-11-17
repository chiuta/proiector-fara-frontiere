/* Sondaj cu bare în direct. Gazda scrie întrebarea și variantele; fiecare telefon votează o dată (își poate schimba votul până la închidere).
   Gazda numără (autoritară) și trimite doar totalurile; votul unui telefon rămâne la gazdă. Permisiune: «download» (export CSV al rezultatelor). */
export const strings = {
  en: { title: 'Poll', wait: 'Waiting for the teacher to start a poll…', q: 'Question', qph: 'What do you want to ask?', opt: 'Option {n}', add: 'Add option', rm: 'Remove option {n}', live: 'Show live results on the phones', start: 'Start poll', close: 'Close voting', newp: 'New poll', cnt: 'Votes: {n}', tally: '{n} of {m} phones have voted', mine: 'Your vote:', change: 'You can change your vote until voting closes.', closed: 'Voting is closed.', csv: 'Save results (CSV)', results: 'Results', need: 'Write a question and at least two options.', pick: 'Choose one option', hidden: 'Results stay hidden until voting closes.' },
  ro: { title: 'Sondaj', wait: 'Se așteaptă ca profesorul să pornească un sondaj…', q: 'Întrebare', qph: 'Ce vrei să întrebi?', opt: 'Varianta {n}', add: 'Adaugă variantă', rm: 'Șterge varianta {n}', live: 'Arată rezultatele în direct pe telefoane', start: 'Pornește sondajul', close: 'Închide votul', newp: 'Sondaj nou', cnt: 'Voturi: {n}', tally: '{n} din {m} telefoane au votat', mine: 'Votul tău:', change: 'Îți poți schimba votul până se închide votarea.', closed: 'Votarea s-a încheiat.', csv: 'Salvează rezultatele (CSV)', results: 'Rezultate', need: 'Scrie o întrebare și cel puțin două variante.', pick: 'Alege o variantă', hidden: 'Rezultatele rămân ascunse până se închide votul.' },
  fr: { title: 'Sondage', wait: 'En attente du sondage de l’enseignant…', q: 'Question', qph: 'Que voulez-vous demander ?', opt: 'Option {n}', add: 'Ajouter une option', rm: 'Supprimer l’option {n}', live: 'Afficher les résultats en direct sur les téléphones', start: 'Lancer le sondage', close: 'Clore le vote', newp: 'Nouveau sondage', cnt: 'Votes : {n}', tally: '{n} téléphones sur {m} ont voté', mine: 'Votre vote :', change: 'Vous pouvez changer votre vote jusqu’à la clôture.', closed: 'Le vote est clos.', csv: 'Enregistrer les résultats (CSV)', results: 'Résultats', need: 'Écrivez une question et au moins deux options.', pick: 'Choisissez une option', hidden: 'Les résultats restent masqués jusqu’à la clôture du vote.' },
  de: { title: 'Umfrage', wait: 'Warten, bis die Lehrkraft eine Umfrage startet …', q: 'Frage', qph: 'Was möchtest du fragen?', opt: 'Option {n}', add: 'Option hinzufügen', rm: 'Option {n} entfernen', live: 'Live-Ergebnisse auf den Handys zeigen', start: 'Umfrage starten', close: 'Abstimmung beenden', newp: 'Neue Umfrage', cnt: 'Stimmen: {n}', tally: '{n} von {m} Handys haben abgestimmt', mine: 'Deine Stimme:', change: 'Du kannst deine Stimme ändern, bis die Abstimmung endet.', closed: 'Die Abstimmung ist beendet.', csv: 'Ergebnisse speichern (CSV)', results: 'Ergebnisse', need: 'Schreibe eine Frage und mindestens zwei Optionen.', pick: 'Wähle eine Option', hidden: 'Die Ergebnisse bleiben bis zum Ende der Abstimmung verborgen.' },
  es: { title: 'Encuesta', wait: 'Esperando a que el docente inicie una encuesta…', q: 'Pregunta', qph: '¿Qué quieres preguntar?', opt: 'Opción {n}', add: 'Añadir opción', rm: 'Quitar la opción {n}', live: 'Mostrar resultados en vivo en los teléfonos', start: 'Iniciar encuesta', close: 'Cerrar la votación', newp: 'Nueva encuesta', cnt: 'Votos: {n}', tally: '{n} de {m} teléfonos han votado', mine: 'Tu voto:', change: 'Puedes cambiar tu voto hasta que se cierre la votación.', closed: 'La votación está cerrada.', csv: 'Guardar resultados (CSV)', results: 'Resultados', need: 'Escribe una pregunta y al menos dos opciones.', pick: 'Elige una opción', hidden: 'Los resultados permanecen ocultos hasta que se cierre la votación.' },
  it: { title: 'Sondaggio', wait: 'In attesa che l’insegnante avvii un sondaggio…', q: 'Domanda', qph: 'Cosa vuoi chiedere?', opt: 'Opzione {n}', add: 'Aggiungi opzione', rm: 'Rimuovi l’opzione {n}', live: 'Mostra i risultati in diretta sui telefoni', start: 'Avvia il sondaggio', close: 'Chiudi la votazione', newp: 'Nuovo sondaggio', cnt: 'Voti: {n}', tally: '{n} telefoni su {m} hanno votato', mine: 'Il tuo voto:', change: 'Puoi cambiare il voto finché la votazione non si chiude.', closed: 'La votazione è chiusa.', csv: 'Salva i risultati (CSV)', results: 'Risultati', need: 'Scrivi una domanda e almeno due opzioni.', pick: 'Scegli un’opzione', hidden: 'I risultati restano nascosti fino alla chiusura del voto.' },
  hu: { title: 'Szavazás', wait: 'Várakozás, hogy a tanár elindítson egy szavazást…', q: 'Kérdés', qph: 'Mit szeretnél kérdezni?', opt: '{n}. lehetőség', add: 'Lehetőség hozzáadása', rm: 'A(z) {n}. lehetőség törlése', live: 'Élő eredmények a telefonokon', start: 'Szavazás indítása', close: 'Szavazás lezárása', newp: 'Új szavazás', cnt: 'Szavazatok: {n}', tally: '{m} telefonból {n} szavazott', mine: 'A szavazatod:', change: 'A szavazatodat a lezárásig módosíthatod.', closed: 'A szavazás lezárult.', csv: 'Eredmények mentése (CSV)', results: 'Eredmények', need: 'Írj egy kérdést és legalább két lehetőséget.', pick: 'Válassz egy lehetőséget', hidden: 'Az eredmények a szavazás lezárásáig rejtettek.' },
  pt: { title: 'Sondagem', wait: 'A aguardar que o professor inicie uma sondagem…', q: 'Pergunta', qph: 'O que perguntar?', opt: 'Opção {n}', add: 'Adicionar opção', rm: 'Remover a opção {n}', live: 'Mostrar resultados em tempo real nos telefones', start: 'Iniciar sondagem', close: 'Encerrar a votação', newp: 'Nova sondagem', cnt: 'Votos: {n}', tally: '{n} de {m} telefones votaram', mine: 'O seu voto:', change: 'Pode mudar o voto até a votação terminar.', closed: 'A votação terminou.', csv: 'Guardar resultados (CSV)', results: 'Resultados', need: 'Escreva uma pergunta e pelo menos duas opções.', pick: 'Escolha uma opção', hidden: 'Os resultados ficam ocultos até a votação terminar.' }
};

/** Numără voturile: votes = {idTelefon: indexVariantă}. */
export function tallyVotes(n, votes) {
  var c = [], i;
  for (i = 0; i < n; i++) c.push(0);
  Object.keys(votes).forEach(function (k) { var v = votes[k]; if (v >= 0 && v < n) c[v]++; });
  return c;
}
export function csvCell(s) { s = String(s); return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
export function toCsv(S) {
  var rows = [['question', 'option', 'votes']];
  S.opts.forEach(function (o, i) { rows.push([S.q, o, S.counts[i] || 0]); });
  return rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n') + '\r\n';
}

export function mount(box, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var S = { id: 0, ph: 'setup', q: '', opts: [], counts: [], n: 0, m: 0, live: true };
  var votes = {}, mine = -1, form = { q: '', opts: ['', ''], live: true };

  function publish() { S.m = api.peers().length; api.setState(S); render(); }
  function startPoll() {
    var opts = form.opts.map(function (o) { return o.trim(); }).filter(Boolean), q = form.q.trim();
    if (!q || opts.length < 2) return;
    votes = {}; mine = -1;
    S = { id: S.id + 1, ph: 'vote', q: q, opts: opts, counts: tallyVotes(opts.length, votes), n: 0, m: 0, live: !!form.live };
    publish();
  }
  function closePoll() { S.ph = 'closed'; publish(); }
  function newPoll() { votes = {}; mine = -1; S = { id: S.id, ph: 'setup', q: '', opts: [], counts: [], n: 0, m: 0, live: form.live }; publish(); }
  function vote(i) { if (api.locked || S.ph !== 'vote') return; mine = i; api.send({ k: 'vote', i: i }, { to: 'host' }); render(); }
  function bars(show) {
    if (!show) return h('p', { class: 'pfs-muted', text: t('hidden') });
    var total = S.counts.reduce(function (a, b) { return a + b; }, 0);
    return h('ul', { class: 'pl-bars', 'aria-label': t('results') }, S.opts.map(function (o, i) {
      var c = S.counts[i] || 0, pct = total ? Math.round(c * 100 / total) : 0;
      return h('li', { class: 'pl-row' }, [
        h('div', { class: 'pl-lab' }, [h('span', { class: 'pl-name', text: o }), h('span', { class: 'pl-num', text: t('cnt', { n: c }) + ' · ' + pct + '%' })]),
        h('div', { class: 'pl-track', 'aria-hidden': 'true' }, [h('div', { class: 'pl-fill' + (i === mine ? ' mine' : ''), css: { width: pct + '%' } })])
      ]);
    }));
  }
  function setupForm() {
    var err = h('p', { class: 'pfs-bad', role: 'alert' });
    var q = h('input', { type: 'text', id: 'pl-q', maxlength: '140', value: form.q, placeholder: t('qph'), on: { input: function () { form.q = q.value; } } });
    var list = form.opts.map(function (o, i) {
      var inp = h('input', { type: 'text', id: 'pl-o' + i, maxlength: '60', value: o, 'aria-label': t('opt', { n: i + 1 }), placeholder: t('opt', { n: i + 1 }), on: { input: function () { form.opts[i] = inp.value; } } });
      var rm = h('button', { type: 'button', class: 'pfs-btn', text: '✕', 'aria-label': t('rm', { n: i + 1 }), disabled: form.opts.length <= 2, on: { click: function () { form.opts.splice(i, 1); render(); } } });
      return h('div', { class: 'pfs-row pl-orow' }, [inp, rm]);
    });
    var live = h('input', { type: 'checkbox', id: 'pl-live', checked: form.live, on: { change: function () { form.live = live.checked; } } });
    return h('div', { class: 'pfs-card' }, [
      h('label', { for: 'pl-q', text: t('q') }), q, h('div', { class: 'pl-list' }, list),
      h('div', { class: 'pfs-row' }, [
        h('button', { type: 'button', class: 'pfs-btn', text: t('add'), disabled: form.opts.length >= 6, on: { click: function () { form.opts.push(''); render(); } } }),
        h('label', { class: 'pl-chk', for: 'pl-live' }, [live, ' ' + t('live')])
      ]),
      err,
      h('button', { type: 'button', class: 'pfs-btn pri', text: t('start'), on: { click: function () {
        var ok = form.q.trim() && form.opts.filter(function (o) { return o.trim(); }).length >= 2;
        if (!ok) { err.textContent = t('need'); return; }
        startPoll();
      } } })
    ]);
  }
  function render() {
    box.textContent = '';
    var kids = [h('h2', { text: t('title') })];
    if (S.ph === 'setup') {
      kids.push(host ? setupForm() : h('p', { class: 'pfs-muted', text: t('wait') }));
    } else {
      kids.push(h('h3', { class: 'pl-q', text: S.q }));
      var show = S.live || S.ph === 'closed' || host;
      if (S.ph === 'vote' && !host) {
        var grp = h('div', { class: 'pl-opts pfs-in', role: 'radiogroup', 'aria-label': t('pick') }, S.opts.map(function (o, i) {
          return h('button', { type: 'button', class: 'pfs-btn pl-opt', role: 'radio', 'aria-checked': i === mine ? 'true' : 'false', 'aria-pressed': i === mine ? 'true' : 'false', text: o, on: { click: function () { vote(i); } } });
        }));
        kids.push(grp);
        kids.push(h('p', { class: 'pfs-muted', text: mine >= 0 ? t('mine') + ' ' + S.opts[mine] + ' — ' + t('change') : t('pick') }));
      }
      kids.push(h('p', { class: 'pfs-muted', role: 'status', text: t('tally', { n: S.n, m: S.m }) }));
      kids.push(bars(show));
      if (S.ph === 'closed') kids.push(h('p', { class: 'pfs-ok', role: 'status', text: t('closed') }));
      if (host) {
        var row = [];
        if (S.ph === 'vote') row.push(h('button', { type: 'button', class: 'pfs-btn pri', text: t('close'), on: { click: closePoll } }));
        row.push(h('button', { type: 'button', class: 'pfs-btn', text: t('newp'), on: { click: newPoll } }));
        if (S.ph === 'closed' || S.n > 0) row.push(h('button', { type: 'button', class: 'pfs-btn', text: t('csv'), on: { click: function () { api.save('poll.csv', 'text/csv', toCsv(S)); } } }));
        kids.push(h('div', { class: 'pfs-row' }, row));
      }
    }
    kids.forEach(function (k) { box.appendChild(k); });
  }

  if (host) {
    api.on(function (d, from) {
      if (!d || d.k !== 'vote' || S.ph !== 'vote' || !from || !from.id) return;
      var i = d.i;
      if (typeof i !== 'number' || i % 1 !== 0 || i < 0 || i >= S.opts.length) return;
      votes[from.id] = i; S.counts = tallyVotes(S.opts.length, votes); S.n = Object.keys(votes).length; publish();
    });
    api.on('peers', function () { if (S.ph === 'vote') publish(); });
  } else {
    api.on('state', function (s) {
      if (!s || typeof s !== 'object' || !Array.isArray(s.opts)) return;
      if (s.id !== S.id) mine = -1;
      S = s; render();
    });
    if (api.state) { S = api.state; }
  }
  api.on('lang', render);
  render();
}
