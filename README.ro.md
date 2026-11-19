# Proiector fără frontiere

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-20

🌐 https://proiector-fara-frontiere.chiuta.ro

> Transformă telefoanele din clasă într-un ecran comun prin WebRTC local — fără server, cu widgeturi-plugin.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa, utilizabil: pagina proiectorului și cinci activități (cronometru, sondaj, quiz, notițe lipicioase, tablă) funcționează în singurul fișier `index.html`: îl deschizi pe dispozitivul profesorului, adaugi telefoane cu un cod QR sau text, fără server și fără cont. Activitățile rulează în cadre izolate. Ce nu a fost testat (telefoane reale, alte browsere decât Chromium, Wi-Fi real) este enumerat mai jos și în `docs/compat.md`.

## Ce face

- Două roluri într-o singură pagină: la proiector (arată ecranul comun și conduce activitățile) și ca telefon (se alătură și participă). O sesiune ține până la 30 de telefoane.
- Asociere fără server: fiecare telefon se asociază cu proiectorul schimbând un cod, sub formă de cadre QR, fotografie a codului sau text lipit; fără cont, fără server de semnalizare, fără urmărire. Implicit nu iese nimic din rețeaua locală.
- Cinci activități: un cronometru cu numărătoare inversă; un sondaj cu bare în direct și un CSV cu rezultatul; un quiz (fișiere de întrebări JSON, text simplu sau CSV, bonus de viteză, clasament, un CSV cu scorurile, până la cinci seturi salvate pe dispozitiv) la care răspunsul corect rămâne pe proiector până este dezvăluit; notițe lipicioase de la toate telefoanele, cu export text; o tablă cu o culoare pe telefon și export PNG.
- Controale pentru profesor: blochezi sau deblochezi un telefon sau pe toate, elimini un telefon, ecran complet, păstrezi ecranul aprins, închei sesiunea. Un telefon care iese și revine își primește înapoi numele și culoarea.
- Fiecare dispozitiv are propria limbă (opt) și propriul aspect: luminos sau întunecat, contrast ridicat, text mare.
- Un API pentru widgeturi și un model de permisiuni documentat (`docs/widget-api.md`, `docs/sandbox.md`): o activitate nouă înseamnă un descriptor în `data/widgets/` plus un script în `widgets/`.
- Suport pentru tastatură și cititoare de ecran, ținte tactile mari, aspect pentru ecrane înguste de telefon; fără urmărire, fără conturi, funcționează offline.
- Se poate instala ca aplicație și funcționează offline după prima vizită, când e servită prin HTTPS (un service worker păstrează pagina; nu se stochează și nu se trimite nimic altceva). Deschisă dintr-un fișier descărcat, merge la fel, fără instalare.

## Cum funcționează

- `node scripts/build.mjs` asamblează singurul `index.html` din `src/` (`engine.mjs` pentru logica pură, `ui.js` pentru interfață, `sandbox.js` pentru codul care rulează într-un cadru, `i18n.mjs`, `app.css`, `sandbox.css`) și din `widgets/`; `--check` verifică dacă pagina corespunde sursei, inclusiv hash-ul fiecărui widget.
- Proiectorul este autoritatea: telefonul trimite cereri, iar proiectorul verifică versiunea protocolului, numele, identificatorii de widget, mărimea mesajelor, ritmul și permisiunile înainte să folosească ceva (`docs/protocol.md`). Voturile, răspunsurile și scorurile rămân pe proiector.
- Fiecare activitate rulează într-un `<iframe sandbox="allow-scripts" srcdoc>`: fără origine, cu politica `default-src 'none'`, un canal privat de mesaje și numai permisiunile din descriptor; pagina însăși nu permite nicio cerere de rețea (`docs/sandbox.md`).
- Telefoanele și proiectorul comunică prin canale de date WebRTC asociate manual (cadre QR sau text lipit); nimic nu trece printr-un server și, dacă nu introduci un server STUN, nicio cerere nu iese din rețeaua locală.
- `npm test` verifică motorul, limitele protocolului, importatorul de quiz, widgeturile, traducerile interfeței și ale widgeturilor, fișierele PWA și documentația; testul din browser al hubului (`tests/proiector.test.mjs`) deschide pagina în browsere Chromium reale, cu conexiuni WebRTC reale, un widget ostil și telefoane ostile. Dezvoltarea cere Node.js 24 sau mai nou; pagina însăși cere un browser cu ES2017 și canale de date WebRTC.
- `manifest.webmanifest`, `sw.js` și pictogramele sunt produse de `node scripts/build.mjs` prin kitul comun (secțiunea `pwa` din `src/app.json`); `--check` le verifică și el, iar `npm test` verifică dacă manifestul, versiunea service worker-ului și CSP-ul corespund paginii.

## Limite

- Alfa: nicio încercare pe un telefon sau o tabletă reală și în niciun alt browser decât Chromium; totul a fost testat în Chromium, cu conexiuni WebRTC reale pe o singură mașină (`docs/compat.md`).
- Implicit, asocierea merge doar în aceeași rețea locală. Un server STUN introdus de tine ar putea-o permite între rețele (neîncercat aici), dar nu există releu (fără TURN), așa că Wi-Fi-ul pentru oaspeți care izolează dispozitivele, VPN-urile și multe rețele școlare, corporative și mobile o pot totuși bloca. Fiecare telefon cere propriul schimb de coduri, deci adăugarea unei clase întregi durează câteva minute.
- Asocierea arată adresa IP a fiecărui dispozitiv celuilalt (dialogul întreabă mai întâi). Canalul este criptat, dar identitatea celuilalt dispozitiv nu este verificată: asociază doar în propria sală.
- Sandbox-ul nu împiedică o activitate ostilă să-și blocheze propriul cadru (în unele browsere, toată fila), iar o activitate își poate folosi canalul privat până la limitele sale. Adaugă doar activități a căror sursă ai citit-o (`docs/sandbox.md`).
- Quiz-ul citește fișiere JSON, text simplu și CSV. Formatul „Undava” cerut în planul inițial nu a fost găsit documentat nicăieri și nu a fost testat cu fișiere Undava reale (`docs/quiz-format.md`).
- Între sesiuni, un dispozitiv păstrează doar propriile setări (nume, contrast ridicat, text mare) și seturile de quiz pe care alegi să le salvezi; rezultatele, bilețelele și desenele nu se păstrează dacă nu le descarci. Un proiector care reîncarcă pagina încheie sesiunea, iar telefoanele trebuie asociate din nou.
- O sesiune ține până la 30 de telefoane, limită impusă de motor; testele din browser au folosit cel mult trei conexiuni reale.
- Interfața și activitățile există în opt limbi; cele în franceză, italiană, spaniolă, portugheză, germană și maghiară au fost traduse automat și nu au fost verificate de vorbitori nativi.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/widgets/example.json` în `data/widgets/<id>.json` și editează-l (schema este în `schema.json`), apoi rulează `python scripts/validate.py`.
3. Scrie `widgets/<id>/index.js` (vezi `docs/widget-api.md`): `export function mount(container, api)` și `strings` în toate cele opt limbi.
4. Testează funcțiile pure în `test/widgets.test.mjs`, apoi rulează `npm test` și `node scripts/build.mjs`.
5. Deschide un pull request cu `index.html` regenerat.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
