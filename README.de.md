# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.1.0 · Letzte Aktualisierung: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Verwandle Handys im Klassenzimmer in einen gemeinsamen Bildschirm per lokalem WebRTC – ohne Server, mit Plugin-Widgets.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha: Das Repository enthält die Struktur, das Datenschema oder die ersten Beispiele und die Beitragsleitfäden. Der Umfang unten ist der Plan, nicht das, was heute funktioniert.

## Geplanter Umfang

- Serverlose Kopplung: ein QR-Code und ein WebRTC-Angebot/Antwort-Austausch, damit Telefone ohne Server beitreten.
- Eine Widget-API (Einbinden/Entfernen, Senden/Empfangen, Lebenszyklus) und eine Widget-Sandbox (iframe + postMessage) mit dokumentiertem Berechtigungsmodell.
- Widgets: eine Umfrage mit Live-Diagramm, ein Quiz kompatibel mit Undava-Quizdateien, Haftnotizen und ein Whiteboard mit einer Farbe pro Telefon.
- Eine Lehrkraft-Steuerung zum Sperren und Entsperren der Telefone.
- Ein Barrierefreiheits-Design mit hohem Kontrast und großer Schrift sowie Tests auf iOS Safari und Android Chrome, festgehalten in `docs/compat.md`.

Nichts davon ist bisher umgesetzt: Jeder Punkt ist eine fertig vorbereitete Aufgabe in `ISSUES_GOOD_FIRST.md`.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/widgets/example.json` nach `data/widgets/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
