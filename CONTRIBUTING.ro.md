# Cum contribui — Proiector fără frontiere

[English](CONTRIBUTING.md) · **Română** · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versiune: 0.2.0 · Ultima actualizare: 2026-11-17

1. Fă fork acestui depozit.
2. Copiază `data/widgets/example.json` în `data/widgets/<id>.json` și editează-l (schema este în `schema.json`), apoi rulează `python scripts/validate.py`.
3. Scrie `widgets/<id>/index.js` (vezi `docs/widget-api.md`): `export function mount(container, api)` și `strings` în toate cele opt limbi.
4. Testează funcțiile pure în `test/widgets.test.mjs`, apoi rulează `npm test` și `node scripts/build.mjs`.
5. Deschide un pull request cu `index.html` regenerat.

## Reguli

- O activitate = un descriptor (`data/widgets/<id>.json`) + un widget (`widgets/<id>/index.js`) + teste.
- Citează întotdeauna o sursă.
- Contribuie doar cu material pe care ai voie să-l partajezi (fără texte copiate protejate de drepturi de autor).
- Fii amabil: vezi Codul de conduită.

## Adăugarea unei activități

1. Adaugă `data/widgets/<id>.json` (pornește de la `data/widgets/example.json`; schema este în `schema.json`) și rulează `python scripts/validate.py`. `id`-ul, numele fișierului, directorul din `widgets/` și `entry` trebuie să coincidă. Listează cele mai puține `permissions` care merg: `none`, `drawing`, `storage` sau `download`; `camera` și `microphone` sunt rezervate și respinse (vezi `docs/sandbox.md`).
2. Scrie `widgets/<id>/index.js` ca modul ES (sintaxă ES2017, fără importuri) cu `export function mount(container, api)` și `export const strings` în toate cele opt limbi (vezi `docs/widget-api.md`). Fără rețea, fără stocarea browserului, fără `parent`, fără `eval`, fără HTML construit din text: `npm test` le refuză, iar constructorul refuză `<!--`, `<script` și `</script` în sursă.
3. Tratează orice mesaj de la un telefon ca nesigur: verifică tipurile, intervalele și lungimile pe proiector, păstrează acolo răspunsurile corecte și scorurile și trimite telefoanelor doar ce le trebuie. O schimbare a formei unui mesaj sau a unei limite din `src/engine.mjs` înseamnă creșterea lui `PROTO` și actualizarea `docs/protocol.md` (un test compară tabelul lui cu codul).
4. Stilizează widgetul în `widgets/<id>/style.css` cu un prefix propriu pentru clase și cu variabilele temei. Păstrează ținte tactile de cel puțin 44 de pixeli, focalizare vizibilă, o etichetă pentru fiecare control și anunțuri (`api.announce`) pentru ce se schimbă pe ecran; verifică contrastul ridicat și textul mare.
5. Scrie teste în `test/widgets.test.mjs` pentru funcțiile pure pe care le exporți, doar cu date inventate, și rulează `npm test`.
6. Rulează `node scripts/build.mjs` și comite `index.html`, `sw.js` și `app.json` regenerate, împreună cu `src/` și `widgets/`.
