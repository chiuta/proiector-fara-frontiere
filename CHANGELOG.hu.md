# Változásnapló

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · **Magyar**

Formátum: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Kiadatlan]

## [0.2.1] - 2026-11-20

### Módosítva
- fff-kit 1.8.1: ha a böngésző blokkolja a tárolást vagy nincs tárolója (a `localStorage`/`sessionStorage` hibát dob vagy hiányzik), az oldal ideiglenes, memóriabeli tárolóval indul ahelyett, hogy leállna; az adatok az oldal bezárása után nem maradnak meg.
- fff-kit 1.8.1: a kis vezérlőket 44 px-re növelő segéd mostantól az oldal törzsének és a szülőelemnek a szélességét is méri, így a gombsor már nem lóghat ki a képernyőről (a csoport érintetlen marad, ha a növelés túl szélessé tenné).

## [0.2.0] - 2026-11-17

### Hozzáadva
- A kivetítő- és telefonoldal: egyetlen `index.html`, amelyet a `node scripts/build.mjs` épít a `src/` és a `widgets/` mappából (a `--check` ellenőrzi), a közös képernyővel, a vezérlőkkel és a telefonnézettel ugyanabban a fájlban.
- Kiszolgáló nélküli párosítás kódcserével (QR-képkockák, a kód fényképe vagy beillesztett szöveg), munkamenetenként legfeljebb 30 telefon; a tanár vezérlői: zárolás vagy feloldás, telefon eltávolítása, teljes képernyő, a képernyő ébren tartása és a munkamenet befejezése.
- Öt tevékenység: visszaszámláló, szavazás, kvíz, cetlik és tábla, ahol értelmezhető, CSV-, szöveg- és PNG-exporttal.
- A widget-API és minden tevékenység elkülönítése egy homokozóban futó keretben, a `none`, `drawing`, `storage` és `download` jogosultságokkal (a `camera` és a `microphone` fenntartott, és elutasítják): `docs/widget-api.md` és `docs/sandbox.md`.
- A kivetítő és a telefon közötti protokoll a korlátaival (telefonok, nevek, üzenetméret, ütem, tárolt adatok), egy munkamenet, amely újraszinkronizál, ha egy gyenge kapcsolat visszatér, és CSV-exportok, amelyek hatástalanítják a képletkarakterrel kezdődő cellákat: `docs/protocol.md`.
- Kvízfájlok JSON, egyszerű szöveg vagy CSV formában, amelyeket egy toleráns importáló olvas, angolul és románul dokumentálva a `docs/quiz-format.md` fájlban; az „Undava” formátumot nem állítjuk, mert nem találtunk specifikációt.
- Nyolc nyelv a felülethez és a tevékenységekhez, minden eszközön külön választható nyelv és megjelenés (világos, sötét, nagy kontraszt, nagy szöveg), valamint billentyűzet- és képernyőolvasó-támogatás.
- Tesztek: `npm test` (motor, protokollkorlátok, kvízimportáló, widgetek, fordítások, PWA-fájlok, build és dokumentáció), egy böngészős teszt a hubban valódi WebRTC-kapcsolatokkal, egy ellenséges widgettel és ellenséges telefonokkal, valamint a `docs/compat.md` ellenőrzőlistával valódi eszközökhöz.
- A README, a CHANGELOG, a CONTRIBUTING és az ISSUES_GOOD_FIRST újraírva ehhez a verzióhoz nyolc nyelven, tíz kezdő feladattal.
- Az ISSUES_GOOD_FIRST és a CODE_OF_CONDUCT lefordítva mind a nyolc nyelvre.
- README angolul, románul, franciául, olaszul, spanyolul, portugálul, németül és magyarul: állapot- és tervezett terjedelem-szakaszok (az `ISSUES_GOOD_FIRST.md` alapján).
- Telepíthető (PWA): a `manifest.webmanifest`, az `sw.js` és az ikonok a közös kitből (`fff-kit/pwa`) készülnek; az oldal az első HTTPS-látogatás után offline is működik.

### Módosítva
- A `data/widgets/example.json` mostantól sablonleíró (`my-widget`, nyolc nyelvű fordítással); a visszaszámláló leírója a `data/widgets/timer.json` fájlba költözött, a `poll`, `quiz`, `notes` és `whiteboard` mellé.
- A `widgets/timer/index.js` mostantól a valódi visszaszámláló, nem a bemutató minta.
- A `schema.json`: a `description` és az `i18n` kötelező (az angol kötelező, a másik hét nyelvet az ellenőrző jelzi), az `id` és az `entry` rögzített alakú legyen, a `permissions` pedig egytől háromig fogad el értéket a `none`, `drawing`, `storage` és `download` közül; a `camera` és a `microphone` már nem elfogadott.
- A `scripts/validate.py` azt is ellenőrzi, hogy az `id` egyezik a fájlnévvel, hogy az `entry` létezik és exportálja a `mount` függvényt, hogy a fenntartott jogosultságokat egyértelmű üzenettel elutasítja, és hogy a fordítások teljesek (figyelmeztetés, `--strict` esetén hiba).
- A munkafolyamat Ubuntu 26.04 és Node.js 26 alatt fut, és a teszteket meg a build-ellenőrzést is futtatja.

## [0.1.0] - 2026-11-13

### Hozzáadva
- Kezdeti váz: szerkezet, adatséma vagy első példák, hozzájárulási útmutatók nyolc nyelven.
