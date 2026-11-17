# Közreműködés — Proiector fără frontiere

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

1. Forkold ezt a tárolót.
2. Másold a `data/widgets/example.json` fájlt `data/widgets/<id>.json` néven, és szerkeszd (a séma a `schema.json` fájlban van), majd futtasd: `python scripts/validate.py`.
3. Írd meg a `widgets/<id>/index.js` fájlt (lásd `docs/widget-api.md`): `export function mount(container, api)` és `strings` mind a nyolc nyelven.
4. Teszteld a tiszta függvényeket a `test/widgets.test.mjs` fájlban, majd futtasd: `npm test` és `node scripts/build.mjs`.
5. Nyiss egy pull requestet az újragenerált `index.html` fájllal.

## Szabályok

- Egy tevékenység = egy leíró (`data/widgets/<id>.json`) + egy widget (`widgets/<id>/index.js`) + tesztek.
- Mindig add meg a forrást.
- Csak olyan anyagot küldj, amelyet jogszerűen megoszthatsz (nincs másolt, védett szöveg).
- Légy kedves: lásd az Etikai kódexet.

## Tevékenység hozzáadása

1. Add hozzá a `data/widgets/<id>.json` fájlt (a `data/widgets/example.json` alapján; a séma a `schema.json` fájlban van), és futtasd: `python scripts/validate.py`. Az `id`-nek, a fájlnévnek, a `widgets/` alatti mappának és az `entry`-nek egyeznie kell. A lehető legkevesebb `permissions` értéket sorold fel: `none`, `drawing`, `storage` vagy `download`; a `camera` és a `microphone` fenntartott, és elutasítják (lásd `docs/sandbox.md`).
2. Írd meg a `widgets/<id>/index.js` fájlt ES-modulként (ES2017 szintaxis, importok nélkül) `export function mount(container, api)` függvénnyel és `export const strings` objektummal mind a nyolc nyelven (lásd `docs/widget-api.md`). Se hálózat, se böngészőtároló, se `parent`, se `eval`, se szövegből épített HTML: az `npm test` elutasítja őket, az építő pedig a `<!--`, `<script` és `</script` szövegrészeket a forrásban.
3. Minden telefonról érkező üzenetet bizalmatlanul kezelj: a kivetítőn ellenőrizd a típusokat, tartományokat és hosszakat, a helyes válaszokat és pontszámokat ott tartsd, és a telefonoknak csak azt küldd, amire szükségük van. Ha a `src/engine.mjs` fájlban egy üzenet alakját vagy egy korlátot változtatsz, emeld a `PROTO` értékét és frissítsd a `docs/protocol.md` fájlt (egy teszt összeveti a táblázatát a kóddal).
4. Formázd a widgetet a `widgets/<id>/style.css` fájlban saját osztályelőtaggal és a téma változóival. Legyenek az érintési célpontok legalább 44 képpontosak, a fókusz látható, minden vezérlőnek legyen címkéje, és a képernyőn változó tartalmat jelentsd be (`api.announce`); ellenőrizd a nagy kontrasztot és a nagy szöveget.
5. Írj teszteket a `test/widgets.test.mjs` fájlba az exportált tiszta függvényekhez, csak kitalált adatokkal, és futtasd: `npm test`.
6. Futtasd: `node scripts/build.mjs`, majd commitold az újragenerált `index.html`, `sw.js` és `app.json` fájlokat a `src/` és a `widgets/` mappával együtt.
