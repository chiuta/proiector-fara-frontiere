# Sandbox and permissions

A widget is code that somebody else wrote, run on a teacher's projector and on pupils' phones. The design therefore assumes that a widget may be hostile, and does not depend on the widget behaving. This page says what isolates it, what each permission allows, what the projector enforces on every message, and what the sandbox does **not** protect against.

## What isolates a widget

1. **A frame without an origin.** Each widget runs in `<iframe sandbox="allow-scripts" srcdoc>`. There is no `allow-same-origin`, so the frame has an opaque origin: it cannot read the page, `localStorage`, `sessionStorage`, IndexedDB or cookies of the app, and it cannot touch its parent. There is no `allow-top-navigation`, `allow-popups`, `allow-forms`, `allow-modals`, `allow-downloads` or `allow-pointer-lock`.
2. **A policy with nothing in it.** The frame carries its own Content-Security-Policy: `default-src 'none'`; `script-src` and `style-src` only for the SHA-256 hashes of the exact blocks that the builder produced; `img-src data:`; `base-uri 'none'`; `form-action 'none'`. With `default-src 'none'` there is no `connect-src`, `frame-src`, `worker-src`, `media-src`, `font-src` or `object-src`: no `fetch`, XHR, WebSocket, beacon, nested frame, worker, import, font, media or plug-in can load anything. Text given to `eval`, `new Function` or `setTimeout` does not run, and inline handlers and injected scripts are refused.
3. **The page has the same policy.** `index.html` has `default-src 'none'`, scripts and styles only by hash, images only from itself or `data:`, no forms, no base URL. Nothing in the app can make a request to another site, and the hashes of the widgets are in the policy, so changing a widget changes the policy too.
4. **One private channel.** The page and the frame are connected by a `MessageChannel` created for that widget. Everything that crosses it is a JSON text (the field `j`) that the page parses and checks: its type, its size, the permissions of the widget, the rate. The widget never receives a reference to anything of the page.
5. **Checks before the code is built in.** The builder refuses a widget source that contains `<!--`, `<script` or `</script`. `npm test` refuses network, storage, `parent`, `eval`, HTML-from-text and similar APIs in widget sources, and checks that the permissions a widget declares are exactly those it uses (see `docs/widget-api.md`).
6. **The projector is the authority.** Votes, answers, scores and shared state live on the projector. A phone sends requests; the projector validates them (`docs/protocol.md`) and decides.

## Permissions

A descriptor lists one to three permissions.

- `none` — the widget uses only messages and shared state. It must be the only entry. Budget: 4096 characters per message, 10 messages per second (bursts of 20).
- `drawing` — a larger message budget for strokes and cursors: 8192 characters, 40 messages per second (bursts of 80). Used by the whiteboard.
- `storage` — `api.store.*`: a private space for this widget on this device, in the browser's local storage under the names `pfs.w.<id>.<key>`. Keys of at most 40 characters, values of at most 16384 characters of JSON, 65536 characters in all, 20 operations per second (bursts of 40). Nothing leaves the device. Used by the quiz for the sets of questions you save.
- `download` — `api.save(…)`: the page offers a file to the browser's download. Only PNG images (4 MiB), plain text and CSV (1 MiB); a clean file name; one file every two seconds; in CSV files a cell that could run as a formula in a spreadsheet gets an apostrophe in front. Used by the poll, the quiz, the notes and the whiteboard.
- `camera` and `microphone` are reserved. They are not implemented: `scripts/validate.py` rejects a descriptor that asks for them and the page does not open such a widget.

A permission is a promise by the widget's author that tests check against the code; the projector enforces the limits regardless of the promise.

## Flood protection

A phone, or a widget on a phone, that sends without end must not slow the projector or the other phones down.

- Any message from a phone is limited to 300 per second (bursts of 600) and dropped before it is parsed; the rare control messages (`name`, `rdy`) to 5 per second (bursts of 15).
- Widget messages follow the budget of the widget's permissions (above), measured per phone.
- What the projector relays from one phone to the others is limited to 1500 deliveries per second in total (bursts of 3000), counted per recipient, so one message cannot be multiplied without limit.
- A connection whose send queue holds more than 524288 bytes drops the messages that are not vital.
- The shared state goes out at most ten times per second and the list of phones at most four times per second; the last version always arrives.
- A widget's error notification appears at most once every five seconds. A widget cannot start more than one download every two seconds.
- Up to 30 phones; names are cleaned of control and direction characters, shortened to 24 characters and shown as text only.

## What the browser tests prove

`tests/proiector.test.mjs` in the hub installs two deliberately hostile widgets (one with permission `none`, one with `drawing`, `storage` and `download`) next to the real ones and drives them in a real browser. They try: reading the parent's document and storage, cookies, IndexedDB, `fetch`, XHR, WebSocket, beacons, images, form submission, nested frames, `window.open`, workers, dynamic `import`, camera, geolocation, the clipboard, `eval`, `new Function`, string timers, inline handlers and injected scripts, navigating the top page and the frame itself, and a flood of messages, states, errors, storage writes and downloads with CSV formulas. The test requires that every attempt is refused (with the browser's own policy or sandbox report for each), that no network request leaves the page, and that the projector stays responsive and within its limits. Hostile phones that send forged and oversized raw frames are covered as well.

## What the sandbox does not protect against

Be honest with yourself about these before you let a stranger's widget into your classroom.

- **A widget can use its own port.** Any code in the frame, hostile or not, can listen for the start-up message and take the channel. That gives it exactly the powers of `api` and nothing more, so the limits above are the real boundary.
- **A widget can freeze its frame, and may freeze the tab.** A loop that never ends stops the widget; in browsers that keep the frame in the same process as the page it can stop the whole page. Reload the page if that happens. Closing the activity does not help while the page is frozen.
- **A widget can destroy or navigate its own frame.** The policy stops anything from loading in it, but the activity is then blank until the teacher closes it.
- **A widget can draw anything inside its frame**, including text that looks like a message from the app. The bar, the dialogs and the list of phones are outside the frame and cannot be drawn over.
- **Names come from the pupils.** The page shows them as text; a widget that shows names must do the same (`api.h` does).
- **The local network is outside this page.** The connection between phones and projector is encrypted by WebRTC, but it does not verify who is on the other end: pair only devices in your own room (see `docs/protocol.md`).
- **Review before you trust.** A widget you add runs inside `index.html`. Read its source and its permissions, and prefer to ask for the smallest permission list that works.
