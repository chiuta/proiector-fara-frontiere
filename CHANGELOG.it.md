# Registro delle modifiche

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · **Italiano** · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non rilasciato]

## [0.2.1] - 2026-11-20

### Modificato
- fff-kit 1.8.1: quando il browser blocca l’archiviazione o ne è privo (`localStorage`/`sessionStorage` generano un errore o mancano), la pagina si avvia con un’archiviazione temporanea in memoria invece di fermarsi; i dati non vengono conservati dopo la chiusura della pagina.
- fff-kit 1.8.1: la guida che ingrandisce i controlli piccoli a 44 px misura ora anche la larghezza del corpo della pagina e dell’elemento genitore, quindi una riga di pulsanti non può più uscire dallo schermo (il gruppo resta intatto quando l’ingrandimento lo renderebbe troppo largo).

## [0.2.0] - 2026-11-17

### Aggiunto
- La pagina del proiettore e del telefono: un solo `index.html`, costruito da `src/` e `widgets/` con `node scripts/build.mjs` (`--check` lo verifica), con lo schermo condiviso, i comandi e la vista del telefono nello stesso file.
- Abbinamento senza server tramite scambio di codici (fotogrammi QR, foto del codice o testo incollato), fino a 30 telefoni per sessione; comandi dell’insegnante per bloccare o sbloccare, rimuovere un telefono, passare a schermo intero, tenere acceso lo schermo e terminare la sessione.
- Cinque attività: timer, sondaggio, quiz, foglietti adesivi e lavagna, con esportazioni CSV, testo e PNG dove si applicano.
- L’API dei widget e l’isolamento di ogni attività in un frame in sandbox, con i permessi `none`, `drawing`, `storage` e `download` (`camera` e `microphone` sono riservati e rifiutati): `docs/widget-api.md` e `docs/sandbox.md`.
- Il protocollo proiettore–telefono con i suoi limiti (telefoni, nomi, dimensione dei messaggi, frequenza, dati salvati), una sessione che si risincronizza quando torna una connessione debole ed esportazioni CSV che neutralizzano le celle che iniziano con un carattere di formula: `docs/protocol.md`.
- File di quiz in JSON, testo semplice o CSV, letti da un importatore tollerante e documentati in inglese e rumeno in `docs/quiz-format.md`; il formato «Undava» non è dichiarato supportato, perché non è stata trovata alcuna specifica.
- Otto lingue per l’interfaccia e le attività, una lingua e un aspetto (chiaro, scuro, alto contrasto, testo grande) scelti su ogni dispositivo, e supporto per tastiera e lettori di schermo.
- Test: `npm test` (motore, limiti del protocollo, importatore dei quiz, widget, traduzioni, file PWA, build e documentazione), un test nel browser nell’hub con vere connessioni WebRTC, un widget ostile e telefoni ostili, e `docs/compat.md` con una lista di controllo per dispositivi reali.
- README, CHANGELOG, CONTRIBUTING e ISSUES_GOOD_FIRST riscritti per questa versione in otto lingue, con dieci attività per iniziare.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT tradotti in tutte e otto le lingue.
- README in inglese, rumeno, francese, italiano, spagnolo, portoghese, tedesco e ungherese: sezioni di stato e di ambito previsto (derivate da `ISSUES_GOOD_FIRST.md`).
- Installabile (PWA): `manifest.webmanifest`, `sw.js` e le icone sono generati dal kit comune (`fff-kit/pwa`); la pagina funziona offline dopo la prima visita via HTTPS.

### Modificato
- `data/widgets/example.json` è ora un descrittore modello (`my-widget`, con traduzioni in otto lingue); il descrittore del timer è stato spostato in `data/widgets/timer.json`, accanto a `poll`, `quiz`, `notes` e `whiteboard`.
- `widgets/timer/index.js` è ora il vero timer e non più l’esempio dimostrativo.
- `schema.json`: `description` e `i18n` sono obbligatori (l’inglese è obbligatorio, le altre sette lingue sono segnalate dal validatore), `id` e `entry` devono avere una forma fissa, e `permissions` accetta da uno a tre valori tra `none`, `drawing`, `storage` e `download`; `camera` e `microphone` non sono più accettati.
- `scripts/validate.py` controlla anche che `id` sia uguale al nome del file, che `entry` esista ed esporti `mount`, che i permessi riservati siano rifiutati con un messaggio chiaro e che le traduzioni siano complete (un avviso, o un errore con `--strict`).
- Il workflow gira su Ubuntu 26.04 con Node.js 26 e esegue anche i test e la verifica della build.

## [0.1.0] - 2026-11-13

### Aggiunto
- Scheletro iniziale: struttura, schema dei dati o primi esempi, guide al contributo in otto lingue.
