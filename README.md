# Proiector fără frontiere

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.1.0 · Last updated: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Turn classroom phones into a shared screen over local WebRTC — no server, with plugin widgets.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha: the repository holds the structure, the data schema or the first examples and the contribution guides. The scope below is the plan, not what works today.

## Planned scope

- Serverless pairing: a QR code and a WebRTC offer/answer exchange, so phones join without any server.
- A widget API (mount/unmount, send/on, lifecycle) and a widget sandbox (iframe + postMessage) with a documented permission model.
- Widgets: a poll with a live bar chart, a quiz compatible with Undava quiz files, sticky notes and a whiteboard with a colour per phone.
- A teacher control to lock and unlock phones.
- A high-contrast, large-font accessibility theme, and tests on iOS Safari and Android Chrome recorded in `docs/compat.md`.

None of this is implemented yet: each item is a ready-made task in `ISSUES_GOOD_FIRST.md`.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/widgets/example.json` into `data/widgets/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

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
