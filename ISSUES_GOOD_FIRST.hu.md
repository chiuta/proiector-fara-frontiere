# Jó első feladatok

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · **Magyar**

- [ ] A teljes folyamat kipróbálása valódi iPhone-on (Safari) és valódi Android-telefonon (Chrome) a `docs/compat.md` ellenőrzőlistájával, és a saját sorok hozzáadása a táblázatához
- [ ] A párosítás kipróbálása otthoni hálózaton, az eszközöket elszigetelő iskolai vagy vendég Wi-Fi-n és mobil hotspoton; a `docs/compat.md` fájlban rögzíteni, mi működik, és a pontos hibaüzeneteket
- [ ] Valódi Undava kvízfájl (vagy a közzétett specifikációja) beszerzése, és a kvízimportáló megtanítása annak olvasására, teszttel és megjegyzéssel a `docs/quiz-format.md` fájlban
- [ ] „Jelentkezés” widget hozzáadása: a telefonok sorba állnak, a kivetítő mutatja a sorrendet, és a tanár hívhatja a következőt (`none` jogosultság)
- [ ] Kilépőjegy widget hozzáadása: minden telefon választ egy arcot vagy egy számot 1-től 5-ig, és írhat rövid megjegyzést; a kivetítő mutatja az összegeket és a megjegyzéseket, CSV-exporttal
- [ ] Csoportalkotó widget hozzáadása: a kivetítő a csatlakozott telefonokat választott méretű csoportokba osztja, újrakeverő gombbal, és minden telefon látja a saját csoportját
- [ ] Kvíz: második CSV hozzáadása minden telefon minden kérdésre adott válaszával, hogy a tanár lássa, ki miben tévedett
- [ ] Az oldal ellenőrzése képernyőolvasóval (NVDA vagy VoiceOver) és csak billentyűzettel, a be nem jelentett vagy el nem érhető részek javítása, az eredmény rögzítése a `docs/compat.md` fájlban
- [ ] A felület és a widgetek gépi fordításainak (fr, de, es, it, pt, hu) átnézése, és javítása annak, amit egy anyanyelvi beszélő nem mondana
- [ ] A hub böngészős tesztjének (`tests/proiector.test.mjs`) kiterjesztése tíz vagy több szimulált telefonra, amelyek egyszerre rajzolnak, és jelentés arról, mennyire marad reszponzív a kivetítő

Hozd létre mindet GitHubon a `scripts/create_issues.sh` szkripttel (a `gh` CLI szükséges).
