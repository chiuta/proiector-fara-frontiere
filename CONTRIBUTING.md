# Contributing — Proiector fără frontiere

**English** · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.1 · Last updated: 2026-11-20

1. Fork this repository.
2. Copy `data/widgets/example.json` to `data/widgets/<id>.json` and edit it (schema in `schema.json`), then run `python scripts/validate.py`.
3. Write `widgets/<id>/index.js` (see `docs/widget-api.md`): `export function mount(container, api)` and `strings` in all eight languages.
4. Test the pure functions in `test/widgets.test.mjs`, then run `npm test` and `node scripts/build.mjs`.
5. Open a pull request with the regenerated `index.html`.

## Rules

- One activity = one descriptor (`data/widgets/<id>.json`) + one widget (`widgets/<id>/index.js`) + tests.
- Always cite a source.
- Contribute only material you may legally share (no copied copyrighted text).
- Be kind: see the Code of Conduct.

## Adding an activity

1. Add `data/widgets/<id>.json` (start from `data/widgets/example.json`; schema in `schema.json`) and run `python scripts/validate.py`. The `id`, the file name, the directory under `widgets/` and `entry` must agree. List the fewest `permissions` that work: `none`, `drawing`, `storage` or `download`; `camera` and `microphone` are reserved and rejected (see `docs/sandbox.md`).
2. Write `widgets/<id>/index.js` as an ES module (ES2017 syntax, no imports) with `export function mount(container, api)` and `export const strings` in all eight languages (see `docs/widget-api.md`). No network, no browser storage, no `parent`, no `eval`, no HTML built from text: `npm test` refuses them, and the builder refuses `<!--`, `<script` and `</script` in the source.
3. Treat every message from a phone as untrusted: check types, ranges and lengths on the projector, keep right answers and scores there, and send phones only what they need. A change to a message shape or to a limit in `src/engine.mjs` means raising `PROTO` and updating `docs/protocol.md` (a test compares its table with the code).
4. Style the widget in `widgets/<id>/style.css` with a class prefix of your own and the theme variables. Keep touch targets of at least 44 pixels, a visible focus, a label for every control and live announcements (`api.announce`) for what changes on screen; check high contrast and large text.
5. Write tests in `test/widgets.test.mjs` for the pure functions you export, with invented data only, and run `npm test`.
6. Run `node scripts/build.mjs` and commit the regenerated `index.html`, `sw.js` and `app.json` together with `src/` and `widgets/`.
