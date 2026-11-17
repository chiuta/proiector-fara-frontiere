# Gute erste Aufgaben

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · **Deutsch** · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Den ganzen Ablauf auf einem echten iPhone (Safari) und einem echten Android-Telefon (Chrome) mit der Checkliste in `docs/compat.md` testen und die eigenen Zeilen in deren Tabelle ergänzen
- [ ] Die Kopplung in einem Heimnetz, in einem Schul- oder Gast-WLAN, das Geräte trennt, und an einem mobilen Hotspot ausprobieren; in `docs/compat.md` festhalten, was funktioniert, und die genauen Fehlermeldungen
- [ ] Eine echte Undava-Quizdatei (oder deren veröffentlichte Spezifikation) beschaffen und den Quiz-Import so erweitern, dass er sie liest, mit einem Test und einem Hinweis in `docs/quiz-format.md`
- [ ] Ein „Hand heben“-Widget ergänzen: Telefone reihen sich ein, der Projektor zeigt die Reihenfolge und lässt die Lehrkraft die nächste Person aufrufen (Berechtigung `none`)
- [ ] Ein Exit-Ticket-Widget ergänzen: Jedes Telefon wählt ein Gesicht oder eine Zahl von 1 bis 5 und kann einen kurzen Kommentar hinzufügen; der Projektor zeigt die Summen und die Kommentare, mit CSV-Export
- [ ] Ein Widget zur Gruppenbildung ergänzen: Der Projektor teilt die verbundenen Telefone in Gruppen gewählter Größe ein, mit einer Schaltfläche zum Neumischen, und jedes Telefon sieht seine Gruppe
- [ ] Quiz: eine zweite CSV mit der Antwort jedes Telefons auf jede Frage ergänzen, damit die Lehrkraft sieht, wer was falsch hatte
- [ ] Die Seite mit einem Screenreader (NVDA oder VoiceOver) und nur mit der Tastatur prüfen, beheben, was nicht angesagt oder nicht erreichbar ist, und das Ergebnis in `docs/compat.md` festhalten
- [ ] Die maschinellen Übersetzungen der Oberfläche und der Widgets (fr, de, es, it, pt, hu) durchsehen und korrigieren, was ein Muttersprachler nicht sagen würde
- [ ] Den Browsertest des Hubs (`tests/proiector.test.mjs`) auf zehn oder mehr simulierte Telefone erweitern, die gleichzeitig zeichnen, und berichten, wie reaktionsfähig der Projektor bleibt

Lege sie alle auf GitHub mit `scripts/create_issues.sh` an (benötigt die `gh`-CLI).
