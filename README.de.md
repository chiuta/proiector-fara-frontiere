# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

🌐 https://proiector-fara-frontiere.chiuta.ro

> Verwandle Handys im Klassenzimmer in einen gemeinsamen Bildschirm per lokalem WebRTC – ohne Server, mit Plugin-Widgets.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha, nutzbar: die Projektor-Seite und fünf Aktivitäten (Timer, Umfrage, Quiz, Haftnotizen, Whiteboard) laufen in der einen Datei `index.html`: auf dem Gerät der Lehrkraft öffnen, Telefone per QR- oder Textcode hinzufügen, ohne Server und ohne Konto. Die Aktivitäten laufen in isolierten Frames. Was nicht getestet wurde (echte Telefone, andere Browser als Chromium, echtes WLAN), steht weiter unten und in `docs/compat.md`.

## Was es kann

- Zwei Rollen in einer Seite: am Projektor (zeigt den gemeinsamen Bildschirm und steuert die Aktivitäten) und als Telefon (tritt bei und macht mit). Eine Sitzung fasst bis zu 30 Telefone.
- Kopplung ohne Server: Jedes Telefon wird mit dem Projektor gekoppelt, indem ein Code ausgetauscht wird, als QR-Bilder, Foto des Codes oder eingefügter Text; kein Konto, kein Signalisierungsserver, kein Tracking. Standardmäßig verlässt nichts das lokale Netz.
- Fünf Aktivitäten: ein Countdown-Timer; eine Umfrage mit Live-Balken und einer CSV des Ergebnisses; ein Quiz (Fragedateien als JSON, einfacher Text oder CSV, Tempobonus, Rangliste, eine CSV der Punkte, bis zu fünf auf dem Gerät gespeicherte Sätze), bei dem die richtige Antwort bis zur Auflösung auf dem Projektor bleibt; Haftnotizen von allen Telefonen mit Textexport; ein Whiteboard mit einer Farbe pro Telefon und PNG-Export.
- Steuerung für die Lehrkraft: ein Telefon oder alle sperren und entsperren, ein Telefon entfernen, Vollbild, Bildschirm anlassen, Sitzung beenden. Ein Telefon, das ausfällt und zurückkehrt, bekommt Namen und Farbe zurück.
- Jedes Gerät hat seine eigene Sprache (acht) und sein eigenes Aussehen: hell oder dunkel, hoher Kontrast, große Schrift.
- Eine Widget-API und ein dokumentiertes Berechtigungsmodell (`docs/widget-api.md`, `docs/sandbox.md`): Eine neue Aktivität besteht aus einem Descriptor in `data/widgets/` und einem Skript in `widgets/`.
- Unterstützung für Tastatur und Screenreader, große Touch-Ziele, Layout für schmale Handy-Bildschirme; kein Tracking, keine Konten, funktioniert offline.
- Als App installierbar und nach dem ersten Besuch offline verfügbar, wenn sie über HTTPS ausgeliefert wird (ein Service Worker behält die Seite; sonst wird nichts gespeichert oder gesendet). Aus einer heruntergeladenen Datei geöffnet, funktioniert sie genauso, ohne Installation.

## Wie es funktioniert

- `node scripts/build.mjs` baut die eine `index.html` aus `src/` (`engine.mjs` für die reine Logik, `ui.js` für die Oberfläche, `sandbox.js` für den Code im Frame, `i18n.mjs`, `app.css`, `sandbox.css`) und aus `widgets/`; `--check` prüft, dass die Seite zu den Quellen passt, einschließlich des Hashs jedes Widgets.
- Der Projektor entscheidet: Ein Telefon sendet Anfragen, und der Projektor prüft Protokollversion, Namen, Widget-IDs, Nachrichtengrößen, Raten und Berechtigungen, bevor er etwas verwendet (`docs/protocol.md`). Stimmen, Antworten und Punkte bleiben auf dem Projektor.
- Jede Aktivität läuft in `<iframe sandbox="allow-scripts" srcdoc>`: ohne Origin, mit der Richtlinie `default-src 'none'`, einem privaten Nachrichtenkanal und nur den Berechtigungen aus ihrem Descriptor; die Seite selbst erlaubt keine einzige Netzwerkanfrage (`docs/sandbox.md`).
- Telefone und Projektor sprechen über WebRTC-Datenkanäle, die von Hand gekoppelt werden (QR-Bilder oder eingefügter Text); nichts läuft über einen Server, und ohne einen von dir eingetragenen STUN-Server verlässt keine Anfrage das lokale Netz.
- `npm test` prüft die Engine, die Protokollgrenzen, den Quiz-Import, die Widgets, die Übersetzungen der Oberfläche und der Widgets, die PWA-Dateien und die Dokumentation; der Browsertest des Hubs (`tests/proiector.test.mjs`) öffnet die Seite in echten Chromium-Browsern mit echten WebRTC-Verbindungen, einem feindlichen Widget und feindlichen Telefonen. Die Entwicklung braucht Node.js 24 oder neuer; die Seite selbst braucht einen Browser mit ES2017 und WebRTC-Datenkanälen.
- `manifest.webmanifest`, `sw.js` und die Symbole erzeugt `node scripts/build.mjs` über das gemeinsame Kit (Abschnitt `pwa` in `src/app.json`); `--check` prüft sie ebenfalls, und `npm test` stellt sicher, dass Manifest, Service-Worker-Version und CSP zur Seite passen.

## Grenzen

- Alpha: Kein echtes Telefon und kein Tablet und kein anderer Browser als Chromium hat sie bisher ausgeführt; alles wurde in Chromium mit echten WebRTC-Verbindungen auf einem einzigen Rechner getestet (`docs/compat.md`).
- Standardmäßig funktioniert die Kopplung nur im selben lokalen Netz. Ein von dir eingetragener STUN-Server könnte sie netzübergreifend ermöglichen (hier nicht ausprobiert), aber es gibt kein Relay (kein TURN), daher können Gast-WLANs, die Geräte voneinander trennen, VPNs und viele Schul-, Firmen- und Mobilfunknetze sie weiterhin blockieren. Jedes Telefon braucht seinen eigenen Codeaustausch, eine ganze Klasse hinzuzufügen dauert also einige Minuten.
- Die Kopplung zeigt dem anderen Gerät die IP-Adresse jedes Geräts (der Dialog fragt vorher). Der Kanal ist verschlüsselt, die Identität des anderen Geräts wird aber nicht geprüft: Koppele nur in deinem eigenen Raum.
- Die Sandbox hindert eine feindliche Aktivität nicht daran, ihren eigenen Frame einzufrieren (in manchen Browsern den ganzen Tab), und eine Aktivität kann ihren privaten Kanal bis zu ihren Grenzen nutzen. Füge nur Aktivitäten hinzu, deren Quelltext du gelesen hast (`docs/sandbox.md`).
- Das Quiz liest JSON-, Klartext- und CSV-Dateien. Das im ersten Plan verlangte „Undava“-Format wurde nirgends dokumentiert gefunden und nicht mit echten Undava-Dateien getestet (`docs/quiz-format.md`).
- Zwischen Sitzungen behält ein Gerät nur seine eigenen Einstellungen (Name, hoher Kontrast, große Schrift) und die Quizsätze, die du speicherst; Ergebnisse, Notizen und Zeichnungen bleiben nicht erhalten, wenn du sie nicht herunterlädst. Ein Projektor, der die Seite neu lädt, beendet die Sitzung, und die Telefone müssen neu gekoppelt werden.
- Eine Sitzung fasst bis zu 30 Telefone, was die Engine erzwingt; die Browsertests nutzten höchstens drei echte Verbindungen.
- Oberfläche und Aktivitäten gibt es in acht Sprachen; die auf Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch wurden maschinell übersetzt und nicht von Muttersprachlern geprüft.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/widgets/example.json` nach `data/widgets/<id>.json` und bearbeite die Datei (Schema in `schema.json`), dann führe `python scripts/validate.py` aus.
3. Schreibe `widgets/<id>/index.js` (siehe `docs/widget-api.md`): `export function mount(container, api)` und `strings` in allen acht Sprachen.
4. Teste die reinen Funktionen in `test/widgets.test.mjs`, dann führe `npm test` und `node scripts/build.mjs` aus.
5. Öffne einen Pull Request mit der neu erzeugten `index.html`.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
