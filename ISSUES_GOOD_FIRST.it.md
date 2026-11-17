# Buoni primi compiti

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · **Italiano** · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Provare l’intero percorso su un vero iPhone (Safari) e un vero telefono Android (Chrome) con la lista di controllo di `docs/compat.md` e aggiungere le proprie righe alla sua tabella
- [ ] Provare l’abbinamento su una rete domestica, su un Wi-Fi scolastico o ospiti che isola i dispositivi e su un hotspot mobile; annotare in `docs/compat.md` cosa funziona e i messaggi di errore esatti
- [ ] Procurarsi un vero file di quiz Undava (o la sua specifica pubblicata) e far sì che l’importatore dei quiz lo legga, con un test e una nota in `docs/quiz-format.md`
- [ ] Aggiungere un widget «alzare la mano»: i telefoni si mettono in coda, il proiettore mostra l’ordine e lascia che l’insegnante chiami il prossimo (permesso `none`)
- [ ] Aggiungere un widget biglietto di uscita: ogni telefono sceglie una faccina o un numero da 1 a 5 e può aggiungere un breve commento; il proiettore mostra i totali e i commenti, con esportazione CSV
- [ ] Aggiungere un widget per formare gruppi: il proiettore divide i telefoni connessi in gruppi di una dimensione scelta, con un pulsante per rimescolare, e ogni telefono vede il proprio gruppo
- [ ] Quiz: aggiungere un secondo CSV con la risposta di ogni telefono a ogni domanda, così l’insegnante vede chi ha sbagliato cosa
- [ ] Verificare la pagina con un lettore di schermo (NVDA o VoiceOver) e con la sola tastiera, correggere ciò che non viene annunciato o non è raggiungibile e annotare il risultato in `docs/compat.md`
- [ ] Rivedere le traduzioni automatiche dell’interfaccia e dei widget (fr, de, es, it, pt, hu) e correggere ciò che un madrelingua non direbbe
- [ ] Estendere il test nel browser dell’hub (`tests/proiector.test.mjs`) a dieci o più telefoni simulati che disegnano contemporaneamente e riferire quanto resta reattivo il proiettore

Crea tutte le issue su GitHub con `scripts/create_issues.sh` (richiede la CLI `gh`).
