# Mitmachen — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · **Deutsch** · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

1. Forke dieses Repository.
2. Kopiere `data/widgets/example.json` nach `data/widgets/<id>.json` und bearbeite die Datei (Schema in `schema.json`), dann führe `python scripts/validate.py` aus.
3. Schreibe `widgets/<id>/index.js` (siehe `docs/widget-api.md`): `export function mount(container, api)` und `strings` in allen acht Sprachen.
4. Teste die reinen Funktionen in `test/widgets.test.mjs`, dann führe `npm test` und `node scripts/build.mjs` aus.
5. Öffne einen Pull Request mit der neu erzeugten `index.html`.

## Regeln

- Eine Aktivität = ein Descriptor (`data/widgets/<id>.json`) + ein Widget (`widgets/<id>/index.js`) + Tests.
- Gib immer eine Quelle an.
- Steuere nur Material bei, das du rechtmäßig teilen darfst (keine kopierten geschützten Texte).
- Sei freundlich: siehe Verhaltenskodex.

## Eine Aktivität hinzufügen

1. Füge `data/widgets/<id>.json` hinzu (ausgehend von `data/widgets/example.json`; Schema in `schema.json`) und führe `python scripts/validate.py` aus. `id`, Dateiname, Verzeichnis unter `widgets/` und `entry` müssen übereinstimmen. Führe so wenige `permissions` wie möglich auf: `none`, `drawing`, `storage` oder `download`; `camera` und `microphone` sind reserviert und werden abgelehnt (siehe `docs/sandbox.md`).
2. Schreibe `widgets/<id>/index.js` als ES-Modul (ES2017-Syntax, keine Importe) mit `export function mount(container, api)` und `export const strings` in allen acht Sprachen (siehe `docs/widget-api.md`). Kein Netzwerk, kein Browser-Speicher, kein `parent`, kein `eval`, kein aus Text gebautes HTML: `npm test` lehnt sie ab, und der Builder lehnt `<!--`, `<script` und `</script` im Quelltext ab.
3. Behandle jede Nachricht eines Telefons als nicht vertrauenswürdig: Prüfe Typen, Bereiche und Längen auf dem Projektor, halte richtige Antworten und Punkte dort und sende den Telefonen nur, was sie brauchen. Wer die Form einer Nachricht oder eine Grenze in `src/engine.mjs` ändert, erhöht `PROTO` und aktualisiert `docs/protocol.md` (ein Test vergleicht dessen Tabelle mit dem Code).
4. Gestalte das Widget in `widgets/<id>/style.css` mit einem eigenen Klassenpräfix und den Theme-Variablen. Behalte Touch-Ziele von mindestens 44 Pixeln, einen sichtbaren Fokus, ein Label für jedes Bedienelement und Ansagen (`api.announce`) für das, was sich auf dem Bildschirm ändert; prüfe hohen Kontrast und große Schrift.
5. Schreibe Tests in `test/widgets.test.mjs` für die reinen Funktionen, die du exportierst, nur mit erfundenen Daten, und führe `npm test` aus.
6. Führe `node scripts/build.mjs` aus und committe die neu erzeugten `index.html`, `sw.js` und `app.json` zusammen mit `src/` und `widgets/`.
