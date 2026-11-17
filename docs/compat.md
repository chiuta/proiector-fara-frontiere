# Compatibility

What runs where, what has been tested, and what has **not**. Read the last two sections before you rely on the app in a real classroom.

## What the page needs

- **Script and style.** The code is written to the ES2017 floor that all the hub's single-file apps share (`tools/compat/compat.config.json`): Chrome and Edge 55, Firefox 52, Safari 10.1, iOS 10.3. The kit (`fff-kit/src/compat.js`) fills in a few smaller gaps. Shipped code avoids object spread, optional chaining, `??`, `padStart`, `inset`, flex `gap`, `aspect-ratio` and `dvh`.
- **The isolated frame.** Widgets run in `<iframe sandbox srcdoc>`, which needs Chrome 20, Firefox 25, Safari 6 or Edge 79 or newer (caniuse). Edge 12 to 18 (the old, non-Chromium Edge) cannot run widgets.
- **Pairing.** Phones and projector connect through WebRTC data channels. Per caniuse, data channels exist from Chrome 24, Firefox 22, Safari and iOS 11 and Edge 79; Edge 12 to 18 and iOS before 11 can show the page but cannot pair. When WebRTC is missing, the app says so instead of failing silently.
- **Pairing codes.** The short, compressed codes need `DecompressionStream` on the device that reads them (Chrome and Edge 80, Firefox 113, Safari 16.4 according to the kit's documentation). On an older browser tick **Compatible code (uncompressed)** in the pairing dialog on both devices; the code is about twice as long (more QR frames).
- **Scanning.** Scanning with the camera needs HTTPS (or a trusted local file) and the user's permission; choosing a photo of the code from the gallery works everywhere, and the code can always be copied and pasted.

So the effective floor for a real session is the highest of those minima: Chrome 55 or newer, Edge 79 or newer, Firefox 52 or newer, Safari and iOS 11 or newer. Those numbers come from the feature tables above, not from running those browsers.

## The network

The app itself makes no requests: the pairing exchange is done by hand (QR codes or pasted text) and the connection is peer to peer.

- Without a STUN server (the default) the connection works only when the phone can reach the projector's address, normally on the same Wi-Fi. Networks that isolate clients (guest Wi-Fi, many school and corporate networks) block it. Browsers hide local addresses behind `.local` names that the other device must resolve by multicast; that fails on some networks.
- A STUN server can be entered in the pairing dialog (the kit allows up to three, opt-in). There is no TURN relay, so strict (symmetric) NATs, which are common on mobile networks, cannot be crossed.
- Each side reveals its IP address to the other when pairing; the dialog asks for confirmation first.

## What has been tested

All of it on Chromium 153 on Linux, driven by Playwright (`tests/proiector.test.mjs` in the hub; `npm test` in this repository; the hub's `tests/alpha-apps.test.mjs` for the page as a whole):

- every language (eight) without errors or raw keys; narrow (360 px) and wide screens without horizontal overflow; light, dark and high-contrast themes;
- accessibility: axe-core on the whole page, on the live layer and inside widget frames, in all three themes;
- real WebRTC connections between a projector and up to three phones on the same machine: pairing, joining, leaving, coming back, being removed, ending the session, the language and theme following the projector, a locked phone not being heard;
- every bundled widget (timer, poll, quiz with the answer withheld until revealed, notes, whiteboard with a PNG, CSV downloads);
- hostile widgets (every way out of the frame is refused) and hostile phones (forged, oversized and flooding frames), see `docs/sandbox.md`.

## What has not been tested

- **Any real phone.** No iPhone, no Android phone, no tablet. Touch behaviour, on-screen keyboards, the camera scanner, screen wake-up and the real feel of the layouts at 360 px are untested.
- **Any other browser.** Firefox, Safari, Samsung Internet and Edge have not run the page. Chromium is the only engine behind the numbers above.
- **A real network.** Pairing between different devices over Wi-Fi, mDNS name resolution, client isolation, VPNs and mobile data.
- **The upper limit.** The engine enforces 30 phones and its tests exercise that, but the browser tests use at most three real connections. How a projector laptop behaves with thirty pupils drawing at once is unknown.
- **Long sessions.** Hours of use, a phone that sleeps and wakes, a projector that changes network.
- **Older browsers.** The floor is derived from feature tables and from static checks of the code, not from running it.

## Checklist for a test on real devices

Anyone with a phone can help: run the steps and add a row to the table below in a pull request. Use the file served over HTTPS (`https://proiector-fara-frontiere.chiuta.ro`) or the downloaded `index.html`.

1. Open the page on the projector device and on the phone. Switch the language on both.
2. Press **Add a phone** on the projector and pair by scanning the code with the phone's camera inside the page. Repeat by choosing a photo of the code. Repeat by pasting the text.
3. Open each of the five activities on the projector and use them from the phone: a vote, an answer, a note, a stroke, the timer running.
4. Lock the phone from the projector and check that it cannot send; unlock it.
5. Turn the phone's screen off for twenty seconds, turn it on and check that it comes back by itself.
6. Remove the phone from the projector and end the session.
7. Switch to high contrast and large text on the projector and check the phone follows.

| Date | Device and system | Browser and version | Network | Steps that worked | Notes |
|---|---|---|---|---|---|
| — | — | — | — | — | No real device has been tested yet. |
