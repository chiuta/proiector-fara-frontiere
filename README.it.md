# Proiector fără frontiere

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.1.0 · Ultimo aggiornamento: 2026-11-14

🌐 https://proiector-fara-frontiere.chiuta.ro

> Trasforma i telefoni in classe in uno schermo condiviso via WebRTC locale — senza server, con widget plugin.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha: il repository contiene la struttura, lo schema dati o i primi esempi e le guide al contributo. L’ambito qui sotto è il piano, non ciò che funziona oggi.

## Ambito previsto

- Abbinamento senza server: un codice QR e uno scambio WebRTC offerta/risposta, così i telefoni si uniscono senza alcun server.
- Un’API per widget (montaggio/smontaggio, invio/ascolto, ciclo di vita) e una sandbox per widget (iframe + postMessage) con un modello di permessi documentato.
- Widget: un sondaggio con grafico dal vivo, un quiz compatibile con i file di quiz Undava, note adesive e una lavagna con un colore per telefono.
- Un controllo per l’insegnante per bloccare e sbloccare i telefoni.
- Un tema di accessibilità ad alto contrasto e carattere grande, e test su iOS Safari e Android Chrome registrati in `docs/compat.md`.

Nulla di tutto ciò è ancora implementato: ogni voce è un compito pronto in `ISSUES_GOOD_FIRST.md`.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/widgets/example.json` in `data/widgets/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
