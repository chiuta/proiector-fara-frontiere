# Proiector fără frontiere

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.1.0 · Ultima actualizare: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transformă telefoanele din clasă într-un ecran comun prin WebRTC local — fără server, cu widgeturi-plugin.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa: depozitul conține structura, schema de date sau primele exemple și ghidurile de contribuție. Domeniul de mai jos este planul, nu ceea ce funcționează azi.

## Domeniu planificat

- Asociere fără server: un cod QR și un schimb WebRTC ofertă/răspuns, ca telefoanele să se alăture fără niciun server.
- Un API pentru widgeturi (montare/demontare, trimitere/ascultare, ciclu de viață) și un sandbox pentru widgeturi (iframe + postMessage) cu un model de permisiuni documentat.
- Widgeturi: un sondaj cu diagramă live, un test compatibil cu fișierele de test Undava, notițe lipicioase și o tablă cu câte o culoare pe telefon.
- Un control pentru profesor care blochează și deblochează telefoanele.
- O temă de accesibilitate cu contrast ridicat și font mare, și teste pe iOS Safari și Android Chrome consemnate în `docs/compat.md`.

Nimic din asta nu este implementat încă: fiecare punct este o sarcină gata pregătită în `ISSUES_GOOD_FIRST.md`.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/widgets/example.json` în `data/widgets/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
