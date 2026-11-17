# Come contribuire — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · **Italiano** · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versione: 0.2.0 · Ultimo aggiornamento: 2026-11-17

1. Fai il fork di questo repository.
2. Copia `data/widgets/example.json` in `data/widgets/<id>.json` e modificalo (schema in `schema.json`), poi esegui `python scripts/validate.py`.
3. Scrivi `widgets/<id>/index.js` (vedi `docs/widget-api.md`): `export function mount(container, api)` e `strings` in tutte e otto le lingue.
4. Testa le funzioni pure in `test/widgets.test.mjs`, poi esegui `npm test` e `node scripts/build.mjs`.
5. Apri una pull request con l’`index.html` rigenerato.

## Regole

- Un’attività = un descrittore (`data/widgets/<id>.json`) + un widget (`widgets/<id>/index.js`) + test.
- Cita sempre una fonte.
- Contribuisci solo con materiale che puoi condividere legalmente (niente testi protetti copiati).
- Sii gentile: vedi il Codice di condotta.

## Aggiungere un’attività

1. Aggiungi `data/widgets/<id>.json` (parti da `data/widgets/example.json`; schema in `schema.json`) ed esegui `python scripts/validate.py`. L’`id`, il nome del file, la directory sotto `widgets/` e `entry` devono coincidere. Elenca il minor numero possibile di `permissions`: `none`, `drawing`, `storage` o `download`; `camera` e `microphone` sono riservate e respinte (vedi `docs/sandbox.md`).
2. Scrivi `widgets/<id>/index.js` come modulo ES (sintassi ES2017, senza import) con `export function mount(container, api)` ed `export const strings` in tutte e otto le lingue (vedi `docs/widget-api.md`). Niente rete, niente archiviazione del browser, niente `parent`, niente `eval`, niente HTML costruito da testo: `npm test` li rifiuta, e il builder rifiuta `<!--`, `<script` e `</script` nel sorgente.
3. Tratta ogni messaggio di un telefono come non attendibile: controlla tipi, intervalli e lunghezze sul proiettore, tieni lì le risposte giuste e i punteggi, e invia ai telefoni solo ciò che serve. Cambiare la forma di un messaggio o un limite in `src/engine.mjs` significa aumentare `PROTO` e aggiornare `docs/protocol.md` (un test confronta la sua tabella con il codice).
4. Dai uno stile al widget in `widgets/<id>/style.css` con un prefisso di classe tuo e le variabili del tema. Mantieni bersagli touch di almeno 44 pixel, un focus visibile, un’etichetta per ogni controllo e annunci (`api.announce`) per ciò che cambia sullo schermo; verifica l’alto contrasto e il testo grande.
5. Scrivi test in `test/widgets.test.mjs` per le funzioni pure che esporti, solo con dati inventati, ed esegui `npm test`.
6. Esegui `node scripts/build.mjs` e fai il commit di `index.html`, `sw.js` e `app.json` rigenerati insieme a `src/` e `widgets/`.
