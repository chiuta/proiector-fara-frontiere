# Jurnal de modificări

[English](CHANGELOG.md) · **Română** · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Nelansat]

## [0.2.1] - 2026-11-20

### Modificat
- fff-kit 1.8.1: când browserul blochează sau nu are stocare (`localStorage`/`sessionStorage` aruncă sau lipsesc), pagina pornește cu o stocare temporară în memorie, în loc să se oprească; datele nu se păstrează după închiderea paginii.
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși).

## [0.2.0] - 2026-11-17

### Adăugat
- Pagina de proiector și de telefon: un singur `index.html`, construit din `src/` și `widgets/` cu `node scripts/build.mjs` (`--check` îl verifică), cu ecranul comun, comenzile și vederea telefonului în același fișier.
- Asociere fără server prin schimb de coduri (cadre QR, fotografia codului sau text lipit), până la 30 de telefoane pe sesiune; comenzi pentru profesor: blocare sau deblocare, scoaterea unui telefon, ecran complet, ecran mereu aprins și încheierea sesiunii.
- Cinci activități: cronometru cu numărătoare inversă, sondaj, quiz, bilețele și tablă, cu exporturi CSV, text și PNG acolo unde se aplică.
- API-ul pentru widgeturi și izolarea fiecărei activități într-un cadru în sandbox, cu permisiunile `none`, `drawing`, `storage` și `download` (`camera` și `microphone` sunt rezervate și refuzate): `docs/widget-api.md` și `docs/sandbox.md`.
- Protocolul proiector–telefon cu limitele sale (telefoane, nume, mărimea mesajelor, ritm, date stocate), o sesiune care se resincronizează când revine o conexiune slabă și exporturi CSV care neutralizează celulele ce încep cu un caracter de formulă: `docs/protocol.md`.
- Fișiere de quiz în JSON, text simplu sau CSV, citite de un importator tolerant și documentate în engleză și română în `docs/quiz-format.md`; formatul „Undava” nu este susținut, pentru că nu s-a găsit nicio specificație.
- Opt limbi pentru interfață și activități, limbă și aspect (deschis, întunecat, contrast ridicat, text mare) alese pe fiecare dispozitiv, plus suport pentru tastatură și cititoare de ecran.
- Teste: `npm test` (motor, limitele protocolului, importatorul de quiz, widgeturi, traduceri, fișiere PWA, construirea și documentația), un test în browser în hub cu conexiuni WebRTC reale, un widget ostil și telefoane ostile, și `docs/compat.md` cu o listă de verificare pentru dispozitive reale.
- README, CHANGELOG, CONTRIBUTING și ISSUES_GOOD_FIRST rescrise pentru această versiune în opt limbi, cu zece sarcini bune pentru început.
- ISSUES_GOOD_FIRST și CODE_OF_CONDUCT traduse în toate cele opt limbi.
- README în engleză, română, franceză, italiană, spaniolă, portugheză, germană și maghiară: secțiuni de stare și de domeniu planificat (derivate din `ISSUES_GOOD_FIRST.md`).
- Instalabilă (PWA): `manifest.webmanifest`, `sw.js` și pictogramele sunt generate de kitul comun (`fff-kit/pwa`); pagina funcționează offline după prima vizită prin HTTPS.

### Modificat
- `data/widgets/example.json` este acum un descriptor-șablon (`my-widget`, cu traduceri în opt limbi); descriptorul cronometrului s-a mutat în `data/widgets/timer.json`, lângă `poll`, `quiz`, `notes` și `whiteboard`.
- `widgets/timer/index.js` este acum cronometrul real, nu mai este exemplul demonstrativ.
- `schema.json`: `description` și `i18n` sunt obligatorii (engleza este obligatorie, celelalte șapte limbi sunt raportate de validator), `id` și `entry` trebuie să aibă o formă fixă, iar `permissions` acceptă de la una la trei dintre `none`, `drawing`, `storage` și `download`; `camera` și `microphone` nu mai sunt acceptate.
- `scripts/validate.py` verifică și că `id` este egal cu numele fișierului, că `entry` există și exportă `mount`, că permisiunile rezervate sunt refuzate cu un mesaj clar și că traducerile sunt complete (avertisment, sau eroare cu `--strict`).
- Workflow-ul rulează pe Ubuntu 26.04 cu Node.js 26 și rulează și testele, și verificarea construirii.

## [0.1.0] - 2026-11-13

### Adăugat
- Schelet inițial: structură, schema de date sau primele exemple, ghiduri de contribuție în opt limbi.
