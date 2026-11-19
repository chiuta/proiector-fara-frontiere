# Änderungsprotokoll

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · **Deutsch** · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Unveröffentlicht]

## [0.2.1] - 2026-11-20

### Geändert
- fff-kit 1.8.1: Blockiert der Browser den Speicher oder fehlt er (`localStorage`/`sessionStorage` lösen einen Fehler aus oder fehlen), startet die Seite mit einem temporären Arbeitsspeicher, statt anzuhalten; die Daten bleiben nach dem Schließen der Seite nicht erhalten.
- fff-kit 1.8.1: Die Hilfe, die kleine Bedienelemente auf 44 px vergrößert, misst jetzt auch die Breite des Seitenkörpers und des übergeordneten Elements; eine Schaltflächenreihe kann den Bildschirm also nicht mehr verlassen (die Gruppe bleibt unverändert, wenn die Vergrößerung sie zu breit machen würde).

## [0.2.0] - 2026-11-17

### Hinzugefügt
- Die Seite für Projektor und Telefon: eine einzige `index.html`, aus `src/` und `widgets/` mit `node scripts/build.mjs` gebaut (`--check` prüft sie), mit dem gemeinsamen Bildschirm, den Bedienelementen und der Telefonansicht in derselben Datei.
- Kopplung ohne Server durch Austausch von Codes (QR-Bilder, Foto des Codes oder eingefügter Text), bis zu 30 Telefone pro Sitzung; Steuerung durch die Lehrkraft zum Sperren oder Entsperren, Entfernen eines Telefons, Vollbild, Bildschirm wach halten und Sitzung beenden.
- Fünf Aktivitäten: Countdown-Timer, Umfrage, Quiz, Haftnotizen und Whiteboard, mit CSV-, Text- und PNG-Export, wo es passt.
- Die Widget-API und die Isolierung jeder Aktivität in einem Sandbox-Frame, mit den Berechtigungen `none`, `drawing`, `storage` und `download` (`camera` und `microphone` sind reserviert und werden abgelehnt): `docs/widget-api.md` und `docs/sandbox.md`.
- Das Protokoll zwischen Projektor und Telefon mit seinen Grenzen (Telefone, Namen, Nachrichtengrößen, Raten, gespeicherte Daten), eine Sitzung, die sich neu synchronisiert, wenn eine schwache Verbindung zurückkehrt, und CSV-Exporte, die Zellen entschärfen, die mit einem Formelzeichen beginnen: `docs/protocol.md`.
- Quizdateien als JSON, Klartext oder CSV, gelesen von einem toleranten Import und auf Englisch und Rumänisch in `docs/quiz-format.md` dokumentiert; das „Undava“-Format wird nicht beansprucht, weil keine Spezifikation gefunden wurde.
- Acht Sprachen für Oberfläche und Aktivitäten, auf jedem Gerät gewählte Sprache und Darstellung (hell, dunkel, hoher Kontrast, große Schrift) sowie Unterstützung für Tastatur und Screenreader.
- Tests: `npm test` (Engine, Protokollgrenzen, Quiz-Import, Widgets, Übersetzungen, PWA-Dateien, Build und Dokumentation), ein Browsertest im Hub mit echten WebRTC-Verbindungen, einem feindlichen Widget und feindlichen Telefonen, und `docs/compat.md` mit einer Checkliste für echte Geräte.
- README, CHANGELOG, CONTRIBUTING und ISSUES_GOOD_FIRST für diese Version in acht Sprachen neu geschrieben, mit zehn Einstiegsaufgaben.
- ISSUES_GOOD_FIRST und CODE_OF_CONDUCT in alle acht Sprachen übersetzt.
- README auf Englisch, Rumänisch, Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch: Abschnitte zu Status und geplantem Umfang (abgeleitet aus `ISSUES_GOOD_FIRST.md`).
- Installierbar (PWA): `manifest.webmanifest`, `sw.js` und die Symbole werden vom gemeinsamen Kit (`fff-kit/pwa`) erzeugt; die Seite funktioniert nach dem ersten Besuch über HTTPS offline.

### Geändert
- `data/widgets/example.json` ist jetzt ein Vorlagen-Descriptor (`my-widget`, mit Übersetzungen in acht Sprachen); der Descriptor des Countdown-Timers ist nach `data/widgets/timer.json` umgezogen, neben `poll`, `quiz`, `notes` und `whiteboard`.
- `widgets/timer/index.js` ist jetzt der echte Countdown-Timer und nicht mehr das Demonstrationsbeispiel.
- `schema.json`: `description` und `i18n` sind Pflicht (Englisch ist Pflicht, die anderen sieben Sprachen meldet der Validator), `id` und `entry` müssen einer festen Form folgen, und `permissions` akzeptiert ein bis drei der Werte `none`, `drawing`, `storage` und `download`; `camera` und `microphone` werden nicht mehr akzeptiert.
- `scripts/validate.py` prüft zusätzlich, dass `id` dem Dateinamen entspricht, dass `entry` existiert und `mount` exportiert, dass die reservierten Berechtigungen mit einer klaren Meldung abgelehnt werden und dass die Übersetzungen vollständig sind (eine Warnung, mit `--strict` ein Fehler).
- Der Workflow läuft auf Ubuntu 26.04 mit Node.js 26 und führt auch die Tests und die Build-Prüfung aus.

## [0.1.0] - 2026-11-13

### Hinzugefügt
- Erstes Gerüst: Struktur, Datenschema oder erste Beispiele, Beitragsanleitungen in acht Sprachen.
