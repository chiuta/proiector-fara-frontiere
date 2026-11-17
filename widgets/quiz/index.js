/* Quiz în direct. Gazda încarcă întrebările (JSON, text simplu sau CSV — vezi docs/quiz-format.md) și conduce ritmul; telefoanele primesc DOAR întrebarea și variantele.
   Răspunsul corect rămâne la gazdă până la «Arată răspunsul»; punctajul îl calculează gazda. Permisiuni: «storage» (biblioteca de quiz-uri de pe acest dispozitiv) și «download» (rezultate CSV). */
export const strings = {
  en: { title: 'Quiz', wait: 'Waiting for the teacher to start the quiz…', load: 'Load a quiz', paste: 'Quiz text (JSON, plain text or CSV)', file: 'Or choose a file (.json, .txt, .csv, up to 512 KB)', sample: 'Insert a sample', check: 'Check quiz', saved: 'Saved on this device', save: 'Save on this device', del: 'Delete', none: 'Nothing saved yet', okload: '“{title}” — {n} questions ready', warn: 'Notices', errs: 'Problems found', setup: 'Settings', time: 'Time per question', nolimit: 'No limit', sec: '{n} s', names: 'Show names on the leaderboard', begin: 'Start quiz', qn: 'Question {i} of {n}', answered: 'Answers: {n} of {m}', reveal: 'Show answer', next: 'Next question', finish: 'Show results', send: 'Send answer', sent: 'Answer received ✓ — waiting for the others…', sending: 'Sending…', multi: 'Select all correct answers', single: 'Choose one answer', right: 'Correct! +{p} points', wrong: 'Not this time.', noans: 'No answer sent.', correct: 'Correct answer:', why: 'Why:', board: 'Leaderboard', you: 'You: {s} points, place {r} of {n}', csv: 'Save results (CSV)', again: 'Load another quiz', tleft: 'Time left: {n} s', tup: 'Time is up.', toolarge: 'Too large to save (limit about 12 KB).', savedok: 'Saved.', anon: 'Player {n}', pts: 'points', errfile: 'The file could not be read.', full: 'The library is full (5 quizzes): delete one first.',
    e_empty: 'Nothing to read.', e_format: 'Unknown format: use JSON, the plain-text format or CSV.', e_json: 'The JSON is not valid.', e_noq: 'No questions found.', e_many: 'Too many questions (at most 200).', e_qtext: 'Question {i}: the question text is missing.', e_opts: 'Question {i}: 2 to 6 options are needed.', e_ans: 'Question {i}: the correct answer is missing or does not match an option.', w_trunc: 'Question {i}: some text was shortened.', w_time: 'Question {i}: time ignored (use 0–600 seconds).' },
  ro: { title: 'Quiz', wait: 'Se așteaptă ca profesorul să pornească quiz-ul…', load: 'Încarcă un quiz', paste: 'Textul quiz-ului (JSON, text simplu sau CSV)', file: 'Sau alege un fișier (.json, .txt, .csv, până la 512 KB)', sample: 'Inserează un exemplu', check: 'Verifică quiz-ul', saved: 'Salvate pe acest dispozitiv', save: 'Salvează pe acest dispozitiv', del: 'Șterge', none: 'Nimic salvat încă', okload: '„{title}” — {n} întrebări pregătite', warn: 'Observații', errs: 'Probleme găsite', setup: 'Setări', time: 'Timp pentru o întrebare', nolimit: 'Fără limită', sec: '{n} s', names: 'Arată numele în clasament', begin: 'Pornește quiz-ul', qn: 'Întrebarea {i} din {n}', answered: 'Răspunsuri: {n} din {m}', reveal: 'Arată răspunsul', next: 'Întrebarea următoare', finish: 'Arată rezultatele', send: 'Trimite răspunsul', sent: 'Răspuns primit ✓ — se așteaptă ceilalți…', sending: 'Se trimite…', multi: 'Bifează toate răspunsurile corecte', single: 'Alege un singur răspuns', right: 'Corect! +{p} puncte', wrong: 'De data asta nu.', noans: 'Nu ai trimis niciun răspuns.', correct: 'Răspuns corect:', why: 'De ce:', board: 'Clasament', you: 'Tu: {s} puncte, locul {r} din {n}', csv: 'Salvează rezultatele (CSV)', again: 'Încarcă alt quiz', tleft: 'Timp rămas: {n} s', tup: 'Timpul a expirat.', toolarge: 'Prea mare pentru salvare (limită ≈ 12 KB).', savedok: 'Salvat.', anon: 'Jucător {n}', pts: 'puncte', errfile: 'Fișierul nu a putut fi citit.', full: 'Biblioteca este plină (5 quiz-uri): șterge unul mai întâi.',
    e_empty: 'Nu există nimic de citit.', e_format: 'Format necunoscut: folosește JSON, formatul text simplu sau CSV.', e_json: 'JSON-ul nu este valid.', e_noq: 'Nu s-a găsit nicio întrebare.', e_many: 'Prea multe întrebări (cel mult 200).', e_qtext: 'Întrebarea {i}: lipsește textul întrebării.', e_opts: 'Întrebarea {i}: sunt necesare 2–6 variante.', e_ans: 'Întrebarea {i}: răspunsul corect lipsește sau nu corespunde unei variante.', w_trunc: 'Întrebarea {i}: o parte din text a fost scurtată.', w_time: 'Întrebarea {i}: timp ignorat (folosește 0–600 de secunde).' },
  fr: { title: 'Quiz', wait: 'En attente du démarrage du quiz par l’enseignant…', load: 'Charger un quiz', paste: 'Texte du quiz (JSON, texte simple ou CSV)', file: 'Ou choisissez un fichier (.json, .txt, .csv, jusqu’à 512 Ko)', sample: 'Insérer un exemple', check: 'Vérifier le quiz', saved: 'Enregistrés sur cet appareil', save: 'Enregistrer sur cet appareil', del: 'Supprimer', none: 'Rien d’enregistré', okload: '« {title} » — {n} questions prêtes', warn: 'Remarques', errs: 'Problèmes trouvés', setup: 'Réglages', time: 'Temps par question', nolimit: 'Sans limite', sec: '{n} s', names: 'Afficher les noms dans le classement', begin: 'Démarrer le quiz', qn: 'Question {i} sur {n}', answered: 'Réponses : {n} sur {m}', reveal: 'Afficher la réponse', next: 'Question suivante', finish: 'Afficher les résultats', send: 'Envoyer la réponse', sent: 'Réponse reçue ✓ — en attente des autres…', sending: 'Envoi…', multi: 'Cochez toutes les bonnes réponses', single: 'Choisissez une réponse', right: 'Correct ! +{p} points', wrong: 'Pas cette fois.', noans: 'Aucune réponse envoyée.', correct: 'Bonne réponse :', why: 'Pourquoi :', board: 'Classement', you: 'Vous : {s} points, place {r} sur {n}', csv: 'Enregistrer les résultats (CSV)', again: 'Charger un autre quiz', tleft: 'Temps restant : {n} s', tup: 'Temps écoulé.', toolarge: 'Trop volumineux pour être enregistré (limite ≈ 12 Ko).', savedok: 'Enregistré.', anon: 'Joueur {n}', pts: 'points', errfile: 'Le fichier n’a pas pu être lu.', full: 'La bibliothèque est pleine (5 quiz) : supprimez-en un d’abord.',
    e_empty: 'Rien à lire.', e_format: 'Format inconnu : utilisez JSON, le texte simple ou CSV.', e_json: 'Le JSON n’est pas valide.', e_noq: 'Aucune question trouvée.', e_many: 'Trop de questions (200 au maximum).', e_qtext: 'Question {i} : le texte de la question manque.', e_opts: 'Question {i} : 2 à 6 options sont nécessaires.', e_ans: 'Question {i} : la bonne réponse manque ou ne correspond à aucune option.', w_trunc: 'Question {i} : une partie du texte a été raccourcie.', w_time: 'Question {i} : durée ignorée (utilisez 0 à 600 secondes).' },
  de: { title: 'Quiz', wait: 'Warten, bis die Lehrkraft das Quiz startet …', load: 'Quiz laden', paste: 'Quiztext (JSON, einfacher Text oder CSV)', file: 'Oder Datei wählen (.json, .txt, .csv, bis 512 KB)', sample: 'Beispiel einfügen', check: 'Quiz prüfen', saved: 'Auf diesem Gerät gespeichert', save: 'Auf diesem Gerät speichern', del: 'Löschen', none: 'Noch nichts gespeichert', okload: '„{title}“ — {n} Fragen bereit', warn: 'Hinweise', errs: 'Gefundene Probleme', setup: 'Einstellungen', time: 'Zeit pro Frage', nolimit: 'Unbegrenzt', sec: '{n} s', names: 'Namen in der Rangliste zeigen', begin: 'Quiz starten', qn: 'Frage {i} von {n}', answered: 'Antworten: {n} von {m}', reveal: 'Antwort zeigen', next: 'Nächste Frage', finish: 'Ergebnisse zeigen', send: 'Antwort senden', sent: 'Antwort erhalten ✓ — warten auf die anderen …', sending: 'Wird gesendet …', multi: 'Alle richtigen Antworten wählen', single: 'Eine Antwort wählen', right: 'Richtig! +{p} Punkte', wrong: 'Diesmal nicht.', noans: 'Keine Antwort gesendet.', correct: 'Richtige Antwort:', why: 'Warum:', board: 'Rangliste', you: 'Du: {s} Punkte, Platz {r} von {n}', csv: 'Ergebnisse speichern (CSV)', again: 'Anderes Quiz laden', tleft: 'Verbleibende Zeit: {n} s', tup: 'Die Zeit ist um.', toolarge: 'Zu groß zum Speichern (Grenze ca. 12 KB).', savedok: 'Gespeichert.', anon: 'Spieler {n}', pts: 'Punkte', errfile: 'Die Datei konnte nicht gelesen werden.', full: 'Die Bibliothek ist voll (5 Quiz): zuerst eines löschen.',
    e_empty: 'Nichts zu lesen.', e_format: 'Unbekanntes Format: JSON, einfachen Text oder CSV verwenden.', e_json: 'Das JSON ist ungültig.', e_noq: 'Keine Fragen gefunden.', e_many: 'Zu viele Fragen (höchstens 200).', e_qtext: 'Frage {i}: Der Fragetext fehlt.', e_opts: 'Frage {i}: 2 bis 6 Optionen sind nötig.', e_ans: 'Frage {i}: Die richtige Antwort fehlt oder passt zu keiner Option.', w_trunc: 'Frage {i}: Ein Teil des Textes wurde gekürzt.', w_time: 'Frage {i}: Zeit ignoriert (0–600 Sekunden verwenden).' },
  es: { title: 'Quiz', wait: 'Esperando a que el docente inicie el quiz…', load: 'Cargar un quiz', paste: 'Texto del quiz (JSON, texto simple o CSV)', file: 'O elige un archivo (.json, .txt, .csv, hasta 512 KB)', sample: 'Insertar un ejemplo', check: 'Comprobar el quiz', saved: 'Guardados en este dispositivo', save: 'Guardar en este dispositivo', del: 'Borrar', none: 'Nada guardado todavía', okload: '«{title}» — {n} preguntas listas', warn: 'Avisos', errs: 'Problemas encontrados', setup: 'Ajustes', time: 'Tiempo por pregunta', nolimit: 'Sin límite', sec: '{n} s', names: 'Mostrar nombres en la clasificación', begin: 'Iniciar el quiz', qn: 'Pregunta {i} de {n}', answered: 'Respuestas: {n} de {m}', reveal: 'Mostrar la respuesta', next: 'Siguiente pregunta', finish: 'Mostrar resultados', send: 'Enviar respuesta', sent: 'Respuesta recibida ✓ — esperando a los demás…', sending: 'Enviando…', multi: 'Marca todas las respuestas correctas', single: 'Elige una respuesta', right: '¡Correcto! +{p} puntos', wrong: 'Esta vez no.', noans: 'No enviaste respuesta.', correct: 'Respuesta correcta:', why: 'Por qué:', board: 'Clasificación', you: 'Tú: {s} puntos, puesto {r} de {n}', csv: 'Guardar resultados (CSV)', again: 'Cargar otro quiz', tleft: 'Tiempo restante: {n} s', tup: 'Se acabó el tiempo.', toolarge: 'Demasiado grande para guardar (límite ≈ 12 KB).', savedok: 'Guardado.', anon: 'Jugador {n}', pts: 'puntos', errfile: 'No se pudo leer el archivo.', full: 'La biblioteca está llena (5 quizzes): borra uno primero.',
    e_empty: 'No hay nada que leer.', e_format: 'Formato desconocido: usa JSON, texto simple o CSV.', e_json: 'El JSON no es válido.', e_noq: 'No se encontraron preguntas.', e_many: 'Demasiadas preguntas (máximo 200).', e_qtext: 'Pregunta {i}: falta el texto de la pregunta.', e_opts: 'Pregunta {i}: se necesitan de 2 a 6 opciones.', e_ans: 'Pregunta {i}: falta la respuesta correcta o no coincide con ninguna opción.', w_trunc: 'Pregunta {i}: se acortó parte del texto.', w_time: 'Pregunta {i}: tiempo ignorado (usa 0–600 segundos).' },
  it: { title: 'Quiz', wait: 'In attesa che l’insegnante avvii il quiz…', load: 'Carica un quiz', paste: 'Testo del quiz (JSON, testo semplice o CSV)', file: 'Oppure scegli un file (.json, .txt, .csv, fino a 512 KB)', sample: 'Inserisci un esempio', check: 'Verifica il quiz', saved: 'Salvati su questo dispositivo', save: 'Salva su questo dispositivo', del: 'Elimina', none: 'Ancora nulla di salvato', okload: '«{title}» — {n} domande pronte', warn: 'Avvisi', errs: 'Problemi trovati', setup: 'Impostazioni', time: 'Tempo per domanda', nolimit: 'Nessun limite', sec: '{n} s', names: 'Mostra i nomi in classifica', begin: 'Avvia il quiz', qn: 'Domanda {i} di {n}', answered: 'Risposte: {n} di {m}', reveal: 'Mostra la risposta', next: 'Domanda successiva', finish: 'Mostra i risultati', send: 'Invia la risposta', sent: 'Risposta ricevuta ✓ — in attesa degli altri…', sending: 'Invio…', multi: 'Seleziona tutte le risposte corrette', single: 'Scegli una risposta', right: 'Corretto! +{p} punti', wrong: 'Questa volta no.', noans: 'Nessuna risposta inviata.', correct: 'Risposta corretta:', why: 'Perché:', board: 'Classifica', you: 'Tu: {s} punti, posto {r} di {n}', csv: 'Salva i risultati (CSV)', again: 'Carica un altro quiz', tleft: 'Tempo rimasto: {n} s', tup: 'Tempo scaduto.', toolarge: 'Troppo grande per essere salvato (limite ≈ 12 KB).', savedok: 'Salvato.', anon: 'Giocatore {n}', pts: 'punti', errfile: 'Impossibile leggere il file.', full: 'La libreria è piena (5 quiz): eliminane uno prima.',
    e_empty: 'Niente da leggere.', e_format: 'Formato sconosciuto: usa JSON, testo semplice o CSV.', e_json: 'Il JSON non è valido.', e_noq: 'Nessuna domanda trovata.', e_many: 'Troppe domande (al massimo 200).', e_qtext: 'Domanda {i}: manca il testo della domanda.', e_opts: 'Domanda {i}: servono da 2 a 6 opzioni.', e_ans: 'Domanda {i}: la risposta corretta manca o non corrisponde a nessuna opzione.', w_trunc: 'Domanda {i}: una parte del testo è stata accorciata.', w_time: 'Domanda {i}: tempo ignorato (usa 0–600 secondi).' },
  hu: { title: 'Kvíz', wait: 'Várakozás, hogy a tanár elindítsa a kvízt…', load: 'Kvíz betöltése', paste: 'A kvíz szövege (JSON, egyszerű szöveg vagy CSV)', file: 'Vagy válassz fájlt (.json, .txt, .csv, legfeljebb 512 KB)', sample: 'Minta beszúrása', check: 'Kvíz ellenőrzése', saved: 'Elmentve ezen az eszközön', save: 'Mentés ezen az eszközön', del: 'Törlés', none: 'Még nincs mentett kvíz', okload: '„{title}” — {n} kérdés kész', warn: 'Megjegyzések', errs: 'Talált problémák', setup: 'Beállítások', time: 'Idő kérdésenként', nolimit: 'Korlátlan', sec: '{n} mp', names: 'Nevek mutatása a ranglistán', begin: 'Kvíz indítása', qn: '{i}. kérdés / {n}', answered: 'Válaszok: {n} / {m}', reveal: 'Válasz mutatása', next: 'Következő kérdés', finish: 'Eredmények mutatása', send: 'Válasz küldése', sent: 'Válasz megérkezett ✓ — várakozás a többiekre…', sending: 'Küldés…', multi: 'Jelöld meg az összes helyes választ', single: 'Válassz egy választ', right: 'Helyes! +{p} pont', wrong: 'Most nem.', noans: 'Nem küldtél választ.', correct: 'Helyes válasz:', why: 'Miért:', board: 'Ranglista', you: 'Te: {s} pont, {r}. hely / {n}', csv: 'Eredmények mentése (CSV)', again: 'Másik kvíz betöltése', tleft: 'Hátralévő idő: {n} mp', tup: 'Lejárt az idő.', toolarge: 'Túl nagy a mentéshez (kb. 12 KB a korlát).', savedok: 'Mentve.', anon: '{n}. játékos', pts: 'pont', errfile: 'A fájl nem olvasható.', full: 'A könyvtár megtelt (5 kvíz): előbb törölj egyet.',
    e_empty: 'Nincs mit beolvasni.', e_format: 'Ismeretlen formátum: használj JSON-t, egyszerű szöveget vagy CSV-t.', e_json: 'A JSON érvénytelen.', e_noq: 'Nem található kérdés.', e_many: 'Túl sok kérdés (legfeljebb 200).', e_qtext: '{i}. kérdés: hiányzik a kérdés szövege.', e_opts: '{i}. kérdés: 2–6 válaszlehetőség kell.', e_ans: '{i}. kérdés: a helyes válasz hiányzik, vagy nem egyezik egyik lehetőséggel sem.', w_trunc: '{i}. kérdés: a szöveg egy része lerövidült.', w_time: '{i}. kérdés: az idő figyelmen kívül maradt (0–600 másodperc használható).' },
  pt: { title: 'Quiz', wait: 'A aguardar que o professor inicie o quiz…', load: 'Carregar um quiz', paste: 'Texto do quiz (JSON, texto simples ou CSV)', file: 'Ou escolha um ficheiro (.json, .txt, .csv, até 512 KB)', sample: 'Inserir um exemplo', check: 'Verificar o quiz', saved: 'Guardados neste dispositivo', save: 'Guardar neste dispositivo', del: 'Apagar', none: 'Ainda nada guardado', okload: '“{title}” — {n} perguntas prontas', warn: 'Avisos', errs: 'Problemas encontrados', setup: 'Definições', time: 'Tempo por pergunta', nolimit: 'Sem limite', sec: '{n} s', names: 'Mostrar nomes na classificação', begin: 'Iniciar o quiz', qn: 'Pergunta {i} de {n}', answered: 'Respostas: {n} de {m}', reveal: 'Mostrar a resposta', next: 'Pergunta seguinte', finish: 'Mostrar resultados', send: 'Enviar resposta', sent: 'Resposta recebida ✓ — a aguardar os outros…', sending: 'A enviar…', multi: 'Marque todas as respostas corretas', single: 'Escolha uma resposta', right: 'Correto! +{p} pontos', wrong: 'Desta vez não.', noans: 'Não enviou resposta.', correct: 'Resposta correta:', why: 'Porquê:', board: 'Classificação', you: 'Você: {s} pontos, lugar {r} de {n}', csv: 'Guardar resultados (CSV)', again: 'Carregar outro quiz', tleft: 'Tempo restante: {n} s', tup: 'O tempo acabou.', toolarge: 'Demasiado grande para guardar (limite ≈ 12 KB).', savedok: 'Guardado.', anon: 'Jogador {n}', pts: 'pontos', errfile: 'Não foi possível ler o ficheiro.', full: 'A biblioteca está cheia (5 quizzes): apague um primeiro.',
    e_empty: 'Nada para ler.', e_format: 'Formato desconhecido: use JSON, texto simples ou CSV.', e_json: 'O JSON não é válido.', e_noq: 'Nenhuma pergunta encontrada.', e_many: 'Demasiadas perguntas (no máximo 200).', e_qtext: 'Pergunta {i}: falta o texto da pergunta.', e_opts: 'Pergunta {i}: são necessárias 2 a 6 opções.', e_ans: 'Pergunta {i}: falta a resposta correta ou não corresponde a nenhuma opção.', w_trunc: 'Pergunta {i}: parte do texto foi encurtada.', w_time: 'Pergunta {i}: tempo ignorado (use 0–600 segundos).' }
};

/* ---------- format de fișier: parser tolerant, fără dependențe (exportat pentru teste) ---------- */
var LET = 'ABCDEF';
var LIMIT = { questions: 200, q: 300, opt: 120, why: 300, title: 80 };
function clip(v, max, warns, i) {
  var s = String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  if (s.length > max) { warns.push({ c: 'w_trunc', i: i }); s = s.slice(0, max - 1) + '…'; }
  return s;
}
function pick(o, keys) { for (var k = 0; k < keys.length; k++) if (o[keys[k]] != null && o[keys[k]] !== '') return o[keys[k]]; return undefined; }
/** Un răspuns (număr, literă, text) → index; -1 dacă nu corespunde. */
function toIndex(a, opts, base) {
  if (typeof a === 'number' && isFinite(a) && a % 1 === 0) { var n = a - base; return n >= 0 && n < opts.length ? n : -1; }
  if (typeof a === 'string') {
    var s = a.trim();
    if (/^[A-Fa-f]$/.test(s)) { var li = LET.indexOf(s.toUpperCase()); return li < opts.length ? li : -1; }
    if (/^\d+$/.test(s)) { var di = parseInt(s, 10) - base; return di >= 0 && di < opts.length ? di : -1; }
    var low = s.toLowerCase();
    for (var i = 0; i < opts.length; i++) if (opts[i].toLowerCase() === low) return i;
  }
  return -1;
}
function normQuestion(raw, i, base, errs, warns) {
  if (!raw || typeof raw !== 'object') { errs.push({ c: 'e_qtext', i: i }); return null; }
  var q = clip(pick(raw, ['q', 'question', 'text', 'prompt', 'title', 'name']), LIMIT.q, warns, i);
  if (!q) { errs.push({ c: 'e_qtext', i: i }); return null; }
  var ro = pick(raw, ['options', 'answers', 'choices', 'alternatives', 'variants', 'opts']), opts = [], flagged = [];
  if (Array.isArray(ro)) {
    ro.forEach(function (o, k) {
      if (o && typeof o === 'object') {
        opts.push(clip(pick(o, ['text', 'label', 'answer', 'option', 'value', 'title']), LIMIT.opt, warns, i));
        if (o.correct === true || o.isCorrect === true || o.right === true) flagged.push(k);
      } else opts.push(clip(o, LIMIT.opt, warns, i));
    });
  }
  if (opts.length < 2 || opts.length > 6 || opts.some(function (o) { return !o; })) { errs.push({ c: 'e_opts', i: i }); return null; }
  var ra = pick(raw, ['answer', 'correct', 'correctAnswer', 'correct_answer', 'solution', 'right', 'ans']), ans = [];
  if (ra !== undefined) (Array.isArray(ra) ? ra : [ra]).forEach(function (a) { var x = toIndex(a, opts, base); if (x >= 0 && ans.indexOf(x) < 0) ans.push(x); else if (x < 0) ans.push(-1); });
  else ans = flagged.slice();
  if (!ans.length || ans.indexOf(-1) >= 0) { errs.push({ c: 'e_ans', i: i }); return null; }
  var tm = pick(raw, ['time', 'seconds', 'timeLimit', 'duration']), time = 0;
  if (tm !== undefined) { var tn = +tm; if (isFinite(tn) && tn >= 0 && tn <= 600) time = Math.round(tn); else warns.push({ c: 'w_time', i: i }); }
  return { q: q, opts: opts, ans: ans.sort(function (a, b) { return a - b; }), why: clip(pick(raw, ['explain', 'explanation', 'why', 'feedback', 'note']), LIMIT.why, warns, i), time: time };
}
function parseJson(src, errs, warns) {
  var data;
  try { data = JSON.parse(src); } catch (e) { errs.push({ c: 'e_json' }); return null; }
  var list = Array.isArray(data) ? data : (data && (data.questions || data.items || data.quiz || data.data));
  if (list && !Array.isArray(list) && Array.isArray(list.questions)) list = list.questions;
  if (!Array.isArray(list)) { errs.push({ c: 'e_noq' }); return null; }
  var base = data && !Array.isArray(data) && (data.base === 1 || data.indexBase === 1) ? 1 : 0;
  return { title: !Array.isArray(data) && typeof data.title === 'string' ? data.title : (!Array.isArray(data) && typeof data.name === 'string' ? data.name : ''), raws: list, base: base };
}
function parseText(src, errs, warns) {
  var blocks = src.split(/\n\s*\n/), title = '', raws = [];
  blocks.forEach(function (b, bi) {
    var lines = b.split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).filter(function (l) { return l.trim() !== ''; });
    if (!lines.length) return;
    var tm = /^\s*(?:title|titlu|titre|titel|título|titolo|cím)\s*:\s*(.+)$/i.exec(lines[0]);
    if (tm && !lines.some(function (l) { return /^\s*[A-Fa-f]\s*[.):]\s+\S/.test(l); })) { title = tm[1].trim(); return; }
    var qlines = [], opts = [], ans = null, why = '', time;
    lines.forEach(function (l) {
      var mo = /^\s*([A-Fa-f])\s*[.):]\s+(.+)$/.exec(l), ma = /^\s*(?:answer|raspuns|răspuns)\s*:\s*(.+)$/i.exec(l), me = /^\s*(?:explain|why|explicatie|explicație)\s*:\s*(.+)$/i.exec(l), mt = /^\s*(?:time|timp)\s*:\s*(\d+)\s*$/i.exec(l);
      if (ma) ans = ma[1].split(/[\s,;|+]+/).filter(Boolean);
      else if (me) why = me[1];
      else if (mt) time = parseInt(mt[1], 10);
      else if (mo && ans === null) { if (LET.indexOf(mo[1].toUpperCase()) === opts.length) opts.push(mo[2]); else qlines.push(l.trim()); }
      else if (!opts.length) qlines.push(l.trim());
    });
    raws.push({ q: qlines.join(' '), options: opts, answer: ans, explain: why, time: time });
  });
  return { title: title, raws: raws, base: 1 };   // cifrele din text se numără de la 1, ca în șabloanele de quiz din foi de calcul
}
function splitCsv(src, d) {
  var rows = [], row = [], cell = '', q = false, i, c;
  for (i = 0; i < src.length; i++) {
    c = src.charAt(i);
    if (q) { if (c === '"') { if (src.charAt(i + 1) === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === d) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  row.push(cell); rows.push(row);
  return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ''; }); });
}
function parseCsv(src, errs, warns) {
  var first = src.split('\n')[0], d = (first.match(/;/g) || []).length >= (first.match(/,/g) || []).length ? ';' : ',';
  var rows = splitCsv(src, d);
  if (rows.length < 2) { errs.push({ c: 'e_noq' }); return null; }
  var head = rows[0].map(function (x) { return x.trim().toLowerCase(); }), col = {};
  head.forEach(function (x, k) { if (col[x] === undefined) col[x] = k; });
  var qi = col.question !== undefined ? col.question : (col.q !== undefined ? col.q : col.intrebare), raws = [];
  if (qi === undefined) { errs.push({ c: 'e_format' }); return null; }
  rows.slice(1).forEach(function (r) {
    var opts = [];
    'abcdef'.split('').forEach(function (L2, k) {
      var v = col[L2] !== undefined ? r[col[L2]] : (col['option' + (k + 1)] !== undefined ? r[col['option' + (k + 1)]] : undefined);
      if (v != null && v.trim() !== '') opts.push(v.trim());
    });
    var an = col.answer !== undefined ? (r[col.answer] || '') : '';
    raws.push({ q: r[qi], options: opts, answer: an.split(/[\s|+]+/).filter(Boolean), explain: col.explain !== undefined ? r[col.explain] : '', time: col.time !== undefined && r[col.time] ? r[col.time] : undefined });
  });
  return { title: '', raws: raws, base: 1 };   // la fel: coloana «answer» cu cifre se numără de la 1
}
export function parseQuiz(text) {
  var errs = [], warns = [], src = String(text == null ? '' : text).replace(/^\ufeff/, '').replace(/\r\n?/g, '\n').trim(), p = null;
  if (!src) return { ok: false, errors: [{ c: 'e_empty' }], warnings: [] };
  var c0 = src.charAt(0);
  if (c0 === '{' || c0 === '[') p = parseJson(src, errs, warns);
  else if (/^\s*(?:answer|raspuns|răspuns)\s*:/im.test(src)) p = parseText(src, errs, warns);
  else if (/^\s*"?(?:question|q|intrebare)"?\s*[;,]/i.test(src)) p = parseCsv(src, errs, warns);
  else errs.push({ c: 'e_format' });
  if (!p) return { ok: false, errors: errs, warnings: warns };
  if (!p.raws.length) return { ok: false, errors: [{ c: 'e_noq' }], warnings: warns };
  if (p.raws.length > LIMIT.questions) return { ok: false, errors: [{ c: 'e_many' }], warnings: warns };
  var questions = [];
  p.raws.forEach(function (r, k) { var q = normQuestion(r, k + 1, p.base, errs, warns); if (q) questions.push(q); });
  if (errs.length) return { ok: false, errors: errs, warnings: warns };
  return { ok: true, quiz: { title: clip(p.title, LIMIT.title, [], 0), questions: questions }, errors: [], warnings: warns };
}
/** Puncte pentru un răspuns: corect = 1000 (+ până la 500 pentru viteză, dacă întrebarea are timp). Răspunsul trebuie să coincidă exact cu mulțimea corectă. */
export function scoreAnswer(sel, ans, timeMs, leftMs) {
  var a = (sel || []).slice().sort(function (x, y) { return x - y; });
  if (a.length !== ans.length) return 0;
  for (var i = 0; i < a.length; i++) if (a[i] !== ans[i]) return 0;
  var bonus = timeMs > 0 ? Math.round(500 * Math.max(0, Math.min(1, leftMs / timeMs))) : 0;
  return 1000 + bonus;
}
/** Clasament: scor descrescător, apoi nume; locurile egale primesc același loc. */
export function rankBoard(rows) {
  var s = rows.slice().sort(function (a, b) { return b.score - a.score || String(a.name).localeCompare(String(b.name)); }), r = 0, prev = null;
  s.forEach(function (x, i) { if (x.score !== prev) { r = i + 1; prev = x.score; } x.rank = r; });
  return s;
}
export var SAMPLE = '{\n  "title": "Sample",\n  "questions": [\n    { "q": "2 + 2 = ?", "options": ["3", "4", "5"], "answer": 1, "time": 15, "explain": "Basic addition." },\n    { "q": "Which are prime?", "options": ["2", "9", "11", "15"], "answer": [0, 2] }\n  ]\n}';

/* ---------- interfața ---------- */
var SHAPES = ['▲', '■', '●', '◆', '★', '✚'];
var LIB_MAX = 5, LIB_TEXT = 12000;

export function mount(box, api) {
  var h = api.h, t = api.t, host = api.role === 'host';
  var S = { id: 0, ph: 'idle', title: '', i: 0, n: 0, q: '', opts: [], multi: false, time: 0, left: 0, cnt: 0, m: 0, names: true, ok: [], dist: [], why: '', top: [] };
  var recvAt = Date.now(), els = {};
  // doar gazda
  var quiz = null, answers = {}, board = {}, startedAt = 0, form = { text: '', time: 20, names: true }, parsed = null, libIdx = [], libMsg = '';
  // doar telefonul
  var sel = [], acked = -1, sending = false, res = null, fin = null, qkey = '';

  function peerList() { return api.peers(); }
  function pushState() { recvAt = Date.now(); S.m = peerList().length; S.left = S.time > 0 ? Math.max(0, S.time * 1000 - (Date.now() - startedAt)) : 0; api.setState(S); render(); }
  function topRows(max) {
    var rows = Object.keys(board).map(function (id) { return { id: id, name: board[id].name, score: board[id].score, color: board[id].color }; });
    return rankBoard(rows).slice(0, max);
  }
  function viewRows(rows) { return rows.map(function (r) { return { n: S.names ? r.name : null, c: r.color, s: r.score, r: r.rank }; }); }

  /* ----- gazdă: conducerea quiz-ului ----- */
  function check() { parsed = parseQuiz(form.text); drawResult(); }
  function begin() {
    if (!parsed || !parsed.ok) return;
    quiz = parsed.quiz; board = {}; S.id += 1; S.names = form.names;
    peerList().forEach(function (p) { board[p.id] = { name: p.name, score: 0, color: p.color }; });
    openQ(0);
  }
  function openQ(i) {
    var qq = quiz.questions[i];
    answers = {}; startedAt = Date.now();
    var time = qq.time > 0 ? qq.time : form.time;
    S = { id: S.id, ph: 'q', title: quiz.title, i: i, n: quiz.questions.length, q: qq.q, opts: qq.opts, multi: qq.ans.length > 1, time: time, left: time * 1000, cnt: 0, m: 0, names: S.names, ok: [], dist: [], why: '', top: [] };
    pushState();
  }
  function reveal() {
    if (!host || S.ph !== 'q') return;
    var qq = quiz.questions[S.i], dist = qq.opts.map(function () { return 0; }), timeMs = S.time * 1000;
    peerList().forEach(function (p) { if (!board[p.id]) board[p.id] = { name: p.name, score: 0, color: p.color }; board[p.id].name = p.name; });
    Object.keys(answers).forEach(function (id) { answers[id].s.forEach(function (k) { dist[k]++; }); });
    var pts = {};
    Object.keys(board).forEach(function (id) {
      var a = answers[id], p = a ? scoreAnswer(a.s, qq.ans, timeMs, timeMs - (a.at - startedAt)) : 0;
      pts[id] = { p: p, answered: !!a }; board[id].score += p;
    });
    S.ph = 'rev'; S.ok = qq.ans; S.dist = dist; S.why = qq.why; S.top = viewRows(topRows(5));
    pushState();
    var ranked = rankBoard(Object.keys(board).map(function (id) { return { id: id, name: board[id].name, score: board[id].score }; }));
    ranked.forEach(function (r) {
      if (!peerList().some(function (p) { return p.id === r.id; })) return;
      api.send({ k: 'res', i: S.i, p: pts[r.id].p, a: pts[r.id].answered, s: r.score, r: r.rank, of: ranked.length }, { to: r.id });
    });
  }
  function next() {
    if (!host || S.ph !== 'rev') return;
    if (S.i + 1 < quiz.questions.length) openQ(S.i + 1); else finish();
  }
  function finish() {
    var ranked = rankBoard(Object.keys(board).map(function (id) { return { id: id, name: board[id].name, score: board[id].score }; }));
    S.ph = 'end'; S.top = viewRows(topRows(8));
    pushState();
    ranked.forEach(function (r) {
      if (peerList().some(function (p) { return p.id === r.id; })) api.send({ k: 'fin', s: r.score, r: r.rank, of: ranked.length }, { to: r.id });
    });
  }
  function reset() { S = { id: S.id, ph: 'idle', title: '', i: 0, n: 0, q: '', opts: [], multi: false, time: 0, left: 0, cnt: 0, m: 0, names: true, ok: [], dist: [], why: '', top: [] }; quiz = null; pushState(); }
  function exportCsv() {
    var rows = rankBoard(Object.keys(board).map(function (id) { return { name: board[id].name, score: board[id].score }; }));
    var csv = 'rank,name,score\r\n' + rows.map(function (r) { return [r.rank, '"' + String(r.name).replace(/"/g, '""') + '"', r.score].join(','); }).join('\r\n') + '\r\n';
    api.save('quiz-results.csv', 'text/csv', csv);
  }
  /* biblioteca de pe acest dispozitiv (permisiunea «storage»): până la 5 quiz-uri, fiecare ≤ 12 000 de caractere */
  function loadLib() { api.store.get('idx').then(function (v) { libIdx = Array.isArray(v) ? v.filter(function (e) { return e && typeof e.k === 'string' && /^qz[0-4]$/.test(e.k); }).slice(0, LIB_MAX) : []; if (S.ph === 'idle') render(); }, function () { libIdx = []; }); }
  function saveLib() {
    if (!parsed || !parsed.ok) return;
    if (form.text.length > LIB_TEXT) { libMsg = t('toolarge'); drawResult(); return; }
    var used = libIdx.map(function (e) { return e.k; }), slot = null, k;
    for (k = 0; k < LIB_MAX; k++) if (used.indexOf('qz' + k) < 0) { slot = 'qz' + k; break; }
    if (!slot) { libMsg = t('full'); drawResult(); return; }
    api.store.set(slot, form.text).then(function () { libIdx.push({ k: slot, t: parsed.quiz.title || slot }); return api.store.set('idx', libIdx); })
      .then(function () { libMsg = t('savedok'); render(); }, function () { libMsg = t('toolarge'); drawResult(); });
  }
  function openLib(e) { api.store.get(e.k).then(function (x) { form.text = typeof x === 'string' ? x : ''; if (els.ta) els.ta.value = form.text; check(); }); }
  function delLib(e) {
    libIdx = libIdx.filter(function (x) { return x.k !== e.k; });
    api.store.remove(e.k).then(function () { return api.store.set('idx', libIdx); }).then(function () { render(); }, function () { render(); });
  }
  function readFile(f) {
    if (!f) return;
    if (f.size > 512 * 1024) { parsed = { ok: false, errors: [{ c: 'errfile' }], warnings: [] }; drawResult(); return; }
    var r = new FileReader();
    r.onload = function () { form.text = String(r.result || ''); if (els.ta) els.ta.value = form.text; check(); };
    r.onerror = function () { parsed = { ok: false, errors: [{ c: 'errfile' }], warnings: [] }; drawResult(); };
    r.readAsText(f);
  }

  /* ----- telefon ----- */
  function answer(list) {
    if (api.locked || S.ph !== 'q' || acked === S.i || sending) return;
    if (!list.length) return;
    sending = true; api.send({ k: 'ans', i: S.i, s: list.slice() }, { to: 'host' }); render();
  }
  function pickOpt(k) {
    if (api.locked || S.ph !== 'q' || acked === S.i || sending) return;
    if (S.multi) { var at = sel.indexOf(k); if (at >= 0) sel.splice(at, 1); else sel.push(k); render(); }
    else { sel = [k]; answer(sel); }
  }

  /* ----- desenare ----- */
  function label(k) { return LET.charAt(k); }
  function optList(opts, mode) {
    var total = (S.dist || []).reduce(function (a, b) { return a + b; }, 0);
    return h('ul', { class: 'qz-opts', 'aria-label': t(S.multi ? 'multi' : 'single') }, opts.map(function (o, k) {
      var ok = S.ph === 'rev' && S.ok.indexOf(k) >= 0, chosen = sel.indexOf(k) >= 0;
      var cls = 'qz-opt' + (ok ? ' is-ok' : '') + (mode === 'pick' && chosen ? ' is-sel' : '');
      var inner = [h('span', { class: 'qz-sh', 'aria-hidden': 'true', text: SHAPES[k] }), h('span', { class: 'qz-lt', text: label(k) + '.' }), h('span', { class: 'qz-tx', text: o })];
      if (S.ph === 'rev') {
        var c = S.dist[k] || 0, pct = total ? Math.round(c * 100 / Math.max(1, S.cnt)) : 0;
        inner.push(h('span', { class: 'qz-ct', text: (ok ? '✓ ' : '') + c }));
        inner.push(h('span', { class: 'qz-bar', 'aria-hidden': 'true' }, [h('span', { class: 'qz-barf', css: { width: Math.min(100, pct) + '%' } })]));
      }
      if (mode === 'pick') {
        return h('li', {}, [h('button', { type: 'button', class: 'pfs-btn ' + cls, 'aria-pressed': chosen ? 'true' : 'false', disabled: acked === S.i || sending || S.ph !== 'q', on: { click: function () { pickOpt(k); } } }, inner)]);
      }
      return h('li', { class: cls }, inner);
    }));
  }
  function boardView(rows) {
    if (!rows || !rows.length) return null;
    return h('div', { class: 'pfs-card' }, [h('h3', { text: t('board') }), h('ol', { class: 'qz-board' }, rows.map(function (r, i) {
      return h('li', {}, [h('span', { class: 'pfs-chip', css: { '--c': r.c || '#999' } }), h('span', { class: 'qz-nm', text: r.n || t('anon', { n: i + 1 }) }), h('span', { class: 'qz-sc', text: r.s + ' ' + t('pts') })]);
    }))]);
  }
  function head() {
    els.timer = h('span', { class: 'qz-timer', role: 'timer', 'aria-live': 'off' });
    var kids = [h('span', { class: 'pfs-tag', text: t('qn', { i: S.i + 1, n: S.n }) })];
    if (S.ph === 'q' && S.time > 0) kids.push(els.timer);
    return h('div', { class: 'pfs-row qz-head' }, kids);
  }
  function updTimer() {
    if (!els.timer || S.ph !== 'q' || S.time <= 0) return;
    var rem = Math.max(0, S.left - (Date.now() - recvAt));
    els.timer.textContent = rem > 0 ? t('tleft', { n: Math.ceil(rem / 1000) }) : t('tup');
    if (host && rem <= 0 && S.ph === 'q') reveal();
  }
  function drawResult() {
    if (!els.result) return;
    var box2 = els.result; box2.textContent = '';
    if (!parsed) { if (libMsg) box2.appendChild(h('p', { class: 'pfs-muted', role: 'status', text: libMsg })); return; }
    if (!parsed.ok) {
      box2.appendChild(h('div', { class: 'pfs-card', role: 'alert' }, [h('h3', { class: 'pfs-bad', text: t('errs') }), h('ul', {}, parsed.errors.map(function (e) { return h('li', { text: t(e.c, { i: e.i }) }); }))]));
      return;
    }
    var q = parsed.quiz, kids = [h('p', { class: 'pfs-ok', role: 'status', text: t('okload', { title: q.title || t('title'), n: q.questions.length }) })];
    if (parsed.warnings.length) kids.push(h('div', { class: 'pfs-card' }, [h('h3', { text: t('warn') }), h('ul', {}, parsed.warnings.map(function (e) { return h('li', { text: t(e.c, { i: e.i }) }); }))]));
    var tsel = h('select', { id: 'qz-time', on: { change: function () { form.time = +tsel.value; } } }, [0, 10, 20, 30, 60, 120].map(function (n) { return h('option', { value: String(n), selected: n === form.time, text: n === 0 ? t('nolimit') : t('sec', { n: n }) }); }));
    var nm = h('input', { type: 'checkbox', id: 'qz-names', checked: form.names, on: { change: function () { form.names = nm.checked; } } });
    kids.push(h('div', { class: 'pfs-card' }, [h('h3', { text: t('setup') }), h('div', { class: 'pfs-row' }, [h('div', {}, [h('label', { for: 'qz-time', text: t('time') }), tsel]), h('label', { class: 'qz-chk', for: 'qz-names' }, [nm, ' ' + t('names')])])]));
    kids.push(h('div', { class: 'pfs-row' }, [
      h('button', { type: 'button', class: 'pfs-btn pri', text: t('begin'), on: { click: begin } }),
      h('button', { type: 'button', class: 'pfs-btn', text: t('save'), on: { click: saveLib } })
    ]));
    if (libMsg) kids.push(h('p', { class: 'pfs-muted', role: 'status', text: libMsg }));
    kids.forEach(function (k) { box2.appendChild(k); });
  }
  function loader() {
    els.ta = h('textarea', { id: 'qz-text', rows: '8', spellcheck: 'false', on: { input: function () { form.text = els.ta.value; } } });
    els.ta.value = form.text;
    els.result = h('div', { class: 'qz-result' });
    var file = h('input', { type: 'file', id: 'qz-file', accept: '.json,.txt,.csv,application/json,text/plain,text/csv', on: { change: function () { readFile(file.files && file.files[0]); file.value = ''; } } });
    var lib = libIdx.length ? h('div', { class: 'pfs-card' }, [h('h3', { text: t('saved') }), h('ul', { class: 'qz-lib' }, libIdx.map(function (e) {
      return h('li', { class: 'pfs-row' }, [h('button', { type: 'button', class: 'pfs-btn', text: e.t, on: { click: function () { openLib(e); } } }), h('button', { type: 'button', class: 'pfs-btn', text: t('del'), 'aria-label': t('del') + ': ' + e.t, on: { click: function () { delLib(e); } } })]);
    }))]) : h('p', { class: 'pfs-muted', text: t('saved') + ': ' + t('none') });
    var out = h('div', {}, [
      h('div', { class: 'pfs-card' }, [
        h('label', { for: 'qz-text', text: t('paste') }), els.ta,
        h('div', { class: 'pfs-row' }, [
          h('button', { type: 'button', class: 'pfs-btn pri', text: t('check'), on: { click: check } }),
          h('button', { type: 'button', class: 'pfs-btn', text: t('sample'), on: { click: function () { form.text = SAMPLE; els.ta.value = SAMPLE; check(); } } })
        ]),
        h('label', { for: 'qz-file', text: t('file') }), file
      ]),
      lib, els.result
    ]);
    return out;
  }
  function render() {
    var focusId = document.activeElement && document.activeElement.id;
    box.textContent = '';
    els = {};
    var kids = [h('h2', { text: S.title ? t('title') + ' — ' + S.title : t('title') })];
    if (S.ph === 'idle') {
      if (host) { kids.push(loader()); }
      else kids.push(h('p', { class: 'pfs-muted', text: t('wait') }));
    } else if (S.ph === 'q') {
      kids.push(head());
      kids.push(h('p', { class: 'qz-q', text: S.q }));
      if (host) {
        kids.push(optList(S.opts, 'show'));
        kids.push(h('p', { class: 'pfs-muted', role: 'status', text: t('answered', { n: S.cnt, m: S.m }) }));
        kids.push(h('div', { class: 'pfs-row' }, [h('button', { type: 'button', class: 'pfs-btn pri', text: t('reveal'), on: { click: reveal } })]));
      } else {
        kids.push(h('div', { class: 'pfs-in' }, [optList(S.opts, 'pick')]));
        if (S.multi && acked !== S.i && !sending) kids.push(h('button', { type: 'button', class: 'pfs-btn pri pfs-in', text: t('send'), disabled: !sel.length, on: { click: function () { answer(sel); } } }));
        kids.push(h('p', { class: 'pfs-muted', role: 'status', text: acked === S.i ? t('sent') : (sending ? t('sending') : t(S.multi ? 'multi' : 'single')) }));
      }
    } else if (S.ph === 'rev') {
      kids.push(head());
      kids.push(h('p', { class: 'qz-q', text: S.q }));
      kids.push(optList(S.opts, 'show'));
      if (S.why) kids.push(h('p', { class: 'qz-why' }, [h('b', { text: t('why') + ' ' }), S.why]));
      if (!host) {
        var line = res && res.i === S.i ? (res.a ? (res.p > 0 ? t('right', { p: res.p }) : t('wrong')) : t('noans')) : '';
        if (line) kids.push(h('p', { class: res && res.p > 0 ? 'pfs-ok' : 'pfs-bad', role: 'status', text: line }));
      }
      var bv = boardView(S.top); if (bv) kids.push(bv);
      if (host) kids.push(h('div', { class: 'pfs-row' }, [h('button', { type: 'button', class: 'pfs-btn pri', text: S.i + 1 < S.n ? t('next') : t('finish'), on: { click: next } })]));
    } else {
      var bv2 = boardView(S.top); if (bv2) kids.push(bv2);
      if (!host && fin) kids.push(h('p', { class: 'pfs-ok', role: 'status', text: t('you', { s: fin.s, r: fin.r, n: fin.of }) }));
      if (host) kids.push(h('div', { class: 'pfs-row' }, [
        h('button', { type: 'button', class: 'pfs-btn', text: t('csv'), on: { click: exportCsv } }),
        h('button', { type: 'button', class: 'pfs-btn pri', text: t('again'), on: { click: reset } })
      ]));
    }
    kids.forEach(function (k) { box.appendChild(k); });
    if (S.ph === 'idle' && host) drawResult();
    updTimer();
    if (focusId) { var f = document.getElementById(focusId); if (f && f.focus) f.focus(); }
  }

  /* ----- mesaje ----- */
  api.on(function (d, from) {
    if (!d || typeof d !== 'object' || !from) return;
    if (host && d.k === 'ans') {
      if (S.ph !== 'q' || d.i !== S.i || !from.id || answers[from.id] || !Array.isArray(d.s)) return;
      var s = [];
      d.s.forEach(function (k) { if (typeof k === 'number' && k % 1 === 0 && k >= 0 && k < S.opts.length && s.indexOf(k) < 0) s.push(k); });
      if (!s.length || (!S.multi && s.length > 1)) return;
      answers[from.id] = { s: s.sort(function (a, b) { return a - b; }), at: Date.now() };
      S.cnt = Object.keys(answers).length;
      api.send({ k: 'ack', i: S.i }, { to: from.id });
      pushState();
    } else if (!host && from.role === 'host') {
      if (d.k === 'ack' && d.i === S.i) { acked = S.i; sending = false; render(); }
      else if (d.k === 'res') { res = d; render(); }
      else if (d.k === 'fin') { fin = d; render(); }
    }
  });
  if (!host) {
    api.on('state', function (s) {
      if (!s || typeof s !== 'object' || !Array.isArray(s.opts)) return;
      var key = s.id + ':' + s.i;
      if (key !== qkey) { qkey = key; sel = []; acked = -1; sending = false; res = null; if (s.ph === 'q') fin = null; }
      S = s; recvAt = Date.now(); render();
    });
    if (api.state && Array.isArray(api.state.opts)) { S = api.state; qkey = S.id + ':' + S.i; }
    document.addEventListener('keydown', function (e) {
      if (S.ph !== 'q' || e.ctrlKey || e.metaKey || e.altKey) return;
      var tg = e.target && e.target.tagName;
      if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
      var n = parseInt(e.key, 10), k = isNaN(n) ? LET.indexOf(String(e.key).toUpperCase()) : n - 1;
      if (e.key && e.key.length === 1 && k >= 0 && k < S.opts.length) { e.preventDefault(); pickOpt(k); }
    });
  } else {
    api.on('peers', function () { if (S.ph === 'q') pushState(); });
    loadLib();
  }
  api.on('lang', render);
  setInterval(updTimer, 500);
  render();
}
