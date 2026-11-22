# Proiector fără frontiere

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.2.1 · Last updated: 2026-11-22

🌐 https://proiector-fara-frontiere.chiuta.ro

> Turn classroom phones into a shared screen over local WebRTC — no server, with plugin widgets.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha, usable: the projector page and five activities (timer, poll, quiz, sticky notes, whiteboard) work in the single `index.html`: open it on the teacher’s device, add phones with a QR or text code, no server and no account. The activities run in isolated frames. What has not been tested (real phones, browsers other than Chromium, real Wi-Fi) is listed below and in `docs/compat.md`.

## What it does

- Two roles in one page: at the projector (it shows the shared screen and controls the activities) and as a phone (it joins and takes part). A session holds up to 30 phones.
- Pairing without a server: each phone is paired with the projector by exchanging a code, as QR frames, a photo of the code or pasted text; no account, no signalling server, no tracking. By default nothing leaves the local network.
- Five activities: a countdown timer; a poll with live bars and a CSV of the result; a quiz (question files as JSON, plain text or CSV, speed bonus, scoreboard, a CSV of the scores, up to five sets saved on the device) in which the right answer stays on the projector until it is revealed; sticky notes from every phone with a text export; a whiteboard with one colour per phone and a PNG export.
- Teacher controls: lock or unlock one phone or all of them, remove a phone, full screen, keep the screen awake, end the session. A phone that drops out and comes back gets its name and colour back.
- Each device has its own language (eight) and its own look: light or dark, high contrast, large text.
- A widget API and a documented permission model (`docs/widget-api.md`, `docs/sandbox.md`): a new activity is one descriptor in `data/widgets/` plus one script in `widgets/`.
- Keyboard and screen-reader support, large touch targets, a layout for narrow phone screens; no tracking, no accounts, works offline.
- Installable as an app and available offline after the first visit when served over HTTPS (a service worker keeps the page; nothing else is stored or sent). Opened from a downloaded file it works the same, without installation.

## How it works

- `node scripts/build.mjs` assembles the single `index.html` from `src/` (`engine.mjs` for the pure logic, `ui.js` for the interface, `sandbox.js` for the code that runs inside a frame, `i18n.mjs`, `app.css`, `sandbox.css`) and from `widgets/`; `--check` verifies that the page matches the sources, including the hash of every widget.
- The projector is the authority: a phone sends requests, and the projector checks the protocol version, names, widget ids, message sizes, rates and permissions before it uses anything (`docs/protocol.md`). Votes, answers and scores stay on the projector.
- Each activity runs in `<iframe sandbox="allow-scripts" srcdoc>`: no origin, a policy of `default-src 'none'`, one private message channel and only the permissions its descriptor lists; the page itself allows no network request at all (`docs/sandbox.md`).
- Phones and projector talk over WebRTC data channels that are paired by hand (QR frames or pasted text); nothing goes through a server, and unless you enter a STUN server no request leaves the local network.
- `npm test` checks the engine, the protocol limits, the quiz importer, the widgets, the translations of the interface and of the widgets, the PWA files and the documentation; the hub’s browser test (`tests/proiector.test.mjs`) opens the page in real Chromium browsers with real WebRTC connections, a hostile widget and hostile phones. Development needs Node.js 24 or newer; the page itself needs a browser with ES2017 and WebRTC data channels.
- `manifest.webmanifest`, `sw.js` and the icons are produced by `node scripts/build.mjs` through the shared kit (`pwa` in `src/app.json`); `--check` also verifies them, and `npm test` checks that the manifest, the service worker version and the CSP match the page.

## Limits

- Alpha: no real phone or tablet, and no browser other than Chromium, has run it; everything was tested in Chromium with real WebRTC connections on one machine (`docs/compat.md`).
- By default pairing works only on the same local network. A STUN server you enter may allow it across networks (not tried here), but there is no relay (no TURN), so guest Wi-Fi that isolates devices, VPNs and many school, corporate and mobile networks can still block it. Each phone needs its own exchange of codes, so adding a whole class takes a few minutes.
- Pairing shows each device’s IP address to the other (the dialog asks first). The channel is encrypted, but the identity of the other device is not verified: pair only in your own room.
- The sandbox does not stop a hostile activity from freezing its own frame (in some browsers the whole tab), and an activity can use its private channel up to its limits. Add only activities whose source you have read (`docs/sandbox.md`).
- The quiz reads JSON, plain-text and CSV files. The “Undava” format asked for in the first plan was not found documented anywhere and has not been tested against real Undava files (`docs/quiz-format.md`).
- Between sessions a device keeps only its own settings (name, high contrast, large text) and the quiz sets you choose to save; results, notes and drawings are not kept unless you download them. A projector that reloads the page ends the session and the phones must pair again.
- A session holds up to 30 phones, which the engine enforces; the browser tests used at most three real connections.
- The interface and the activities exist in eight languages; those in French, Italian, Spanish, Portuguese, German and Hungarian were translated by software and have not been reviewed by native speakers.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/widgets/example.json` to `data/widgets/<id>.json` and edit it (schema in `schema.json`), then run `python scripts/validate.py`.
3. Write `widgets/<id>/index.js` (see `docs/widget-api.md`): `export function mount(container, api)` and `strings` in all eight languages.
4. Test the pure functions in `test/widgets.test.mjs`, then run `npm test` and `node scripts/build.mjs`.
5. Open a pull request with the regenerated `index.html`.

## Good first issues

See `ISSUES_GOOD_FIRST.md` for ready-made tasks.

## License

Code: MIT. Contributed data: state its source; it is released under the same licence unless the file says otherwise.

## Support

If this project is useful, you can [buy me a coffee](https://buymeacoffee.com/echo.of.the.strings).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Add yourself with `@all-contributors please add @you for data` in your pull request.
