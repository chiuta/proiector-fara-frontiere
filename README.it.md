# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

🌐 https://proiector-fara-frontiere.chiuta.ro

> Trasforma i telefoni in classe in uno schermo condiviso via WebRTC locale — senza server, con widget plugin.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha, utilizzabile: la pagina del proiettore e cinque attività (timer, sondaggio, quiz, note adesive, lavagna) funzionano nell’unico file `index.html`: lo apri sul dispositivo dell’insegnante, aggiungi i telefoni con un codice QR o di testo, senza server e senza account. Le attività girano in frame isolati. Ciò che non è stato provato (telefoni reali, browser diversi da Chromium, Wi-Fi reale) è elencato più sotto e in `docs/compat.md`.

## Cosa fa

- Due ruoli in una sola pagina: al proiettore (mostra lo schermo condiviso e guida le attività) e come telefono (si unisce e partecipa). Una sessione ospita fino a 30 telefoni.
- Abbinamento senza server: ogni telefono si abbina al proiettore scambiando un codice, come fotogrammi QR, foto del codice o testo incollato; nessun account, nessun server di segnalazione, nessun tracciamento. Per impostazione predefinita nulla esce dalla rete locale.
- Cinque attività: un timer a conto alla rovescia; un sondaggio con barre dal vivo e un CSV del risultato; un quiz (file di domande JSON, testo semplice o CSV, bonus di velocità, classifica, un CSV dei punteggi, fino a cinque set salvati sul dispositivo) in cui la risposta giusta resta sul proiettore finché non viene rivelata; note adesive da tutti i telefoni con esportazione in testo; una lavagna con un colore per telefono ed esportazione PNG.
- Controlli per l’insegnante: bloccare o sbloccare un telefono o tutti, rimuovere un telefono, schermo intero, tenere lo schermo acceso, terminare la sessione. Un telefono che esce e rientra riprende nome e colore.
- Ogni dispositivo ha la propria lingua (otto) e il proprio aspetto: chiaro o scuro, alto contrasto, testo grande.
- Un’API per widget e un modello di permessi documentato (`docs/widget-api.md`, `docs/sandbox.md`): una nuova attività è un descrittore in `data/widgets/` più uno script in `widgets/`.
- Supporto per tastiera e lettori di schermo, bersagli touch grandi, layout per schermi stretti di telefono; nessun tracciamento, nessun account, funziona offline.
- Installabile come app e disponibile offline dopo la prima visita quando è servita via HTTPS (un service worker conserva la pagina; nient’altro viene memorizzato o inviato). Aperta da un file scaricato funziona allo stesso modo, senza installazione.

## Come funziona

- `node scripts/build.mjs` assembla l’unico `index.html` da `src/` (`engine.mjs` per la logica pura, `ui.js` per l’interfaccia, `sandbox.js` per il codice che gira in un frame, `i18n.mjs`, `app.css`, `sandbox.css`) e da `widgets/`; `--check` verifica che la pagina corrisponda ai sorgenti, compreso l’hash di ogni widget.
- Il proiettore è l’autorità: un telefono invia richieste e il proiettore controlla versione del protocollo, nomi, identificatori di widget, dimensione dei messaggi, frequenza e permessi prima di usare qualsiasi cosa (`docs/protocol.md`). Voti, risposte e punteggi restano sul proiettore.
- Ogni attività gira in `<iframe sandbox="allow-scripts" srcdoc>`: senza origine, con la policy `default-src 'none'`, un canale di messaggi privato e solo i permessi del suo descrittore; la pagina stessa non consente alcuna richiesta di rete (`docs/sandbox.md`).
- Telefoni e proiettore comunicano tramite canali di dati WebRTC abbinati a mano (fotogrammi QR o testo incollato); nulla passa da un server e, se non inserisci un server STUN, nessuna richiesta esce dalla rete locale.
- `npm test` controlla il motore, i limiti del protocollo, l’importatore dei quiz, i widget, le traduzioni dell’interfaccia e dei widget, i file PWA e la documentazione; il test nel browser dell’hub (`tests/proiector.test.mjs`) apre la pagina in veri browser Chromium, con vere connessioni WebRTC, un widget ostile e telefoni ostili. Lo sviluppo richiede Node.js 24 o più recente; la pagina stessa richiede un browser con ES2017 e canali di dati WebRTC.
- `manifest.webmanifest`, `sw.js` e le icone sono prodotti da `node scripts/build.mjs` tramite il kit comune (sezione `pwa` di `src/app.json`); anche `--check` li verifica, e `npm test` controlla che il manifest, la versione del service worker e la CSP corrispondano alla pagina.

## Limiti

- Alpha: nessun telefono o tablet reale, e nessun browser diverso da Chromium, l’ha mai eseguita; tutto è stato provato in Chromium, con vere connessioni WebRTC su una sola macchina (`docs/compat.md`).
- Per impostazione predefinita l’abbinamento funziona solo nella stessa rete locale. Un server STUN che inserisci potrebbe consentirlo tra reti diverse (non provato qui), ma non c’è un relay (niente TURN): il Wi-Fi ospiti che isola i dispositivi, le VPN e molte reti scolastiche, aziendali e mobili possono quindi ancora bloccarlo. Ogni telefono richiede il proprio scambio di codici, quindi aggiungere una classe intera richiede qualche minuto.
- L’abbinamento mostra l’indirizzo IP di ciascun dispositivo all’altro (la finestra lo chiede prima). Il canale è cifrato, ma l’identità dell’altro dispositivo non è verificata: abbina solo nella tua aula.
- La sandbox non impedisce a un’attività ostile di bloccare il proprio frame (in alcuni browser l’intera scheda), e un’attività può usare il suo canale privato fino ai propri limiti. Aggiungi solo attività di cui hai letto il codice sorgente (`docs/sandbox.md`).
- Il quiz legge file JSON, testo semplice e CSV. Il formato «Undava» richiesto nel primo piano non è stato trovato documentato da nessuna parte e non è stato provato con veri file Undava (`docs/quiz-format.md`).
- Tra una sessione e l’altra un dispositivo conserva solo le proprie impostazioni (nome, alto contrasto, testo grande) e i set di quiz che scegli di salvare; risultati, foglietti e disegni non vengono conservati se non li scarichi. Un proiettore che ricarica la pagina chiude la sessione e i telefoni devono essere abbinati di nuovo.
- Una sessione ospita fino a 30 telefoni, limite imposto dal motore; i test nel browser hanno usato al massimo tre connessioni reali.
- L’interfaccia e le attività esistono in otto lingue; quelle in francese, italiano, spagnolo, portoghese, tedesco e ungherese sono state tradotte automaticamente e non sono state riviste da madrelingua.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/widgets/example.json` in `data/widgets/<id>.json` e modificalo (schema in `schema.json`), poi esegui `python scripts/validate.py`.
3. Scrivi `widgets/<id>/index.js` (vedi `docs/widget-api.md`): `export function mount(container, api)` e `strings` in tutte e otto le lingue.
4. Testa le funzioni pure in `test/widgets.test.mjs`, poi esegui `npm test` e `node scripts/build.mjs`.
5. Apri una pull request con l’`index.html` rigenerato.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
