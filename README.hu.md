# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.1.0 · Utolsó frissítés: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Az osztálytermi telefonokból közös képernyő helyi WebRTC-vel – szerver nélkül, plugin-widgetekkel.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa: a tároló a szerkezetet, az adatsémát vagy az első példákat és a közreműködési útmutatókat tartalmazza. Az alábbi terjedelem a terv, nem a ma működő állapot.

## Tervezett terjedelem

- Szervermentes párosítás: QR-kód és WebRTC ajánlat/válasz csere, így a telefonok szerver nélkül csatlakoznak.
- Widget-API (csatolás/leválasztás, küldés/fogadás, életciklus) és widget-homokozó (iframe + postMessage) dokumentált jogosultsági modellel.
- Widgetek: szavazás élő oszlopdiagrammal, Undava kvízfájlokkal kompatibilis kvíz, jegyzetpapírok és telefononként más színű tábla.
- Tanári vezérlő a telefonok zárolásához és feloldásához.
- Nagy kontrasztú, nagy betűs akadálymentes téma, valamint iOS Safari és Android Chrome tesztek a `docs/compat.md` fájlban.

Ezek közül még semmi sincs megvalósítva: minden pont kész feladat az `ISSUES_GOOD_FIRST.md` fájlban.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/widgets/example.json` fájlt a `data/widgets/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
