/* Notițe adezive. Fiecare telefon scrie bilețele (≤ 140 de caractere) care apar pe ecranul proiectorului, cu culoarea și numele autorului.
   Gazda ține lista (autoritară), o retrimite celor care intră mai târziu și poate șterge sau exporta (permisiune «download»: text simplu). */
export const strings = {
  en: { title: 'Sticky notes', ph: 'Write a note (up to 140 characters)', add: 'Add note', del: 'Delete note from {name}', clear: 'Clear all', sure: 'Click again to confirm', save: 'Save as text', empty: 'No notes yet.', count: '{n} notes', left: '{n} characters left', fresh: 'New note from {name}', by: 'by {name}' },
  ro: { title: 'Notițe adezive', ph: 'Scrie o notiță (până la 140 de caractere)', add: 'Adaugă notița', del: 'Șterge notița lui {name}', clear: 'Șterge tot', sure: 'Apasă din nou pentru confirmare', save: 'Salvează ca text', empty: 'Încă nu există notițe.', count: '{n} notițe', left: 'Mai ai {n} caractere', fresh: 'Notiță nouă de la {name}', by: 'de {name}' },
  fr: { title: 'Notes adhésives', ph: 'Écrivez une note (140 caractères maximum)', add: 'Ajouter la note', del: 'Supprimer la note de {name}', clear: 'Tout effacer', sure: 'Cliquez à nouveau pour confirmer', save: 'Enregistrer en texte', empty: 'Aucune note pour l’instant.', count: '{n} notes', left: '{n} caractères restants', fresh: 'Nouvelle note de {name}', by: 'par {name}' },
  de: { title: 'Haftnotizen', ph: 'Notiz schreiben (bis 140 Zeichen)', add: 'Notiz hinzufügen', del: 'Notiz von {name} löschen', clear: 'Alles löschen', sure: 'Zum Bestätigen erneut klicken', save: 'Als Text speichern', empty: 'Noch keine Notizen.', count: '{n} Notizen', left: 'Noch {n} Zeichen', fresh: 'Neue Notiz von {name}', by: 'von {name}' },
  es: { title: 'Notas adhesivas', ph: 'Escribe una nota (hasta 140 caracteres)', add: 'Añadir nota', del: 'Borrar la nota de {name}', clear: 'Borrar todo', sure: 'Pulsa de nuevo para confirmar', save: 'Guardar como texto', empty: 'Aún no hay notas.', count: '{n} notas', left: 'Quedan {n} caracteres', fresh: 'Nueva nota de {name}', by: 'de {name}' },
  it: { title: 'Note adesive', ph: 'Scrivi una nota (fino a 140 caratteri)', add: 'Aggiungi nota', del: 'Elimina la nota di {name}', clear: 'Cancella tutto', sure: 'Tocca di nuovo per confermare', save: 'Salva come testo', empty: 'Ancora nessuna nota.', count: '{n} note', left: 'Restano {n} caratteri', fresh: 'Nuova nota di {name}', by: 'di {name}' },
  hu: { title: 'Ragasztós cetlik', ph: 'Írj egy cetlit (legfeljebb 140 karakter)', add: 'Cetli hozzáadása', del: '{name} cetlijének törlése', clear: 'Mindent töröl', sure: 'A megerősítéshez kattints újra', save: 'Mentés szövegként', empty: 'Még nincs cetli.', count: '{n} cetli', left: 'Még {n} karakter', fresh: 'Új cetli tőle: {name}', by: '{name}' },
  pt: { title: 'Notas adesivas', ph: 'Escreva uma nota (até 140 caracteres)', add: 'Adicionar nota', del: 'Apagar a nota de {name}', clear: 'Apagar tudo', sure: 'Toque de novo para confirmar', save: 'Guardar como texto', empty: 'Ainda não há notas.', count: '{n} notas', left: 'Restam {n} caracteres', fresh: 'Nova nota de {name}', by: 'de {name}' }
};
export var MAX_NOTES = 300, MAX_TEXT = 140;
export function cleanNote(x) { return String(x == null ? '' : x).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT); }
export function notesText(list) { return list.map(function (n) { return n.name + ': ' + n.x; }).join('\r\n') + '\r\n'; }

export function mount(box, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var notes = [], seq = 0, sure = false, sureTimer = null, els = {}, draft = '';

  function find(id) { for (var i = 0; i < notes.length; i++) if (notes[i].id === id) return notes[i]; return null; }
  function addLocal(n) {
    if (!n || typeof n !== 'object' || typeof n.x !== 'string' || find(n.id)) return;
    notes.push({ id: n.id, by: String(n.by || ''), name: String(n.name || '').slice(0, 24), c: String(n.c || ''), x: cleanNote(n.x) });
    if (notes.length > MAX_NOTES) notes.shift();
  }
  function hostAdd(from, text) {
    var x = cleanNote(text); if (!x) return;
    var n = { id: ++seq, by: from.id, name: from.name, c: from.color || '', x: x };
    addLocal(n);
    api.send({ k: 'n+', n: n }, { to: 'all' });
    api.announce(t('fresh', { name: from.name }));
    render();
  }
  function hostDel(id) { notes = notes.filter(function (n) { return n.id !== id; }); api.send({ k: 'n-', id: id }, { to: 'all' }); render(); }
  function submit() {
    var x = cleanNote(draft); if (!x || api.locked) return;
    if (host) hostAdd(api.me, x); else api.send({ k: 'add', x: x }, { to: 'host' });
    draft = ''; if (els.ta) { els.ta.value = ''; els.ta.focus(); } updLeft();
  }
  function updLeft() { if (els.left) els.left.textContent = t('left', { n: MAX_TEXT - draft.length }); }
  function card(n) {
    var own = n.by === api.me.id, can = host || own;
    return h('li', { class: 'nt-note', css: { '--c': n.c || '#666666' } }, [
      h('p', { class: 'nt-x', text: n.x }),
      h('div', { class: 'nt-by' }, [h('span', { class: 'pfs-chip', css: { '--c': n.c || '#666666' } }), h('span', { text: t('by', { name: n.name }) }),
        can ? h('button', { type: 'button', class: 'pfs-btn nt-del', text: '✕', 'aria-label': t('del', { name: n.name }), on: { click: function () { if (host) hostDel(n.id); else api.send({ k: 'del', id: n.id }, { to: 'host' }); } } }) : null])
    ]);
  }
  function render() {
    box.textContent = '';
    els = {};
    els.ta = h('textarea', { id: 'nt-ta', rows: '2', maxlength: String(MAX_TEXT), placeholder: t('ph'), 'aria-label': t('ph'), on: {
      input: function () { draft = els.ta.value; updLeft(); },
      keydown: function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } } } });
    els.ta.value = draft;
    els.left = h('span', { class: 'pfs-muted', text: t('left', { n: MAX_TEXT - draft.length }) });
    var form = h('div', { class: 'pfs-card pfs-in' }, [els.ta, h('div', { class: 'pfs-row nt-row' }, [h('button', { type: 'button', class: 'pfs-btn pri', text: t('add'), on: { click: submit } }), els.left])]);
    var list = notes.length ? h('ul', { class: 'nt-grid', 'aria-label': t('count', { n: notes.length }) }, notes.slice().reverse().map(card)) : h('p', { class: 'pfs-muted', text: t('empty') });
    var kids = [h('h2', { text: t('title') }), form, list];
    if (host) {
      kids.push(h('div', { class: 'pfs-row' }, [
        h('span', { class: 'pfs-tag', role: 'status', text: t('count', { n: notes.length }) }),
        h('button', { type: 'button', class: 'pfs-btn', text: sure ? t('sure') : t('clear'), disabled: !notes.length, on: { click: function () {
          if (!sure) { sure = true; clearTimeout(sureTimer); sureTimer = setTimeout(function () { sure = false; render(); }, 4000); render(); return; }
          sure = false; notes = []; api.send({ k: 'clr' }, { to: 'all' }); render();
        } } }),
        h('button', { type: 'button', class: 'pfs-btn', text: t('save'), disabled: !notes.length, on: { click: function () { api.save('notes.txt', 'text/plain', notesText(notes)); } } })
      ]));
    }
    kids.forEach(function (k) { box.appendChild(k); });
  }

  api.on(function (d, from) {
    if (!d || typeof d !== 'object' || !from) return;
    if (host) {
      if (d.k === 'add') hostAdd(from, d.x);
      else if (d.k === 'del') { var n = find(d.id); if (n && n.by === from.id) hostDel(n.id); }
    } else if (from.role === 'host') {
      if (d.k === 'n+') { addLocal(d.n); render(); if (d.n && d.n.by !== api.me.id) api.announce(t('fresh', { name: String(d.n.name || '') })); }
      else if (d.k === 'n-') { notes = notes.filter(function (n) { return n.id !== d.id; }); render(); }
      else if (d.k === 'clr') { notes = []; render(); }
      else if (d.k === 'full' && Array.isArray(d.list)) { if (d.f) notes = []; d.list.forEach(addLocal); render(); }
    }
  });
  if (host) {
    api.on('join', function (peer) {
      if (!notes.length) return;
      for (var i = 0; i < notes.length; i += 30) api.send({ k: 'full', f: i === 0 ? 1 : 0, list: notes.slice(i, i + 30) }, { to: peer.id });
    });
  }
  api.on('lang', render);
  render();
}
