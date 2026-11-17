# Protocol between the projector and the phones

Version 1 (`PROTO` in `src/engine.mjs`). The projector (the host) and each phone (a guest) exchange JSON objects over one WebRTC data channel per phone. There is no server: the phones and the projector find each other with the pairing dialog of the shared kit (`fff-kit`, see `fff-kit/docs/p2p.md` in the hub repository).

## Pairing

1. On the projector, press **Add a phone**. A code (as text and as a QR code, in several frames if it is long) appears.
2. On the phone, open the app, choose **Join**, and scan or paste the code. The phone shows an answer code.
3. Scan or paste that answer on the projector. The data channel `fff` opens, the phone sends `hi` and the projector replies with `hello`.

The codes carry the WebRTC session descriptions with the addresses of the two devices. Consequences you should know:

- Each side reveals its IP address (also its local one) to the other; the dialog asks for confirmation first.
- By default there is no STUN or TURN server, so no request leaves the local network and the connection works when the phone can reach the projector's address on the same network. Wi-Fi networks that isolate clients (guest networks, many school and corporate networks) block it. A STUN server can be entered in the dialog (opt-in); there is no relay (no TURN), so strict NATs cannot be crossed.
- The channel is encrypted (DTLS) but the identity of the other side is not verified: the codes must reach the other device by a channel you trust, in the same room.

## Messages

Every message is an object with a field `t` (its type). The kit also exchanges `{ "_fff": "ping" | "pong" | "bye" }` for the heartbeat; those never reach the app.

Phone to projector:

- `hi` — `{ t, p, app, name, cid, lang }`. `p` is the protocol version (must equal 1), `app` the app version, `name` the display name, `cid` a random identifier the phone keeps and never shows (it lets the phone take its old place back after a reconnection), `lang` the language.
- `name` — `{ t, name }`: a new display name.
- `rdy` — `{ t, w, n }`: the widget `w` of instance `n` is mounted on this phone.
- `w` — `{ t, w, n, to, j }`: a widget message. `to` is `'host'`, `'all'` or a phone id (at most 12 characters); `j` is the JSON text of the data.

Projector to phone:

- `hello` — `{ t, p, app, you, peers, active }`: your id, name and colour (`you`), the phones that are connected (`peers`), and the activity that is open (`active`, `{ w, n }` or `null`).
- `roster` — `{ t, peers }`: the list of phones, `[{ id, name, color, locked }]`, sent when it changes.
- `open` — `{ t, w, n }`: open widget `w` as instance `n`. `close` — `{ t }`: close the activity.
- `ws` — `{ t, w, n, j }`: the shared state of the widget (JSON text of at most 16384 characters).
- `w` — `{ t, w, n, f, j }`: a widget message from the projector (`f` is `'h'`) or relayed from another phone (`f` is that phone's id).
- `bye` — `{ t, why }`: the session ends. `why` is `full` (30 phones are connected), `proto` (the protocol versions differ), `removed` (the teacher removed this phone) or `end` (the teacher ended the session).

## The projector decides

Everything that comes from a phone is checked before it is used:

- `hi`: the version must match (otherwise `bye` with `proto`), there must be room (otherwise `bye` with `full`), the name is cleaned (no control or direction characters, spaces collapsed, at most 24 characters) and a phone that comes back with the same `cid` gets its id and colour back. A phone that has not sent a valid `hi` within 15 seconds is disconnected.
- `w`: the widget id must be of the form `[a-z0-9-]{1,40}` and the instance must be the one that is open now (an older instance is stale and dropped); `to` must be valid; `j` must be valid JSON within the byte budget of the widget's permissions; the phone must not be locked; the phone's rate limit must allow it. A message to another phone costs one relay token per recipient.
- Nothing a phone sends can open an activity, change another phone's name or colour, or set the shared state.

The limits are in `LIMITS` in `src/engine.mjs`; this table repeats them and `test/docs.test.mjs` checks the table against the code.

| Limit | Value |
|---|---|
| Phones at once | 30 |
| Name length | 24 characters |
| Widget id length | 40 characters |
| Shared state | 16384 characters of JSON |
| Message without `drawing` | 4096 characters, 10 per second, bursts of 20 |
| Message with `drawing` | 8192 characters, 40 per second, bursts of 80 |
| Any message from one phone | 300 per second, bursts of 600 |
| `name` and `rdy` from one phone | 5 per second, bursts of 15 |
| Relayed between phones, in total | 1500 deliveries per second, bursts of 3000 |
| Storage operations of one widget | 20 per second, bursts of 40 |
| Send queue before non-vital messages are dropped | 524288 bytes |
| Messages kept for a widget that is still starting | 200 |
| Shared state broadcast | at most every 100 ms |
| Phone list broadcast | at most every 250 ms |
| Widget error notification | at most every 5000 ms |
| File saved by a widget | at most every 2000 ms; 4194304 bytes for an image, 1048576 characters for text |

## Weak connections

The kit marks a session `lost` when no frame has arrived for 9 seconds, and `recovered` as soon as any frame arrives again; after 30 seconds of silence the session is closed. A session in the `lost` state still has an open data channel, so the app keeps sending to it. When a phone recovers, the projector sends the phone list and the open activity again, and a phone ignores an `open` for the instance it already shows. (Before version 0.2.0 the projector stopped sending while a phone was marked lost, so a phone that had a short hiccup could stay on "waiting for the teacher" for good; the browser tests found it.) The projector marks such a phone with the notice "No signal for a few seconds…", and the phone shows the same notice.

## Instances

Each time the projector opens an activity it gives it a new instance number `n` (1, 2, 3 …). Messages, states and `rdy` of another instance are stale and ignored, so a late message of the poll you closed cannot reach the quiz you opened next.

## Compatibility

Changing the shape of a message or the meaning of a limit means raising `PROTO`. A phone and a projector with different versions refuse each other with `bye` and the reason `proto`; each says so in its own language.
