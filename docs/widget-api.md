# Widget API

For protocol version 1 (`PROTO` in `src/engine.mjs`). A widget is one classroom activity: a poll, a quiz, a timer. It runs in an isolated frame (see [sandbox.md](sandbox.md)) and reaches the projector and the phones only through the `api` object described here. The projector and every phone run the same widget code; `api.role` tells the code which of the two it is.

## Files of a widget

1. `data/widgets/<id>.json` — the descriptor, checked by `schema.json` and by `python scripts/validate.py`: `id` (lowercase letters, digits and hyphens), `name`, `version`, `entry` (always `widgets/<id>/index.js`), `permissions`, `description` and `i18n` with all eight languages. Start from `data/widgets/example.json`.
2. `widgets/<id>/index.js` — an ES module in ES2017 syntax, without imports. It must contain `export function mount(container, api)`. It may also export `strings` (the widget's texts) and `unmount()`. Only `export function`, `export const`, `export let`, `export var` and `export class` are allowed (no `export default`, no `export { … }`): the builder removes the keyword and runs the code inside the frame.
3. `widgets/<id>/style.css` — optional. The style sheets of all widgets are joined with `src/sandbox.css` into one sheet that every widget frame receives, so give your classes a prefix of your own (the bundled widgets use `tm-` for the timer, `pl-` for the poll, `qz-` for the quiz, `nt-` for the notes and `wb-` for the whiteboard). No `@import` and no external `url(…)`.

The source must not contain the character sequences `<!--`, `<script` or `</script`, not even in a comment: the widget is embedded in the page as inert text and the builder refuses anything that could end that block.

## A complete example

```js
export const strings = {
  en: { title: 'Taps', tap: 'Tap!', total: '{n} taps so far' },
  ro: { title: 'Atingeri', tap: 'Atinge!', total: '{n} atingeri până acum' }
};

export function mount(container, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var total = 0, counts = {};

  function draw() {
    container.textContent = '';
    container.appendChild(h('h2', { text: t('title') }));
    container.appendChild(h('p', { role: 'status', text: t('total', { n: total }) }));
    if (!host) {
      container.appendChild(h('button', { type: 'button', class: 'pfs-btn pri pfs-in', text: t('tap'),
        on: { click: function () { api.send({ k: 'tap' }, { to: 'host' }); } } }));
    }
  }

  if (host) {
    api.on(function (data, from) {            // a message from a phone; from = { id, name, color, role: 'guest' }
      if (!data || data.k !== 'tap' || !from || !from.id) return;
      counts[from.id] = (counts[from.id] || 0) + 1;
      total += 1;
      api.setState({ total: total });         // the shared state reaches every phone, also those that join later
      draw();
    });
  } else {
    api.on('state', function (s) { if (s && typeof s.total === 'number') { total = s.total; draw(); } });
    if (api.state) total = api.state.total || 0;
  }
  api.on('lang', draw);
  draw();
}
```

The descriptor for it declares `"permissions": ["none"]`. Missing translations fall back to English, then to the common texts of the runtime, then to the key itself; add all eight languages before you open a pull request.

## `mount(container, api)`

`container` is the page of the frame (`<div id="root">`); build your interface in it and rebuild it when the language changes (`api.on('lang', …)`). It is called once. If it throws, the frame shows a short error message instead and the teacher gets a notification. Handlers that throw are caught and reported the same way (at most one notification every 5 seconds).

`unmount()` is called when the activity is closed. Stop your timers there.

## The `api` object

Properties (read them when needed; the runtime keeps them current):

- `api.id`, `api.version` — the widget id and the version from its descriptor.
- `api.role` — `'host'` on the projector, `'guest'` on a phone.
- `api.me` — `{ id, name, color }` of this device. The projector is always `{ id: 'h', … }` with an empty colour; a phone has an id such as `p3` and a colour that is distinct from the other phones'.
- `api.lang` — the interface language (`ro`, `en`, `fr`, `de`, `es`, `it`, `hu` or `pt`).
- `api.locked` — `true` while the teacher has locked this phone.
- `api.perms` — the permissions granted (the descriptor's list without `none`).
- `api.theme` — `{ dark, hc, xl }`: dark theme, high contrast, large text.
- `api.state` — the latest shared state (see `setState`), `null` until the projector sets one.

Methods:

- `api.peers()` — the phones that are connected now, as an array of `{ id, name, color, locked }`. The projector is not in the list.
- `api.send(data, { to })` — sends any JSON-serialisable value. `to` is `'all'` (the default), `'host'` or a phone id. A phone's `'all'` reaches the projector and every other phone; `'host'` only the projector; a phone id only that phone. The projector's `'all'` reaches every phone; a phone id only that phone. Returns `false` if the value cannot be serialised or the port is closed; `true` does not mean it was delivered.
- `api.setState(state)` — projector only (a phone's call is ignored). The shared state is at most 16384 characters of JSON. It is delivered to every phone at most ten times per second (the last value always arrives) and to a phone that joins later as soon as its widget is ready.
- `api.on(fn)` — message handler: `fn(data, from)` with `from = { id, name, color, role }` (`role` is `'host'` or `'guest'`; the projector's `id` is `'h'`).
- `api.on('state' | 'join' | 'leave' | 'peers' | 'lock' | 'lang' | 'theme', fn)` — the other events: `fn(state)`, `fn(peer)`, `fn(peer)`, `fn(peers)`, `fn(locked)`, `fn(lang)`, `fn(theme)`. Every `on` returns a function that removes the handler; an unknown event name returns a function that does nothing.
- `api.t(key, vars)` — a text from `strings` in the current language; `{name}` placeholders are filled from `vars`.
- `api.h(tag, props, children)` — creates an element. `props`: `class`, `text` (as text, never as HTML), `on: { event: fn }`, `css: { '--c': value }` (set through the style object, because the page forbids `style=` attributes), `data: { key: value }`, the properties `value`, `checked`, `disabled`, `hidden` and `selected`, and any other name as an attribute (`true` gives an empty attribute; `false` and `null` are skipped). `children` are elements, strings or numbers.
- `api.announce(text)` — says `text` politely through a live region for screen readers (at most 200 characters).
- `api.store.get(key)`, `api.store.set(key, value)`, `api.store.remove(key)` — permission `storage`. Each returns a promise. A widget has its own space on this device; keys use the characters `A-Z a-z 0-9 . _ -` (at most 40); a value is at most 16384 characters of JSON and the whole space at most 65536 characters; at most 20 operations per second (bursts of 40). `get` resolves to the stored value or to `null`. A refusal rejects with an `Error` whose message is `perm`, `rate`, `key`, `size`, `io` or `op`.
- `api.save(name, mime, data)` — permission `download`. The page offers the file to the browser's download. `mime` is `image/png` (then `data` is a `data:image/png;base64,…` URL of at most 4 MiB), `text/plain` or `text/csv` (then `data` is text of at most 1 MiB). The file name is cleaned (letters, digits and `._-`, no path, at most 60 characters) and its extension follows the type. In a `text/csv` file, a cell that begins with `=`, `+`, `-`, `@`, a tab or a carriage return gets an apostrophe in front so that a spreadsheet does not run it as a formula (plain numbers such as `-5` are left alone). At most one file every two seconds; a refused request is dropped without an error.

## Budgets for messages

What a widget may send is decided by its permissions, and checked again by the projector for every phone:

- Without `drawing`: at most 4096 characters per message and 10 messages per second (bursts of 20).
- With `drawing` (for strokes and cursors): at most 8192 characters and 40 messages per second (bursts of 80).

Messages that exceed the budget are dropped. Messages from a phone that the teacher has locked are dropped by the projector whatever the widget does: use `api.locked`, the `lock` event and the class `pfs-in` (dimmed and inert while locked) to show the state, and do not rely on them for security.

## Look and feel

The frame sets `lang` on `<html>` and the classes `t-dark`, `t-hc` and `t-xl` according to `api.theme`; style with the variables `--bg --fg --mut --card --bd --acc --acc-fg --ok --bad --warn --fs` and your colours follow the theme. The runtime stylesheet provides `pfs-row`, `pfs-col`, `pfs-grow`, `pfs-card`, `pfs-btn` (with `pri` for the main action), `pfs-sr` (visually hidden), `pfs-muted`, `pfs-ok`, `pfs-bad`, `pfs-big`, `pfs-chip` (a colour dot: set `--c` through `css`), `pfs-tag` and `pfs-in`. Targets are at least 44 pixels; keep that, keep the focus outline, and give every control a visible label or an `aria-label`.

## Rules checked by `npm test`

`test/data.test.mjs` fails a widget that: lacks `export function mount(`; uses a network API (`fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `importScripts`, `import()`), a storage API of the browser (`localStorage`, `sessionStorage`, `indexedDB`, cookies), `parent`, `top`, `opener`, `postMessage`, `window.open`, `location`, `navigator`, `eval`, `new Function`, a string given to `setTimeout`, HTML built from text (`innerHTML` and the like) or an `<iframe>`; declares `download` without calling `api.save` (or the other way round) or `storage` without `api.store` (or the other way round); or asks for the reserved permissions `camera` and `microphone`.

## Testing a widget

Export the pure functions of the widget (the bundled widgets export `fmt`, `tallyVotes`, `parseQuiz`, `cleanNote`, `cleanPoints` and others) and test them with `node --test` in `test/widgets.test.mjs`. The hub's `tests/proiector.test.mjs` opens the whole page in real browsers, connects a projector to up to three phones over WebRTC and runs every bundled widget, plus a deliberately hostile one; run it before you propose a change to the runtime or to the protocol.
