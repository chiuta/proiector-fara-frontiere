# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

🌐 https://proiector-fara-frontiere.chiuta.ro

> Az osztálytermi telefonokból közös képernyő helyi WebRTC-vel – szerver nélkül, plugin-widgetekkel.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa, használható: a kivetítő oldala és öt tevékenység (időzítő, szavazás, kvíz, jegyzetpapírok, tábla) működik az egyetlen `index.html` fájlban: nyisd meg a tanár eszközén, adj hozzá telefonokat QR- vagy szöveges kóddal, szerver és fiók nélkül. A tevékenységek elkülönített keretekben futnak. Amit nem teszteltünk (valódi telefonok, a Chromiumtól eltérő böngészők, valódi Wi-Fi), az lent és a `docs/compat.md` fájlban olvasható.

## Mit tud

- Két szerep egyetlen oldalon: a kivetítőnél (megjeleníti a közös képernyőt és vezérli a tevékenységeket) és telefonként (csatlakozik és részt vesz). Egy munkamenet legfeljebb 30 telefont fogad.
- Szervermentes párosítás: minden telefon kód cseréjével párosodik a kivetítővel, QR-képkockákkal, a kód fényképével vagy beillesztett szöveggel; fiók, jelzőszerver és követés nélkül. Alapértelmezés szerint semmi nem hagyja el a helyi hálózatot.
- Öt tevékenység: visszaszámláló időzítő; szavazás élő oszlopokkal és az eredmény CSV-jével; kvíz (JSON, egyszerű szöveg vagy CSV kérdésfájlok, gyorsasági bónusz, ranglista, a pontok CSV-je, legfeljebb öt, az eszközön mentett készlet), amelyben a helyes válasz a felfedésig a kivetítőn marad; jegyzetpapírok minden telefonról szöveges exporttal; tábla telefononként más színnel és PNG-exporttal.
- Tanári vezérlők: egy telefon vagy az összes zárolása és feloldása, telefon eltávolítása, teljes képernyő, a képernyő bekapcsolva tartása, a munkamenet befejezése. A kieső, majd visszatérő telefon visszakapja nevét és színét.
- Minden eszköznek saját nyelve (nyolc) és saját megjelenése van: világos vagy sötét, nagy kontraszt, nagy szöveg.
- Widget-API és dokumentált jogosultsági modell (`docs/widget-api.md`, `docs/sandbox.md`): egy új tevékenység egy leíró a `data/widgets/` mappában plusz egy szkript a `widgets/` mappában.
- Billentyűzet- és képernyőolvasó-támogatás, nagy érintési célpontok, keskeny telefonképernyőre szabott elrendezés; követés és fiókok nélkül, offline is működik.
- Alkalmazásként telepíthető, és az első látogatás után offline is elérhető, ha HTTPS-en keresztül szolgálják ki (egy service worker megőrzi az oldalt; semmi mást nem tárol és nem küld). Letöltött fájlból megnyitva ugyanígy működik, telepítés nélkül.

## Hogyan működik

- A `node scripts/build.mjs` az egyetlen `index.html` fájlt a `src/` mappából (`engine.mjs` a tiszta logikához, `ui.js` a felülethez, `sandbox.js` a keretben futó kódhoz, `i18n.mjs`, `app.css`, `sandbox.css`) és a `widgets/` mappából állítja össze; a `--check` ellenőrzi, hogy az oldal megegyezik a forrásokkal, minden widget hash-ét is beleértve.
- A kivetítő dönt: a telefon kéréseket küld, a kivetítő pedig ellenőrzi a protokollverziót, a neveket, a widget-azonosítókat, az üzenetek méretét, a küldési ütemet és a jogosultságokat, mielőtt bármit felhasználna (`docs/protocol.md`). A szavazatok, válaszok és pontszámok a kivetítőn maradnak.
- Minden tevékenység `<iframe sandbox="allow-scripts" srcdoc>` keretben fut: eredet nélkül, `default-src 'none'` szabállyal, egy privát üzenetcsatornával és csak a leírójában felsorolt jogosultságokkal; maga az oldal egyetlen hálózati kérést sem enged (`docs/sandbox.md`).
- A telefonok és a kivetítő kézzel párosított WebRTC-adatcsatornákon beszélnek (QR-képkockák vagy beillesztett szöveg); semmi nem megy át szerveren, és ha nem adsz meg STUN-szervert, egyetlen kérés sem hagyja el a helyi hálózatot.
- Az `npm test` ellenőrzi a motort, a protokoll korlátait, a kvízimportálót, a widgeteket, a felület és a widgetek fordításait, a PWA-fájlokat és a dokumentációt; a hub böngészős tesztje (`tests/proiector.test.mjs`) valódi Chromium böngészőkben nyitja meg az oldalt, valódi WebRTC-kapcsolatokkal, egy ellenséges widgettel és ellenséges telefonokkal. A fejlesztéshez Node.js 24 vagy újabb kell; maga az oldal ES2017-et és WebRTC-adatcsatornákat tudó böngészőt igényel.
- A `manifest.webmanifest`, az `sw.js` és az ikonok a `node scripts/build.mjs` futtatásakor készülnek a közös kit révén (az `src/app.json` `pwa` szakasza); a `--check` is ellenőrzi őket, az `npm test` pedig azt, hogy a manifeszt, a service worker verziója és a CSP megegyezik az oldalval.

## Korlátok

- Alfa: egyetlen valódi telefonon vagy táblagépen, és a Chromiumon kívül egyetlen böngészőben sem futott; mindent Chromiumban teszteltünk, valódi WebRTC-kapcsolatokkal egyetlen gépen (`docs/compat.md`).
- Alapértelmezés szerint a párosítás csak ugyanazon a helyi hálózaton működik. Egy általad megadott STUN-szerver talán lehetővé teszi hálózatok között is (ezt itt nem próbáltuk ki), de nincs továbbító (TURN), ezért a vendég Wi-Fi, amely elszigeteli az eszközöket, a VPN, valamint sok iskolai, vállalati és mobilhálózat így is blokkolhatja. Minden telefonhoz külön kódcsere kell, ezért egy egész osztály hozzáadása néhány percig tart.
- A párosítás megmutatja minden eszköz IP-címét a másiknak (a párbeszédablak előbb rákérdez). A csatorna titkosított, de a másik eszköz kilétét nem ellenőrzi senki: csak a saját termedben párosíts.
- A homokozó nem akadályozza meg, hogy egy ellenséges tevékenység lefagyassza a saját keretét (egyes böngészőkben az egész lapot), és egy tevékenység a korlátaiig használhatja a privát csatornáját. Csak olyan tevékenységet adj hozzá, amelynek a forrását elolvastad (`docs/sandbox.md`).
- A kvíz JSON, egyszerű szöveg és CSV fájlokat olvas. Az első tervben kért „Undava” formátumot sehol nem találtuk dokumentálva, és valódi Undava fájlokkal nem teszteltük (`docs/quiz-format.md`).
- Munkamenetek között egy eszköz csak a saját beállításait (név, nagy kontraszt, nagy szöveg) és az általad elmentett kvízkészleteket őrzi meg; az eredmények, a cetlik és a rajzok nem maradnak meg, ha nem töltöd le őket. Az oldalt újratöltő kivetítő befejezi a munkamenetet, és a telefonokat újra párosítani kell.
- Egy munkamenet legfeljebb 30 telefont fogad, ezt a motor kényszeríti ki; a böngészős tesztek legfeljebb három valódi kapcsolatot használtak.
- A felület és a tevékenységek nyolc nyelven érhetők el; a francia, olasz, spanyol, portugál, német és magyar szöveget géppel fordítottuk, anyanyelvi beszélők nem nézték át.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/widgets/example.json` fájlt `data/widgets/<id>.json` néven, és szerkeszd (a séma a `schema.json` fájlban van), majd futtasd: `python scripts/validate.py`.
3. Írd meg a `widgets/<id>/index.js` fájlt (lásd `docs/widget-api.md`): `export function mount(container, api)` és `strings` mind a nyolc nyelven.
4. Teszteld a tiszta függvényeket a `test/widgets.test.mjs` fájlban, majd futtasd: `npm test` és `node scripts/build.mjs`.
5. Nyiss egy pull requestet az újragenerált `index.html` fájllal.

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
